---
name: verification-site
description: Pièges mesurés de la vérification de tremplinapp.ch. Charger avant de servir le site en local, de piloter un navigateur sur ses pages, de lancer axe-core ou de mesurer la version en ligne.
---

# Vérification du site

- Serveur local: `python3 -m http.server` ne résout pas les URL sans extension, contrairement à GitHub Pages: tester avec l'extension .html. Un test sans JavaScript servi sous une route décalée fait échouer les feuilles de style à chemin relatif.
- Navigateur piloté: un onglet masqué fait expirer les clics et ne joue aucune animation de défilement; garder l'onglet visible pendant une mesure.
- Accessibilité: axe-core sur les quatre pages, desktop et mobile, transitions neutralisées; une violation de contraste signalée pendant un fondu se contre-vérifie par calcul.
- En ligne: mesurer au curl, code HTTP et Content-Type, pas à l'oeil. Une image cassée se mesure au curl.
