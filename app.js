// Sprint 1 – S4 : le joueur voit sur une carte les déchets signalés.

const CLE_STOCKAGE = "seacrap-dechets";

// Charge les déchets depuis le navigateur ; au premier lancement,
// on part des données fictives (T2). Les sprints suivants ajouteront
// les signalements (S5) et les ramassages (S7) dans ce même stockage.
function chargerDechets() {
  try {
    const sauvegarde = localStorage.getItem(CLE_STOCKAGE);
    if (sauvegarde) return JSON.parse(sauvegarde);
  } catch (e) {
    console.warn("Stockage local indisponible, données fictives utilisées.", e);
  }
  return DECHETS_INITIAUX;
}

function formaterDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

// --- Carte centrée sur la rade de Brest ---
const carte = L.map("map", { zoomControl: false }).setView([48.345, -4.43], 11);
L.control.zoom({ position: "topright" }).addTo(carte);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; contributeurs OpenStreetMap"
}).addTo(carte);

// --- Marqueurs des déchets ---
const dechets = chargerDechets();

dechets.forEach((dechet) => {
  const type = TYPES_DECHETS[dechet.type];

  L.circleMarker([dechet.lat, dechet.lng], {
    radius: 9,
    color: "#fff",
    weight: 2,
    fillColor: type.couleur,
    fillOpacity: 0.95
  })
    .addTo(carte)
    .bindPopup(`
      <div class="popup">
        <h3>${dechet.lieu}</h3>
        <p>Signalé par <strong>${dechet.signalePar}</strong></p>
        <p>Le ${formaterDate(dechet.date)}</p>
        <span class="badge" style="background:${type.couleur}">${type.label}</span>
      </div>
    `);
});

// --- Compteur et légende ---
document.getElementById("counter").textContent =
  `${dechets.length} déchet${dechets.length > 1 ? "s" : ""} à ramasser`;

document.getElementById("legend").innerHTML = Object.values(TYPES_DECHETS)
  .map((t) => `
    <span class="legend-item">
      <span class="dot" style="background:${t.couleur}"></span>${t.label}
    </span>`)
  .join("");
