// Seacrap – logique de l'application.
// Sprint 1 : carte des déchets (S4).
// Sprint 2 : menu, signalement avec photo et position (S5), type (S6), photo dans la fiche.
// Sprint 3 : connexion (S2), carte recentrée sur le joueur, zone Brest et Plouzané,
//            ramassage (S7), points (S8), collection par type (S9).

// La clé change au sprint 3 : les nouvelles données (Brest et Plouzané)
// remplacent celles de toute la rade enregistrées aux sprints précédents.
const CLE_STOCKAGE = "seacrap-dechets-v3";
const CLE_JOUEUR = "seacrap-joueur";
const CENTRE_BREST = [48.372, -4.525]; // vue qui couvre Brest et Plouzané

// ---------- Données ----------

function lire(cle, valeurParDefaut) {
  try {
    const brut = localStorage.getItem(cle);
    if (brut) return JSON.parse(brut);
  } catch (e) {
    console.warn("Stockage local indisponible.", e);
  }
  return valeurParDefaut;
}

function ecrire(cle, valeur) {
  try {
    localStorage.setItem(cle, JSON.stringify(valeur));
    return true;
  } catch (e) {
    console.warn("Impossible d'enregistrer (stockage plein ou bloqué).", e);
    return false;
  }
}

const dechets = lire(CLE_STOCKAGE, DECHETS_INITIAUX);
let joueur = lire(CLE_JOUEUR, null); // { pseudo, points, collection: { type: nombre } }

const sauvegarderDechets = () => ecrire(CLE_STOCKAGE, dechets);
const sauvegarderJoueur = () => (joueur ? ecrire(CLE_JOUEUR, joueur) : localStorage.removeItem(CLE_JOUEUR));
const dechetsARamasser = () => dechets.filter((d) => !d.ramasse);

function formaterDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

// ---------- Navigation (menu du bas) ----------

const onglets = document.querySelectorAll(".tab");
const ECRANS_CONNEXION_REQUISE = ["collection", "classement"];
let ecranApresConnexion = null;

function afficherEcran(nom) {
  // S2 : la collection et le classement demandent d'être connecté.
  if (ECRANS_CONNEXION_REQUISE.includes(nom) && !joueur) {
    ecranApresConnexion = nom;
    return afficherVue("connexion", nom);
  }
  afficherVue(nom, nom);
}

function afficherVue(vue, ongletActif) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById(`view-${vue}`).classList.add("active");
  onglets.forEach((o) => o.classList.toggle("active", o.dataset.view === ongletActif));

  if (vue === "carte") setTimeout(() => carte.invalidateSize(), 50);
  if (vue === "signaler") ouvrirSignalement();
  if (vue === "collection") afficherCollection();
}

onglets.forEach((o) => o.addEventListener("click", () => afficherEcran(o.dataset.view)));

function afficherToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(afficherToast.minuteur);
  afficherToast.minuteur = setTimeout(() => (toast.hidden = true), 3500);
}

// ---------- Connexion (S2) ----------

document.getElementById("form-connexion").addEventListener("submit", (e) => {
  e.preventDefault();
  const pseudo = document.getElementById("pseudo").value.trim();
  const erreur = document.getElementById("erreur-connexion");
  if (pseudo.length < 3) {
    erreur.textContent = "Ton pseudo doit faire au moins 3 caractères.";
    erreur.hidden = false;
    return;
  }
  erreur.hidden = true;
  joueur = { pseudo, points: 0, collection: {} };
  sauvegarderJoueur();
  afficherToast(`Bienvenue ${pseudo} !`);
  afficherEcran(ecranApresConnexion || "collection");
  ecranApresConnexion = null;
});

document.getElementById("btn-deconnexion").addEventListener("click", () => {
  joueur = null;
  sauvegarderJoueur();
  afficherToast("Tu es déconnecté.");
  afficherEcran("carte");
});

// ---------- Points (S8) et collection (S9) ----------

function gagnerPoints(nombre, raison) {
  if (!joueur) {
    afficherToast(`${raison} Connecte-toi pour gagner des points !`);
    return;
  }
  joueur.points += nombre;
  sauvegarderJoueur();
  afficherToast(`${raison} +${nombre} points`);
}

function ajouterACollection(type) {
  if (!joueur) return false;
  const nouveau = !joueur.collection[type];
  joueur.collection[type] = (joueur.collection[type] || 0) + 1;
  sauvegarderJoueur();
  return nouveau;
}

function afficherCollection() {
  document.getElementById("profil-pseudo").textContent = joueur.pseudo;
  document.getElementById("profil-points").textContent = joueur.points;

  const types = Object.entries(TYPES_DECHETS);
  const obtenus = types.filter(([cle]) => joueur.collection[cle]).length;
  document.getElementById("collection-resume").textContent =
    `${obtenus} type${obtenus > 1 ? "s" : ""} de déchet collecté${obtenus > 1 ? "s" : ""} sur ${types.length}. Ramasse des déchets pour compléter ta collection.`;

  document.getElementById("collection-grid").innerHTML = types
    .map(([cle, t]) => {
      const nombre = joueur.collection[cle] || 0;
      return `
        <div class="collection-item ${nombre ? "" : "verrouille"}">
          <span class="collection-pastille" style="background:${t.couleur}">${nombre || "?"}</span>
          <span class="collection-nom">${t.label}</span>
          <span class="hint">${nombre ? `${nombre} ramassé${nombre > 1 ? "s" : ""}` : "À découvrir"}</span>
        </div>`;
    })
    .join("");
}

// ---------- Carte principale ----------

const carte = L.map("map", { zoomControl: false }).setView(CENTRE_BREST, 12);
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
      <button class="btn btn-petit" data-ramasser="${dechet.id}">J'ai ramassé ce déchet</button>
    </div>`;
}

const marqueurs = {};

function ajouterMarqueur(dechet) {
  const type = TYPES_DECHETS[dechet.type];
  const marqueur = L.circleMarker([dechet.lat, dechet.lng], {
    radius: 9,
    color: "#fff",
    weight: 2,
    fillColor: type.couleur,
    fillOpacity: 0.95
  })
    .addTo(carte)
    .bindPopup(contenuFiche(dechet), {
      maxWidth: 240,
      // la fiche ne doit pas passer sous l'en-tête ni sous le menu flottants
      autoPanPaddingTopLeft: [12, 90],
      autoPanPaddingBottomRight: [12, 120]
    });
  marqueurs[dechet.id] = marqueur;
  return marqueur;
}

dechetsARamasser().forEach(ajouterMarqueur);

function majCompteur() {
  const n = dechetsARamasser().length;
  // Format court pour ne pas déborder sur les petits écrans de téléphone.
  document.getElementById("counter").innerHTML = `<strong>${n}</strong> à ramasser`;
  document.getElementById("counter").title = `${n} déchet${n > 1 ? "s" : ""} à ramasser`;
}
majCompteur();

document.getElementById("legend").innerHTML = Object.values(TYPES_DECHETS)
  .map((t) => `
    <span class="legend-item">
      <span class="dot" style="background:${t.couleur}"></span>${t.label}
    </span>`)
  .join("");

// ---------- Carte recentrée sur le joueur (retour de la revue du sprint 2) ----------

let positionJoueur = null;
let marqueurJoueur = null;

function localiserJoueur(centrer) {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      positionJoueur = [pos.coords.latitude, pos.coords.longitude];
      if (marqueurJoueur) marqueurJoueur.setLatLng(positionJoueur);
      else {
        marqueurJoueur = L.circleMarker(positionJoueur, {
          radius: 8, color: "#fff", weight: 3, fillColor: "#2f80ed", fillOpacity: 1
        }).addTo(carte).bindTooltip("Vous êtes ici");
      }
      if (centrer) carte.setView(positionJoueur, 14);
    },
    () => {
      if (centrer && !localiserJoueur.dejaPrevenu) {
        localiserJoueur.dejaPrevenu = true;
        afficherToast("Position non disponible : carte centrée sur Brest.");
      }
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

localiserJoueur(true);
document.getElementById("btn-recentrer").addEventListener("click", () => {
  if (positionJoueur) carte.setView(positionJoueur, 15);
  localiserJoueur(true);
});

// ---------- Photos : réduction pour tenir dans le stockage du navigateur ----------

function reduirePhoto(fichier, rappel) {
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
      rappel(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = lecteur.result;
  };
  lecteur.readAsDataURL(fichier);
}

// ---------- Ramassage (S7) ----------

const champPhotoRamassage = document.getElementById("photo-ramassage");
let dechetEnCoursDeRamassage = null;

// Le bouton est dans la fiche du déchet. Leaflet bloque la propagation des clics
// dans les fiches : on les écoute donc en phase de capture, au niveau du document.
document.addEventListener("click", (e) => {
  const bouton = e.target.closest("[data-ramasser]");
  if (!bouton) return;
  dechetEnCoursDeRamassage = Number(bouton.dataset.ramasser);
  champPhotoRamassage.value = "";
  champPhotoRamassage.click(); // la photo du butin, comme une « capture »
}, true);

champPhotoRamassage.addEventListener("change", () => {
  const fichier = champPhotoRamassage.files[0];
  const dechet = dechets.find((d) => d.id === dechetEnCoursDeRamassage);
  if (!fichier || !dechet) return;

  reduirePhoto(fichier, (photo) => {
    dechet.ramasse = true;
    dechet.photoRamassage = photo;
    dechet.ramassePar = joueur ? joueur.pseudo : "Anonyme";
    dechet.dateRamassage = new Date().toISOString().slice(0, 10);
    sauvegarderDechets();

    carte.removeLayer(marqueurs[dechet.id]); // le déchet disparaît de la carte
    delete marqueurs[dechet.id];
    majCompteur();

    const label = TYPES_DECHETS[dechet.type].label;
    const nouveauType = ajouterACollection(dechet.type);
    gagnerPoints(POINTS.ramassage,
      nouveauType ? `Nouveau type dans ta collection : ${label} !` : "Déchet ramassé, bravo !");
  });
});

// ---------- Signalement (S5, S6) ----------

const champPhoto = document.getElementById("photo");
const apercu = document.getElementById("photo-apercu");
const champType = document.getElementById("type");
const texteErreur = document.getElementById("erreur");
let photoSignalement = null;
let miniCarte = null;
let repere = null;

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

champPhoto.addEventListener("change", () => {
  const fichier = champPhoto.files[0];
  if (!fichier) return;
  reduirePhoto(fichier, (photo) => {
    photoSignalement = photo;
    apercu.src = photo;
    apercu.hidden = false;
    document.getElementById("photo-texte").textContent = "Changer la photo";
  });
});

function placerRepere(latlng) {
  if (repere) repere.setLatLng(latlng);
  else repere = L.marker(latlng).addTo(miniCarte);
  miniCarte.setView(latlng, Math.max(miniCarte.getZoom(), 14));
}

function ouvrirSignalement() {
  if (!miniCarte) {
    miniCarte = L.map("mini-map").setView(positionJoueur || CENTRE_BREST, 12);
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
    signalePar: joueur ? joueur.pseudo : "Anonyme",
    date: new Date().toISOString().slice(0, 10),
    photo: photoSignalement
  };

  dechets.push(nouveau);
  const enregistre = sauvegarderDechets();
  const marqueur = ajouterMarqueur(nouveau);
  majCompteur();

  e.target.reset();
  photoSignalement = null;
  apercu.hidden = true;
  document.getElementById("photo-texte").textContent = "Prendre une photo";
  document.querySelectorAll(".type-btn").forEach((b) => b.classList.remove("selected"));
  champType.value = "";

  afficherEcran("carte");
  carte.setView([nouveau.lat, nouveau.lng], 15);
  marqueur.openPopup();
  if (!enregistre) afficherToast("Déchet signalé, mais il ne sera pas conservé après rechargement.");
  else gagnerPoints(POINTS.signalement, "Déchet signalé, merci !");
});
