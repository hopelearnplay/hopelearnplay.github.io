(function(){
  "use strict";
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header shrink + back-to-top visibility ---------- */
  var header = document.getElementById('siteHeader');
  var backBtn = document.getElementById('backToTop');
  var onScroll = function(){
    if(header) header.classList.toggle('scrolled', window.scrollY > 12);
    if(backBtn) backBtn.classList.toggle('show', window.scrollY > 500);
  };
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('primaryNav');
  if(toggle && nav){
    function closeNav(){
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }
    toggle.addEventListener('click', function(){
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Active nav link on scroll (in-page sections only) ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');
  if(sections.length && 'IntersectionObserver' in window){
    var navObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function(a){
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, {rootMargin: '-45% 0px -50% 0px'});
    sections.forEach(function(s){ navObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if(reduceMotion || !('IntersectionObserver' in window)){
    reveals.forEach(function(el){ el.classList.add('in-view'); });
  } else {
    var revealObserver = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    reveals.forEach(function(el){ revealObserver.observe(el); });
  }

  /* ---------- Back to top ---------- */
  if(backBtn){
    backBtn.addEventListener('click', function(){
      window.scrollTo({top:0, behavior: reduceMotion ? 'auto' : 'smooth'});
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
})();
