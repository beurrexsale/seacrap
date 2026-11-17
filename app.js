// Seacrap – logique de l'application.
// Sprint 1 : carte des déchets (S4).
// Sprint 2 : menu de navigation, signalement avec photo et position (S5),
//            choix du type (S6), photo dans la fiche du déchet.

const CLE_STOCKAGE = "seacrap-dechets";
const CENTRE_RADE = [48.345, -4.43];

// ---------- Données ----------

// Charge les déchets enregistrés dans le navigateur ;
// au premier lancement, on part des données fictives (T2).
function chargerDechets() {
  try {
    const sauvegarde = localStorage.getItem(CLE_STOCKAGE);
    if (sauvegarde) return JSON.parse(sauvegarde);
  } catch (e) {
    console.warn("Stockage local indisponible, données fictives utilisées.", e);
  }
  return DECHETS_INITIAUX;
}

// Enregistrement simple dans le navigateur.
// Le stockage complet (T3) est prévu au sprint 3.
function sauvegarderDechets() {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(dechets));
    return true;
  } catch (e) {
    console.warn("Impossible d'enregistrer (stockage plein ou bloqué).", e);
    return false;
  }
}

function formaterDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

const dechets = chargerDechets();

// ---------- Navigation (menu du bas) ----------

const onglets = document.querySelectorAll(".tab");

function afficherEcran(nom) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById(`view-${nom}`).classList.add("active");
  onglets.forEach((o) => o.classList.toggle("active", o.dataset.view === nom));

  // Leaflet doit recalculer sa taille quand une carte redevient visible.
  if (nom === "carte") setTimeout(() => carte.invalidateSize(), 50);
  if (nom === "signaler") ouvrirSignalement();
}

onglets.forEach((o) => o.addEventListener("click", () => afficherEcran(o.dataset.view)));

// ---------- Carte principale ----------

const carte = L.map("map", { zoomControl: false }).setView(CENTRE_RADE, 11);
L.control.zoom({ position: "topright" }).addTo(carte);

function ajouterFondDeCarte(map) {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; contributeurs OpenStreetMap"
  }).addTo(map);
}
ajouterFondDeCarte(carte);

function contenuFiche(dechet) {
  const type = TYPES_DECHETS[dechet.type];
  const photo = dechet.photo || illustrationExemple(dechet.type);
  const mention = dechet.photo ? "" : `<p class="mention">Photo d'exemple</p>`;
  return `
    <div class="popup">
      <img class="popup-photo" src="${photo}" alt="Photo du déchet">
      ${mention}
      <h3>${dechet.lieu}</h3>
      <p>Signalé par <strong>${dechet.signalePar}</strong></p>
      <p>Le ${formaterDate(dechet.date)}</p>
      <span class="badge" style="background:${type.couleur}">${type.label}</span>
    </div>`;
}

function ajouterMarqueur(dechet) {
  const type = TYPES_DECHETS[dechet.type];
  return L.circleMarker([dechet.lat, dechet.lng], {
    radius: 9,
    color: "#fff",
    weight: 2,
    fillColor: type.couleur,
    fillOpacity: 0.95
  })
    .addTo(carte)
    .bindPopup(contenuFiche(dechet), { maxWidth: 240 });
}

dechets.forEach(ajouterMarqueur);

function majCompteur() {
  document.getElementById("counter").textContent =
    `${dechets.length} déchet${dechets.length > 1 ? "s" : ""} à ramasser`;
}
majCompteur();

document.getElementById("legend").innerHTML = Object.values(TYPES_DECHETS)
  .map((t) => `
    <span class="legend-item">
      <span class="dot" style="background:${t.couleur}"></span>${t.label}
    </span>`)
  .join("");

// ---------- Signalement (S5, S6) ----------

const champPhoto = document.getElementById("photo");
const apercu = document.getElementById("photo-apercu");
const champType = document.getElementById("type");
const texteErreur = document.getElementById("erreur");
let photoSignalement = null;
let miniCarte = null;
let repere = null;

// S6 – boutons de choix du type
document.getElementById("type-grid").innerHTML = Object.entries(TYPES_DECHETS)
  .map(([cle, t]) => `
    <button type="button" class="type-btn" data-type="${cle}">
      <span class="dot" style="background:${t.couleur}"></span>${t.label}
    </button>`)
  .join("");

document.querySelectorAll(".type-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".type-btn").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    champType.value = btn.dataset.type;
  });
});

// Photo : on la réduit pour qu'elle tienne dans le stockage du navigateur.
champPhoto.addEventListener("change", () => {
  const fichier = champPhoto.files[0];
  if (!fichier) return;
  const lecteur = new FileReader();
  lecteur.onload = () => {
    const img = new Image();
    img.onload = () => {
      const max = 800;
      const ratio = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      photoSignalement = canvas.toDataURL("image/jpeg", 0.7);
      apercu.src = photoSignalement;
      apercu.hidden = false;
      document.getElementById("photo-texte").textContent = "Changer la photo";
    };
    img.src = lecteur.result;
  };
  lecteur.readAsDataURL(fichier);
});

// Position : GPS du téléphone, ou repère déplacé à la main sur la mini-carte.
function placerRepere(latlng) {
  if (repere) repere.setLatLng(latlng);
  else repere = L.marker(latlng).addTo(miniCarte);
  miniCarte.setView(latlng, Math.max(miniCarte.getZoom(), 14));
}

function ouvrirSignalement() {
  if (!miniCarte) {
    miniCarte = L.map("mini-map").setView(CENTRE_RADE, 11);
    ajouterFondDeCarte(miniCarte);
    miniCarte.on("click", (e) => {
      placerRepere(e.latlng);
      document.getElementById("position-texte").textContent = "Position choisie sur la carte.";
    });
  }
  setTimeout(() => miniCarte.invalidateSize(), 50);
  if (repere) return;

  const texte = document.getElementById("position-texte");
  if (!navigator.geolocation) {
    texte.textContent = "Géolocalisation indisponible : touche la carte pour placer le déchet.";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      placerRepere([pos.coords.latitude, pos.coords.longitude]);
      texte.textContent = "Position détectée par ton téléphone.";
    },
    () => {
      texte.textContent = "Position non autorisée : touche la carte pour placer le déchet.";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function afficherErreur(message) {
  texteErreur.textContent = message;
  texteErreur.hidden = !message;
}

function afficherToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => (toast.hidden = true), 3000);
}

document.getElementById("form-signaler").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!photoSignalement) return afficherErreur("Ajoute une photo du déchet.");
  if (!champType.value) return afficherErreur("Choisis le type de déchet.");
  if (!repere) return afficherErreur("Indique la position en touchant la carte.");
  afficherErreur("");

  const position = repere.getLatLng();
  const nouveau = {
    id: Date.now(),
    type: champType.value,
    lat: position.lat,
    lng: position.lng,
    lieu: document.getElementById("lieu").value.trim() || "Lieu non précisé",
    signalePar: "Moi", // le pseudo du joueur (S2) arrive au sprint 3
    date: new Date().toISOString().slice(0, 10),
    photo: photoSignalement
  };

  dechets.push(nouveau);
  const enregistre = sauvegarderDechets();
  const marqueur = ajouterMarqueur(nouveau);
  majCompteur();

  // Réinitialisation du formulaire
  e.target.reset();
  photoSignalement = null;
  apercu.hidden = true;
  document.getElementById("photo-texte").textContent = "📷 Prendre une photo";
  document.querySelectorAll(".type-btn").forEach((b) => b.classList.remove("selected"));
  champType.value = "";

  afficherEcran("carte");
  carte.setView([nouveau.lat, nouveau.lng], 15);
  marqueur.openPopup();
  afficherToast(enregistre
    ? "Déchet signalé, merci !"
    : "Déchet signalé, mais il ne sera pas conservé après rechargement.");
});
