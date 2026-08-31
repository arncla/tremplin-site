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
    piste.addEventListener('scroll', etat, { passive: true });
    window.addEventListener('resize', etat);
    etat();
  });

});
