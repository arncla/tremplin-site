# tremplinapp.ch, site vitrine

Site statique de l'app Tremplin: index, decouvrir, a-propos, confidentialite, 404, style.css, site.js, theme.js, fonts/, captures/. Hébergé sur GitHub Pages depuis le dépôt public arncla/tremplin-site, qui reste public. Chemin: /Users/arnaudclavien/App Pro/tremplin-site, branche main. Contexte: section site de TREMPLIN-CONTEXTE.md, dépôt iOS.

## Arrêts et rapport

Quand une étape ne demande pas mon avis, continue, et mets les notes d'état dans le même message que l'action suivante. Arrête-toi seulement si tu ne peux pas continuer sans moi, si aucune hypothèse de cause ne se confirme par une mesure, ou avant une action destructive ou hors de ce dépôt: suppression de données, force-push, réécriture d'historique, écriture dans un autre dépôt, action dans une console Apple ou Google. Un lot peut lever cette dernière limite par une autorisation explicite.
Lot long: tiens la checklist dans .claude/TASKS.md, hors git, coche au fil de l'eau et ajoute ce que tu découvres.
Chaque lot se termine par quatre rubriques, dans cet ordre: En attente de moi; Vérifié, avec la mesure; Non vérifié; Décisions prises, une ligne chacune.

## Git

- Avant toute modification: `cd "/Users/arnaudclavien/App Pro/tremplin-site" && git add . && { git commit -m "backup avant [tâche]" || true; } && git push`
- Commit final sélectif par chemins nommés, message en français. Le site n'évolue que par ce dépôt, jamais par l'interface GitHub.

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

## Méthode

- Aucune correction avant que la cause soit établie par une mesure. Exception unique: un invariant de sécurité existant qu'un changement viole s'applique sans attendre la reproduction.
- Aucun jugement visuel sur spécification, de mémoire ou sur un document: des pixels du rendu courant, dans les deux thèmes. Aucune valeur chiffrée transmise sans relevé dans le rendu réel.
- Un résultat d'outil se lit d'abord par sa vraisemblance physique, durée et volume, avant son verdict. Un vérificateur prouve la couverture de son propre périmètre, sinon il ne prouve que son silence.
- Une URL n'est vérifiée que si elle a été ouverte; annoncer une vérification qui n'a pas eu lieu est pire que ne rien annoncer. Un livrable annoncé dans un rapport se vérifie à l'existence.
- Un lot qui conclut qu'il n'y a rien à corriger est réussi s'il prouve que sa mesure aurait vu le défaut.
- Avant de servir le site en local, de piloter un navigateur, de lancer axe-core ou de mesurer la version en ligne: charger le skill verification-site.
