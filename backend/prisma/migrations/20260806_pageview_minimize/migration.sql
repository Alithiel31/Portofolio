-- Minimisation des données de visite.
-- L'origine conservée se limite désormais au pays et à la zone dérivée. `region` et `city`
-- sont supprimées : trop identifiantes pour l'usage (savoir si un visiteur vient du Canada
-- ou d'Europe), et le DROP purge du même coup les valeurs déjà enregistrées.
ALTER TABLE "PageView" DROP COLUMN IF EXISTS "region";
ALTER TABLE "PageView" DROP COLUMN IF EXISTS "city";

-- Les agrégats de /api/stats trient par date et regroupent par zone.
CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt");
CREATE INDEX IF NOT EXISTS "PageView_zone_idx" ON "PageView"("zone");
