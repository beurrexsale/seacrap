// T2 – Données fictives pour la démo.
// Les positions sont approximatives, le long des rivages de Brest et Plouzané.

const TYPES_DECHETS = {
  plastique:   { label: "Plastique",            couleur: "#e4572e" },
  verre:       { label: "Verre",                couleur: "#29a19c" },
  metal:       { label: "Métal",                couleur: "#7d8597" },
  peche:       { label: "Filet / cordage",      couleur: "#f3a712" },
  megots:      { label: "Mégots",               couleur: "#8c5e3c" },
  polystyrene: { label: "Polystyrène",          couleur: "#6c63ff" },
  textile:     { label: "Textile",              couleur: "#d1495b" }
};

// Sprint 3 : la zone est limitée à Brest et Plouzané (retour de la revue croisée).
const DECHETS_INITIAUX = [
  { id: 1,  type: "plastique",   lat: 48.3925, lng: -4.4310, lieu: "Brest – Plage du Moulin Blanc",        signalePar: "MarinDu29",  date: "2026-11-15" },
  { id: 2,  type: "megots",      lat: 48.3940, lng: -4.4265, lieu: "Brest – Plage du Moulin Blanc",        signalePar: "Lena_B",     date: "2026-11-16" },
  { id: 3,  type: "polystyrene", lat: 48.3912, lng: -4.4282, lieu: "Brest – Plage du Moulin Blanc",        signalePar: "Tom_Plouz",  date: "2026-11-14" },
  { id: 4,  type: "verre",       lat: 48.3895, lng: -4.4370, lieu: "Brest – Port du Moulin Blanc",         signalePar: "KayakMax",   date: "2026-11-14" },
  { id: 5,  type: "textile",     lat: 48.3940, lng: -4.4450, lieu: "Brest – Anse Saint-Marc",              signalePar: "Chloe.R",    date: "2026-11-13" },
  { id: 6,  type: "peche",       lat: 48.3830, lng: -4.4760, lieu: "Brest – Port de commerce",             signalePar: "Yann.L",     date: "2026-11-13" },
  { id: 7,  type: "metal",       lat: 48.3818, lng: -4.4705, lieu: "Brest – Port de commerce",             signalePar: "Ewen_K",     date: "2026-11-16" },
  { id: 8,  type: "megots",      lat: 48.3800, lng: -4.4840, lieu: "Brest – Sous le cours Dajot",          signalePar: "Noa_Brest",  date: "2026-11-16" },
  { id: 9,  type: "plastique",   lat: 48.3790, lng: -4.4930, lieu: "Brest – Port du Château",              signalePar: "Sarah29",    date: "2026-11-16" },
  { id: 10, type: "metal",       lat: 48.3600, lng: -4.5480, lieu: "Plouzané – Sainte-Anne-du-Portzic",    signalePar: "Lena_B",     date: "2026-11-12" },
  { id: 11, type: "plastique",   lat: 48.3608, lng: -4.5455, lieu: "Plouzané – Sainte-Anne-du-Portzic",    signalePar: "MarinDu29",  date: "2026-11-15" },
  { id: 12, type: "polystyrene", lat: 48.3657, lng: -4.5312, lieu: "Plouzané – Plage du Dellec",           signalePar: "Tom_Plouz",  date: "2026-11-15" },
  { id: 13, type: "verre",       lat: 48.3590, lng: -4.5640, lieu: "Plouzané – Anse du Technopôle",        signalePar: "Gwen.A",     date: "2026-11-11" },
  { id: 14, type: "peche",       lat: 48.3535, lng: -4.5790, lieu: "Plouzané – Fort de Mengant",           signalePar: "KayakMax",   date: "2026-11-16" },
  { id: 15, type: "plastique",   lat: 48.3430, lng: -4.6110, lieu: "Plouzané – Plage du Minou",            signalePar: "Chloe.R",    date: "2026-11-12" },
  { id: 16, type: "textile",     lat: 48.3442, lng: -4.6085, lieu: "Plouzané – Plage du Minou",            signalePar: "Ewen_K",     date: "2026-11-10" }
];

// Sprint 3 – S8 : barème des points.
const POINTS = { signalement: 10, ramassage: 20, nouveauType: 15 }; // nouveauType : bonus H10 (sprint 4)

// Joueurs fictifs : serviront au classement (S10) dans un prochain sprint.
const JOUEURS_INITIAUX = [
  { pseudo: "MarinDu29", points: 340 },
  { pseudo: "KayakMax",  points: 295 },
  { pseudo: "Lena_B",    points: 270 },
  { pseudo: "Sarah29",   points: 210 },
  { pseudo: "Yann.L",    points: 185 },
  { pseudo: "Ewen_K",    points: 160 },
  { pseudo: "Tom_Plouz", points: 140 },
  { pseudo: "Chloe.R",   points: 115 },
  { pseudo: "Noa_Brest", points: 90 },
  { pseudo: "Gwen.A",    points: 55 }
];

// Sprint 2 – Illustration affichée dans la fiche des déchets fictifs,
// qui n'ont pas de vraie photo. Clairement signalée « Photo d'exemple ».
function illustrationExemple(type) {
  const t = TYPES_DECHETS[type];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140">
      <rect width="240" height="140" fill="#e8dcc4"/>
      <path d="M0 95 Q60 80 120 95 T240 92 V140 H0Z" fill="#d9c9a8"/>
      <path d="M0 0 H240 V40 Q180 52 120 42 T0 46Z" fill="#7fb7c9"/>
      <circle cx="120" cy="88" r="26" fill="${t.couleur}" opacity="0.9"/>
      <text x="120" y="130" font-family="sans-serif" font-size="14" font-weight="700"
            text-anchor="middle" fill="#3b3b3b">${t.label}</text>
    </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
