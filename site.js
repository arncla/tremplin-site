document.documentElement.classList.add('js');

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

  // Les captures ne basculent qu'au moment ou le sombre est demande : un visiteur
  // qui reste en clair ne telecharge jamais la seconde serie. Une capture sans
  // jumelle, ios-guide-quiz, garde sa version claire sans rien casser.
  function basculerCaptures(sombre){
    document.querySelectorAll('img[data-sombre]').forEach(function(img){
      if(sombre){
        if(!img.dataset.clair) img.dataset.clair = img.getAttribute('src');
        img.setAttribute('src', img.dataset.sombre);
      } else if(img.dataset.clair){
        img.setAttribute('src', img.dataset.clair);
      }
    });
  }

  function appliquer(sombre, memoriser){
    if(sombre) racine.setAttribute('data-theme','sombre');
    else racine.removeAttribute('data-theme');
    if(bascule){
      bascule.setAttribute('aria-pressed', sombre ? 'true' : 'false');
      bascule.setAttribute('aria-label', sombre ? 'Passer en mode clair' : 'Passer en mode sombre');
    }
    var couleur = document.querySelector('meta[name="theme-color"]');
    if(couleur) couleur.setAttribute('content', sombre ? '#1A1512' : '#FBF6EE');
    basculerCaptures(sombre);
    if(memoriser){
      try { localStorage.setItem('tremplin-theme', sombre ? 'sombre' : 'clair'); }
      catch(e){ /* stockage refuse : le choix vaut pour cette page seulement */ }
    }
  }

  // Etat de depart : theme.js a deja pose l'attribut, on aligne le bouton et les
  // captures dessus sans rien reecrire dans le stockage.
  appliquer(themeSombre(), false);

  if(bascule){
    bascule.addEventListener('click', function(){ appliquer(!themeSombre(), true); });
  }

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
      var inutile = max <= 2;
      prec.parentNode.style.visibility = inutile ? 'hidden' : 'visible';
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
