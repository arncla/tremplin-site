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
  var racine = document.documentElement;
  racine.classList.add('js');
  /* Filet de securite. site.js pose la classe js-actif des le debut de son
   * initialisation. Si elle manque encore quatre secondes plus tard, c'est que
   * site.js n'est pas arrive (requete bloquee ou en echec) : on retire alors
   * js, les contenus animes redeviennent visibles et la navigation reprend sa
   * forme sans script. Dans le cas nominal site.js s'execute bien avant et ce
   * minuteur ne change rien. */
  setTimeout(function () {
    if (!racine.classList.contains('js-actif')) racine.classList.remove('js');
  }, 4000);
  try {
    if (localStorage.getItem('tremplin-theme') === 'sombre') {
      racine.setAttribute('data-theme', 'sombre');
    }
  } catch (e) {
    /* Stockage refusé, navigation privée verrouillée : on reste en clair. */
  }
})();
