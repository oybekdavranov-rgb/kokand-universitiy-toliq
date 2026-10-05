/* =====================================================================
   KU COSMIC — 2026 harakat qatlami (progressive enhancement)
   Bog'liqliksiz. prefers-reduced-motion hurmat qilinadi.
   HTML o'zgartirilmaydi — maqsadlar avtomatik tanlanadi.
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('ku-js');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  /* --- 1. Scroll progress bar --- */
  function progressBar() {
    var bar = document.createElement('div');
    bar.id = 'ku-progress';
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      var h = document.documentElement;
      var max = (h.scrollHeight - h.clientHeight) || 1;
      var pct = Math.min(100, Math.max(0, (h.scrollTop || window.pageYOffset) / max * 100));
      bar.style.width = pct + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* --- 2. Scroll-reveal (IntersectionObserver) --- */
  var REVEAL = [
    '.content_sections-content__left', '.content_sections-content__right',
    '.introduction-content__left', '.introduction-content__right',
    '.who_we_are-content', '.whats_on-container article', '.gform_wrapper',
    'img.content_sections-image', '.image-overlay'
  ];

  function reveal() {
    var nodes = document.querySelectorAll(REVEAL.join(','));
    if (!nodes.length) { return; }
    if (reduce || !('IntersectionObserver' in window)) {
      for (var j = 0; j < nodes.length; j++) { nodes[j].classList.add('ku-in'); }
      return;
    }
    var i;
    for (i = 0; i < nodes.length; i++) { nodes[i].setAttribute('data-ku-reveal', ''); }
    var io = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (entries[k].isIntersecting) {
          var el = entries[k].target;
          el.style.transitionDelay = (Math.random() * 0.12).toFixed(2) + 's';
          el.classList.add('ku-in');
          io.unobserve(el);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    for (i = 0; i < nodes.length; i++) { io.observe(nodes[i]); }
  }

  /* --- 3. Karta tilt + kursorga ergashuvchi yorug'lik --- */
  var TILT = [
    '.content_sections-content__left', '.introduction-content__left',
    '.who_we_are-content__icons-container', '.gform_wrapper'
  ];

  function tilt() {
    if (reduce) { return; }
    var cards = document.querySelectorAll(TILT.join(','));
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      card.classList.add('ku-tilt');
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    }
  }
  function onMove(e) {
    var card = e.currentTarget;
    var r = card.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width;
    var py = (e.clientY - r.top) / r.height;
    var rx = (0.5 - py) * 5;   // daraja
    var ry = (px - 0.5) * 6;
    card.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px)';
    card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
    card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
  }
  function onLeave(e) {
    e.currentTarget.style.transform = '';
  }

  ready(function () {
    progressBar();
    reveal();
    tilt();
  });
})();
