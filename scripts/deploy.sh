#!/usr/bin/env bash
# Déploiement du portfolio : met le dépôt à jour, reconstruit la stack, attend qu'elle réponde
# et revient automatiquement au commit précédent si elle ne devient pas saine.
#
# Usage (sur le Pi, ou depuis un poste avec DOCKER_HOST=ssh://… et HEALTH_URL joignable) :
#   scripts/deploy.sh            # déploie si origin a de nouveaux commits
#   scripts/deploy.sh --force    # reconstruit même sans nouveau commit
#
# Variables :
#   HEALTH_URL      URL du healthcheck (défaut : Traefik local, http://localhost:8000/api/health)
#   HEALTH_HOST     en-tête Host envoyé à Traefik (défaut : alithiel31.dev ; vide = aucun)
#   HEALTH_TIMEOUT  secondes d'attente avant de déclarer l'échec (défaut : 120)
#
# ⚠️ Le retour arrière ne concerne que le code et les images : une migration Prisma déjà
# appliquée par la nouvelle version reste en base. Une migration destructive se déploie à part.

set -euo pipefail

HEALTH_URL="${HEALTH_URL:-http://localhost:8000/api/health}"
HEALTH_HOST="${HEALTH_HOST-alithiel31.dev}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-120}"
FORCE=false

for arg in "$@"; do
  case "$arg" in
    --force) FORCE=true ;;
    -h | --help)
      sed -n '2,16p' "$0"
      exit 0
      ;;
    *)
      echo "Argument inconnu : $arg" >&2
      exit 64
      ;;
  esac
done

cd "$(dirname "$0")/.."

log() { printf '[deploy] %s\n' "$*"; }

wait_healthy() {
  local deadline=$((SECONDS + HEALTH_TIMEOUT))
  local curl_args=(-fsS --max-time 5 -o /dev/null)
  [[ -n "$HEALTH_HOST" ]] && curl_args+=(-H "Host: $HEALTH_HOST")
  while ((SECONDS < deadline)); do
    if curl "${curl_args[@]}" "$HEALTH_URL" 2>/dev/null; then
      return 0
    fi
    sleep 3
  done
  return 1
}

# Démarre la version actuellement extraite. Échoue si Compose échoue (le frontend attend un
# backend sain : `up` sort en erreur si le backend ne le devient jamais) ou si le healthcheck
# ne répond pas à temps.
start_and_check() {
  docker compose up --build -d --remove-orphans || return 1
  log "attente du healthcheck ($HEALTH_URL, ${HEALTH_TIMEOUT}s max)…"
  wait_healthy
}

# Un `git reset --hard` sert au retour arrière : on refuse de tourner sur des modifications
# locales qu'il effacerait.
if ! git diff --quiet || ! git diff --cached --quiet; then
  log "modifications locales non commitées : déploiement annulé." >&2
  git status --short >&2
  exit 1
fi

PREV="$(git rev-parse HEAD)"
log "version actuelle : $(git log -1 --format='%h %s' "$PREV")"

git pull --ff-only --quiet
NEW="$(git rev-parse HEAD)"

if [[ "$NEW" == "$PREV" && "$FORCE" == false ]]; then
  log "déjà à jour, rien à déployer (--force pour reconstruire quand même)."
  exit 0
fi
log "nouvelle version : $(git log -1 --format='%h %s' "$NEW")"

if start_and_check; then
  log "health OK — $(git log -1 --format='%h' "$NEW") déployé."
  exit 0
fi

log "ÉCHEC : la stack ne répond pas. Retour à $(git log -1 --format='%h' "$PREV")." >&2
docker compose logs --tail=50 backend >&2 || true

git reset --hard --quiet "$PREV"

if start_and_check; then
  log "retour arrière OK — $(git log -1 --format='%h' "$PREV") de nouveau en ligne." >&2
  exit 1
fi

log "le retour arrière ne répond pas non plus : intervention manuelle nécessaire." >&2
exit 2
