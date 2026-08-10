// Opposition à la mesure d'audience.
//
// Le tracker de /api/track relève de l'exemption de consentement CNIL (mesure d'audience
// strictement first-party, sans recoupement ni partage, IP jamais persistée). Offrir un
// opt-out n'est donc pas une obligation, mais c'est ce qui rend l'exemption défendable —
// et ça évite d'imposer un bandeau à tous les visiteurs.

const KEY = 'analytics-opt-out';

function read() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    // Stockage indisponible (mode privé strict, cookies bloqués) : on respecte le refus.
    return true;
  }
}

let _optedOut = $state(read());

export const analytics = {
  get optedOut() {
    return _optedOut;
  },
  set(value) {
    _optedOut = value;
    try {
      if (value) localStorage.setItem(KEY, '1');
      else localStorage.removeItem(KEY);
    } catch {
      // Rien à persister : l'état reste valable pour la session en cours.
    }
  },
  toggle() {
    analytics.set(!_optedOut);
  },
};
