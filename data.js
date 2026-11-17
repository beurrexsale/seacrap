// T2 – Données fictives pour la démo.
// Les positions sont approximatives, le long des rivages de la rade de Brest.

const TYPES_DECHETS = {
  plastique:   { label: "Plastique",            couleur: "#e4572e" },
  verre:       { label: "Verre",                couleur: "#29a19c" },
  metal:       { label: "Métal",                couleur: "#7d8597" },
  peche:       { label: "Filet / cordage",      couleur: "#f3a712" },
  megots:      { label: "Mégots",               couleur: "#8c5e3c" },
  polystyrene: { label: "Polystyrène",          couleur: "#6c63ff" },
  textile:     { label: "Textile",              couleur: "#d1495b" }
};

const DECHETS_INITIAUX = [
  { id: 1,  type: "plastique",   lat: 48.3925, lng: -4.4310, lieu: "Plage du Moulin Blanc",        signalePar: "MarinDu29",  date: "2026-11-15" },
  { id: 2,  type: "megots",      lat: 48.3940, lng: -4.4265, lieu: "Plage du Moulin Blanc",        signalePar: "Lena_B",     date: "2026-11-16" },
  { id: 3,  type: "verre",       lat: 48.4025, lng: -4.3965, lieu: "Le Relecq-Kerhuon",            signalePar: "KayakMax",   date: "2026-11-14" },
  { id: 4,  type: "peche",       lat: 48.3830, lng: -4.4760, lieu: "Port de commerce",             signalePar: "Yann.L",     date: "2026-11-13" },
  { id: 5,  type: "plastique",   lat: 48.3790, lng: -4.4930, lieu: "Port du Château",              signalePar: "Sarah29",    date: "2026-11-16" },
  { id: 6,  type: "metal",       lat: 48.3600, lng: -4.5480, lieu: "Sainte-Anne-du-Portzic",       signalePar: "Lena_B",     date: "2026-11-12" },
  { id: 7,  type: "polystyrene", lat: 48.3640, lng: -4.5300, lieu: "Plage du Dellec",              signalePar: "Tom_Plouz",  date: "2026-11-15" },
  { id: 8,  type: "plastique",   lat: 48.3720, lng: -4.4080, lieu: "Plougastel – Anse du Caro",    signalePar: "KayakMax",   date: "2026-11-11" },
  { id: 9,  type: "peche",       lat: 48.3550, lng: -4.3880, lieu: "Plougastel – Porz Gwenn",      signalePar: "MarinDu29",  date: "2026-11-16" },
  { id: 10, type: "textile",     lat: 48.3340, lng: -4.3640, lieu: "Pointe de l'Armorique",        signalePar: "Chloe.R",    date: "2026-11-10" },
  { id: 11, type: "verre",       lat: 48.3220, lng: -4.3060, lieu: "Logonna-Daoulas",              signalePar: "Sarah29",    date: "2026-11-14" },
  { id: 12, type: "plastique",   lat: 48.3110, lng: -4.2950, lieu: "Anse de Moulin Mer",           signalePar: "Yann.L",     date: "2026-11-13" },
  { id: 13, type: "metal",       lat: 48.2930, lng: -4.3290, lieu: "Landévennec",                  signalePar: "Ewen_K",     date: "2026-11-09" },
  { id: 14, type: "peche",       lat: 48.2900, lng: -4.4610, lieu: "Lanvéoc",                      signalePar: "Ewen_K",     date: "2026-11-15" },
  { id: 15, type: "polystyrene", lat: 48.2860, lng: -4.5040, lieu: "Le Fret",                      signalePar: "Tom_Plouz",  date: "2026-11-16" },
  { id: 16, type: "plastique",   lat: 48.3080, lng: -4.5480, lieu: "Roscanvel",                    signalePar: "Chloe.R",    date: "2026-11-12" },
  { id: 17, type: "megots",      lat: 48.3870, lng: -4.4600, lieu: "Plage du port de plaisance",   signalePar: "Noa_Brest",  date: "2026-11-16" },
  { id: 18, type: "verre",       lat: 48.3975, lng: -4.4150, lieu: "Pont de l'Iroise",             signalePar: "Noa_Brest",  date: "2026-11-14" },
  { id: 19, type: "textile",     lat: 48.3480, lng: -4.4060, lieu: "Plougastel – Kerdéniel",       signalePar: "MarinDu29",  date: "2026-11-11" },
  { id: 20, type: "plastique",   lat: 48.3010, lng: -4.4010, lieu: "Anse de Poulmic",              signalePar: "Lena_B",     date: "2026-11-15" }
];

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
