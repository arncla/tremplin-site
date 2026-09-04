// js-actif dit a theme.js que site.js est bien arrive : sans elle, theme.js
// retire la classe js au bout de quatre secondes pour que rien ne reste cache.
// On repose js au passage, au cas ou ce fichier arriverait apres ce delai.
document.documentElement.classList.add('js', 'js-actif');

document.addEventListener('DOMContentLoaded', function(){

  var doux = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var cibles = document.querySelectorAll('.anim, .zoom');
  if(doux || !('IntersectionObserver' in window)){
    cibles.forEach(function(el){ el.classList.add('vu'); });
  } else {
    var obs = new IntersectionObserver(function(entrees){
      entrees.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('vu');
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    cibles.forEach(function(el){ obs.observe(el); });
  }


  // ── Interrupteur de theme ────────────────────────────────────────────────
  //
  // Le theme est deja applique par theme.js, charge en tete et sans defer, pour
  // qu'aucun eclair clair ne precede le premier rendu. Ici on ne fait que gerer
  // le clic, l'etat annonce et la bascule des captures.
  //
  // Defaut clair : sans choix enregistre, aucun attribut n'est pose. Le theme du
  // systeme n'est volontairement pas suivi, un mode sombre automatique ayant ete
  // retire du site parce qu'il s'imposait au visiteur.
  var racine = document.documentElement;
  var bascule = document.querySelector('.bascule');

  function themeSombre(){ return racine.getAttribute('data-theme') === 'sombre'; }

  // ── Jumelles des captures : preparation et permutation ───────────────────
  //
  // Les variantes sombres ne figurent pas dans le HTML. Sans precaution, le clic
  // declenche autant de telechargements qu'il y a de captures affichees, et le
  // visiteur regarde des cases vides le temps qu'ils arrivent. Mesure sur un
  // lien 3G rapide, page application, avant correction : premiere image 1,6 s
  // apres le clic, derniere 12,7 s, et les 29 cases videes entre-temps.
  //
  // Deux precautions, donc :
  //   - les jumelles sont preparees APRES le rendu, en tache de fond et a basse
  //     priorite, pour ne pas concurrencer l'affichage de la page;
  //   - une nouvelle source n'est ecrite que lorsque l'image est prete, sinon le
  //     navigateur vide la case pendant le telechargement.
  var captures = [].slice.call(document.querySelectorAll('img[data-sombre]'));
  var pretes = Object.create(null);   // url connue en cache et decodee
  var enCours = Object.create(null);  // url -> promesse de preparation

  function preparer(url){
    if(!url) return Promise.resolve();
    if(pretes[url]) return Promise.resolve();
    if(enCours[url]) return enCours[url];
    enCours[url] = new Promise(function(resoudre){
      var im = new Image();
      try { im.fetchPriority = 'low'; } catch(e){ /* priorite non reglable */ }
      im.decoding = 'async';
      im.addEventListener('load', function(){ pretes[url] = true; resoudre(); }, { once: true });
      // Une jumelle absente ne doit pas bloquer la bascule : on laisse passer.
      im.addEventListener('error', function(){ resoudre(); }, { once: true });
      im.src = url;
    });
    return enCours[url];
  }

  // Les versions claires sont deja dans la page : des qu'elles sont chargees on
  // les note pretes, pour que le retour au clair soit instantane lui aussi.
  captures.forEach(function(img){
    img.dataset.clair = img.getAttribute('src');
    if(img.complete && img.naturalWidth > 0) pretes[img.dataset.clair] = true;
    else img.addEventListener('load', function(){ pretes[img.getAttribute('src')] = true; }, { once: true });
  });

  // immediat : reserve au premier passage, avant tout affichage. On y ecrit la
  // source sans attendre, ce qui evite a un visiteur revenant en sombre de
  // telecharger d'abord la serie claire.
  function permuter(img, url, immediat){
    if(!url) return;
    img.dataset.attendue = url;
    if(img.getAttribute('src') === url) return;
    if(immediat || pretes[url]){ img.setAttribute('src', url); return; }
    preparer(url).then(function(){
      // Un second clic entre-temps a pu changer la cible : on ne pose que la
      // derniere demandee. Les dimensions du HTML sont inchangees, donc aucun
      // saut de mise en page.
      if(img.dataset.attendue === url) img.setAttribute('src', url);
    });
  }

  function basculerCaptures(sombre, racineDom, immediat){
    var lot = (racineDom && racineDom !== document)
      ? [].slice.call(racineDom.querySelectorAll('img[data-sombre]'))
      : captures;
    lot.forEach(function(img){
      permuter(img, sombre ? img.dataset.sombre : img.dataset.clair, immediat);
    });
  }

  // Preparation de fond, une jumelle a la fois pour rester derriere le reste du
  // trafic, en commencant par les captures les plus proches du champ de vision.
  // Seules les jumelles des captures reellement presentes sont chargees.
  function eloignement(img){
    var r = img.getBoundingClientRect();
    if(r.bottom > 0 && r.top < window.innerHeight) return 0;
    return r.top < 0 ? -r.top : r.top - window.innerHeight;
  }

  function auRepos(f){
    if(window.requestIdleCallback) window.requestIdleCallback(f, { timeout: 3000 });
    else setTimeout(f, 1200);
  }

  function preparerLesJumelles(){
    var lien = navigator.connection;
    // Un visiteur en economie de donnees, ou sur un lien tres lent, ne paie pas
    // d'avance une serie qu'il ne demandera peut-etre jamais : la bascule reste
    // possible, elle chargera au clic.
    if(lien && (lien.saveData || /^(slow-)?2g$/.test(lien.effectiveType || ''))) return;
    var ordre = captures.slice().sort(function(a, b){ return eloignement(a) - eloignement(b); });
    (function suite(i){
      if(i >= ordre.length) return;
      var img = ordre[i];
      var autre = img.getAttribute('src') === img.dataset.sombre ? img.dataset.clair : img.dataset.sombre;
      preparer(autre).then(function(){ auRepos(function(){ suite(i + 1); }); });
    })(0);
  }

  if(captures.length){
    if(document.readyState === 'complete') auRepos(preparerLesJumelles);
    else window.addEventListener('load', function(){ auRepos(preparerLesJumelles); }, { once: true });
  }

  function appliquer(sombre, memoriser, immediat){
    if(sombre) racine.setAttribute('data-theme','sombre');
    else racine.removeAttribute('data-theme');
    if(bascule){
      // Nom accessible stable, "Mode sombre" : seul aria-pressed porte l'etat.
      bascule.setAttribute('aria-pressed', sombre ? 'true' : 'false');
    }
    var couleur = document.querySelector('meta[name="theme-color"]');
    if(couleur) couleur.setAttribute('content', sombre ? '#1A1512' : '#FBF6EE');
    basculerCaptures(sombre, document, immediat);
    galeries.forEach(function(g){ delete g.dataset.manuel; marquerGalerie(g, sombre); });
    if(memoriser){
      try { localStorage.setItem('tremplin-theme', sombre ? 'sombre' : 'clair'); }
      catch(e){ /* stockage refuse : le choix vaut pour cette page seulement */ }
    }
  }

  // ── Bascule propre a chaque galerie ──────────────────────────────────────
  //
  // Trois regles:
  //   1. par defaut une galerie suit le theme du site;
  //   2. un clic sur son bouton fixe son theme, elle ne suit plus le site;
  //   3. des que le theme du site change, toutes les galeries se realignent et
  //      oublient leur reglage manuel.
  //
  // Ce reglage n'est PAS memorise entre deux visites: il vit le temps de la
  // page. Seul le theme global est persiste, donc aucun stockage nouveau n'est
  // introduit et la page de confidentialite reste exacte.
  var galeries = [].slice.call(document.querySelectorAll('.galerie'));

  function marquerGalerie(galerie, sombre){
    galerie.dataset.galerieTheme = sombre ? 'sombre' : 'clair';
    var bouton = galerie.querySelector('.bascule-galerie');
    if(bouton) bouton.setAttribute('aria-pressed', sombre ? 'true' : 'false');
  }

  galeries.forEach(function(galerie){
    var bouton = galerie.querySelector('.bascule-galerie');
    if(!bouton) return;
    bouton.addEventListener('click', function(){
      var sombre = galerie.dataset.galerieTheme !== 'sombre';
      galerie.dataset.manuel = '1';
      marquerGalerie(galerie, sombre);
      basculerCaptures(sombre, galerie);
    });
  });

  // Etat de depart : theme.js a deja pose l'attribut, on aligne le bouton et les
  // captures dessus sans rien reecrire dans le stockage.
  appliquer(themeSombre(), false, true);

  if(bascule){
    bascule.addEventListener('click', function(){ appliquer(!themeSombre(), true); });
  }

  // ── Sommaire local : le focus va sur le titre de la section ─────────────
  //
  // L'ancre reste la section, la position de defilement ne change donc pas.
  // C'est son titre h2, porteur de tabindex=-1, qui recoit le focus : le
  // contour entoure le titre et non toute la section.
  function focaliserTitre(id){
    var section = id && document.getElementById(id);
    var titre = section && section.querySelector('h2[tabindex="-1"]');
    if(titre) titre.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', function(){ focaliserTitre(location.hash.slice(1)); });
  document.querySelectorAll('.sommaire-page a[href^="#"]').forEach(function(lien){
    lien.addEventListener('click', function(){
      var id = lien.getAttribute('href').slice(1);
      setTimeout(function(){ focaliserTitre(id); }, 0);
    });
  });

  // ── Copie de l'adresse ───────────────────────────────────────────────────
  // Presse-papiers du navigateur uniquement : aucun service, aucun stockage.
  // Le retour est ecrit dans une zone aria-live pour etre annonce.
  document.querySelectorAll('.copier').forEach(function(bouton){
    var retour = bouton.parentNode.querySelector('.copie-retour');
    function dire(message){ if(retour) retour.textContent = message; }
    bouton.addEventListener('click', function(){
      var adresse = bouton.dataset.adresse || '';
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(adresse).then(
          function(){ dire('Adresse copiée'); },
          function(){ dire('Copie impossible, sélectionne l\'adresse.'); });
      } else {
        dire('Copie impossible, sélectionne l\'adresse.');
      }
    });
  });

  var burger = document.querySelector('.burger');
  var barre = document.querySelector('.barre');
  if(burger && barre){
    burger.addEventListener('click', function(){
      var ouvert = barre.classList.toggle('ouvert');
      burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
      burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    barre.querySelectorAll('nav a').forEach(function(lien){
      lien.addEventListener('click', function(){
        barre.classList.remove('ouvert');
        burger.setAttribute('aria-expanded','false');
        burger.setAttribute('aria-label','Ouvrir le menu');
      });
    });
    document.addEventListener('keydown', function(e){
      if((e.key === 'Escape' || e.key === 'Esc') && barre.classList.contains('ouvert')){
        barre.classList.remove('ouvert');
        burger.setAttribute('aria-expanded','false');
        burger.setAttribute('aria-label','Ouvrir le menu');
        burger.focus();
      }
    });
  }

  document.querySelectorAll('.galerie').forEach(function(galerie){
    var piste = galerie.querySelector('.piste');
    var prec = galerie.querySelector('.fleche.prec');
    var suiv = galerie.querySelector('.fleche.suiv');
    if(!piste || !prec || !suiv) return;

    function pas(){
      var vue = piste.querySelector('.vue');
      return vue ? vue.offsetWidth + 22 : 220;
    }
    function etat(){
      var max = piste.scrollWidth - piste.clientWidth - 2;
      prec.disabled = piste.scrollLeft <= 2;
      suiv.disabled = piste.scrollLeft >= max;
      // On masque les deux fleches, pas la rangee: elle porte desormais le
      // bouton de bascule, qui doit rester visible meme sans defilement.
      var inutile = max <= 2;
      prec.style.visibility = inutile ? 'hidden' : 'visible';
      suiv.style.visibility = inutile ? 'hidden' : 'visible';
    }
    prec.addEventListener('click', function(){
      piste.scrollBy({ left: -pas(), behavior: doux ? 'auto' : 'smooth' });
    });
    suiv.addEventListener('click', function(){
      piste.scrollBy({ left: pas(), behavior: doux ? 'auto' : 'smooth' });
    });
    piste.addEventListener('keydown', function(e){
      if(e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var max = piste.scrollWidth - piste.clientWidth;
      if(max <= 2) return;
      var delta = e.key === 'ArrowRight' ? pas() : -pas();
      var cible = Math.max(0, Math.min(max, piste.scrollLeft + delta));
      if(Math.abs(cible - piste.scrollLeft) < 1) return;
      e.preventDefault();
      piste.scrollBy({ left: delta, behavior: doux ? 'auto' : 'smooth' });
    });
    piste.addEventListener('scroll', etat, { passive: true });
    window.addEventListener('resize', etat);
    etat();
  });

});
