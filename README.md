# Seacrap – Zéro déchet en rade de Brest

Application web mobile de collecte de déchets gamifiée (projet M2 Gestion de projet).

## Lancer en local

Ouvrir `index.html` dans un navigateur, ou lancer un petit serveur :

```
python -m http.server 8000
```

puis aller sur http://localhost:8000.

## Déployer (GitHub Pages)

1. Pousser le dossier sur un dépôt GitHub.
2. Settings → Pages → Source : branche `main`, dossier `/ (root)`.
3. L'URL publique s'affiche après une minute.

## Structure

- `index.html` : page principale
- `style.css` : styles (mobile d'abord)
- `data.js` : données fictives (déchets et joueurs)
- `app.js` : logique de l'application

## Historique des incréments

| Sprint | Contenu | Tag Git |
| --- | --- | --- |
| 1 | Carte de la rade avec les déchets signalés, données fictives, légende | `sprint-1` |
| 2 | Menu de navigation, signalement avec photo, position et type, photo dans la fiche | `sprint-2` |
