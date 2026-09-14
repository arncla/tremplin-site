# tremplinapp.ch, site vitrine

Site statique de l'app Tremplin: index, decouvrir, a-propos, confidentialite, 404, style.css, site.js, theme.js, fonts/, captures/. Hébergé sur GitHub Pages depuis le dépôt public arncla/tremplin-site, qui reste public. Chemin: /Users/arnaudclavien/App Pro/tremplin-site, branche main. Contexte: section site de TREMPLIN-CONTEXTE.md, dépôt iOS.

## Git

- Avant toute modification: `cd "/Users/arnaudclavien/App Pro/tremplin-site" && git add . && { git commit -m "backup avant [tâche]" || true; } && git push`
- Commit final sélectif par chemins nommés, message en français. Le site n'évolue que par ce dépôt, jamais par l'interface GitHub. Édition chirurgicale, pas de réécriture de fichier.

## Règles

- Aucune ressource chargée depuis un domaine tiers: polices locales, aucun script ni image externe. La page de confidentialité l'affirme. CSP stricte en balise meta.
- GitHub Pages ne permet ni redirection, ni en-tête HTTP, ni cache au-delà de dix minutes: ne pas les proposer.
- Une seule phrase accrocheuse: "Tout ce qu'on ne t'a jamais expliqué". Aucun h1 ni h2 avec point final. Aucun tiret cadratin.
- Passages protégés, jamais reformulés: "Ils découvrent le problème le jour où il tombe dans la boîte aux lettres", la phrase sur l'intimité examinée par des adultes, "Tes données restent chez toi", "L'aide, à un geste", l'encart des numéros d'urgence.
- Formulation unique sur les données: aucune donnée n'est envoyée automatiquement à Tremplin. Jamais "rien ne quitte ton téléphone" ni "0 donnée collectée".
- Le site ne nomme jamais la Fondation ni la structure du pilote. Action principale: "Tester Tremplin dans votre structure". Statut du produit en tête de l'accueil; après toute suppression de section, contrôler ce qu'elle emportait.
- 147, 143 et 144 en liens tel:. Menu mobile sous 860 pixels avec aria-expanded.
- Captures: JPEG publiés versionnés ici, jumelles clair et sombre, produits par le dépôt iOS; jamais retouchés ici.
- Tout chiffre ou fait se vérifie sur source primaire avant publication et se signale à Arnaud pour validation.

## Vérification

- Serveur local: `python3 -m http.server` ne résout pas les URL sans extension, contrairement à GitHub Pages: tester avec l'extension .html. Un test sans JavaScript servi sous une route décalée fait échouer les feuilles de style à chemin relatif.
- Navigateur piloté: un onglet masqué fait expirer les clics et ne joue aucune animation de défilement; garder l'onglet visible pendant une mesure.
- Accessibilité: axe-core sur les quatre pages, desktop et mobile, transitions neutralisées; une violation de contraste signalée pendant un fondu se contre-vérifie par calcul.
- En ligne: mesurer au curl, code HTTP et Content-Type, pas à l'oeil.
