/* Applique le theme choisi AVANT le premier rendu.
 *
 * Chargé de façon synchrone dans le head, sans defer : le navigateur s'arrête
 * ici, pose l'attribut, puis peint. Sans cela le visiteur en sombre verrait un
 * éclair blanc à chaque chargement, le temps que site.js s'exécute.
 *
 * Fichier séparé et non script inline : la politique de sécurité du site déclare
 * script-src 'self' sans 'unsafe-inline', qui interdit le script en ligne. On
 * sort le script plutôt que d'assouplir la politique.
 *
 * Ce fichier ne dépend de rien et doit rester autonome : si site.js échoue, le
 * thème mémorisé s'applique quand même.
 *
 * Défaut clair : sans choix enregistré, aucun attribut n'est posé. Le thème du
 * système n'est volontairement pas suivi, un mode sombre automatique ayant été
 * retiré du site parce qu'il s'imposait au visiteur.
 */
(function () {
  document.documentElement.classList.add('js');
  try {
    if (localStorage.getItem('tremplin-theme') === 'sombre') {
      document.documentElement.setAttribute('data-theme', 'sombre');
    }
  } catch (e) {
    /* Stockage refusé, navigation privée verrouillée : on reste en clair. */
  }
})();
