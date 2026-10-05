/* ============================================================
   Kokand University — dizayn yaxshilanishlari (ku-enhance.js)
   Bog'liqliksiz (vanilla). Barcha sahifalarda ishlaydi.
   - Scroll-reveal (bo'limlar yumshoq paydo bo'ladi)
   - Hero sarlavha animatsiyasi
   - Rasmlar: skeleton + fade-in
   - Yopishqoq "liquid glass" menyu (scrollda)
   - Modal focus-trap + skip-link (a11y)
   Reduced-motion rejimida animatsiyalar o'chadi.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  /* ---------- Skip-link (a11y) ---------- */
  function mountSkipLink() {
    if (document.querySelector('.ku-skip')) return;
    var main = document.querySelector('main') ||
      document.querySelector('.site-header-container') ||
      document.querySelector('.page_hero-container') || document.body;
    if (!main.id) main.id = 'ku-main';
    var a = document.createElement('a');
    a.className = 'ku-skip';
    a.href = '#' + main.id;
    a.textContent = 'Asosiy kontentga o‘tish';
    document.body.insertBefore(a, document.body.firstChild);
  }

  /* ---------- Scroll-reveal ---------- */
  var REVEAL = [
    '.ku-news-card', '.ku-ach-card', '.greenes-post-container', '.greenes-page',
    '.who_we_are-content__section', '.ku-detail', '.feat', '.step', '.pcard',
    '.g-card', '.card', '.ku-story-card', '.cta-box'
  ].join(',');
  function mountReveal() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll(REVEAL));
    if (!nodes.length) return;
    if (reduce || !('IntersectionObserver' in window)) return; // kontent baribir ko'rinadi
    nodes.forEach(function (n, i) {
      n.classList.add('ku-reveal');
      n.style.setProperty('--ku-reveal-delay', (Math.min(i % 4, 3) * 70) + 'ms');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('ku-reveal--in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- Hero sarlavha animatsiyasi ---------- */
  function mountHero() {
    if (reduce) return;
    // Index hero (CMS span'lari bor) — butun sarlavhaga yumshoq kirish
    var cmsHero = document.querySelector('.page_hero-overlay__content');
    if (cmsHero) cmsHero.classList.add('ku-hero-in');
    // Oddiy hero (news/stories/galereya) — so'z bo'yicha stagger
    document.querySelectorAll('.ku-hero h1').forEach(function (h) {
      if (h.dataset.kuSplit === '1' || h.querySelector('[data-cms-id]')) return;
      var words = (h.textContent || '').split(/\s+/).filter(Boolean);
      if (words.length < 2 || words.length > 14) { h.classList.add('ku-hero-in'); return; }
      h.dataset.kuSplit = '1';
      h.innerHTML = words.map(function (w, i) {
        return '<span class="ku-word" style="animation-delay:' + (i * 60) + 'ms">' + w + '</span>';
      }).join(' ');
    });
  }

  /* ---------- Rasmlar: skeleton + fade-in ---------- */
  var IMG = '.ku-news-card img, .ku-ach-card img, .ku-detail img, .ku-detail-view .cover, .greenes-post img, .g-card img, .card img';
  function mountImages() {
    document.querySelectorAll(IMG).forEach(function (img) {
      if (img.dataset.kuImg === '1') return;
      img.dataset.kuImg = '1';
      img.classList.add('ku-imgfx');
      if (img.complete && img.naturalWidth > 0) { img.classList.add('ku-imgfx--in'); return; }
      img.addEventListener('load', function () { img.classList.add('ku-imgfx--in'); }, { once: true });
      img.addEventListener('error', function () { img.classList.add('ku-imgfx--in'); }, { once: true });
    });
  }

  /* ---------- Yopishqoq glass menyu ---------- */
  function mountStickyNav() {
    var header = document.querySelector('.site-header-container') || document.querySelector('.ku-page-header');
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 40) document.body.classList.add('ku-scrolled');
      else document.body.classList.remove('ku-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Modal focus-trap (a11y) ---------- */
  function focusables(root) {
    return Array.prototype.slice.call(root.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) { return el.offsetParent !== null; });
  }
  function mountModalTrap() {
    // Overlay keyinroq (birinchi ochilishda) yaratilishi mumkin — kuzatamiz
    var lastFocus = null;
    function trap(e) {
      var ov = document.querySelector('.ku-modal-overlay.is-open');
      if (!ov) return;
      if (e.key === 'Tab') {
        var f = focusables(ov);
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', trap);
    var mo = new MutationObserver(function () {
      var ov = document.querySelector('.ku-modal-overlay.is-open');
      if (ov && ov.dataset.kuTrapped !== '1') {
        ov.dataset.kuTrapped = '1';
        lastFocus = document.activeElement;
        var f = focusables(ov);
        if (f.length) setTimeout(function () { f[0].focus(); }, 30);
      } else if (!ov && lastFocus) {
        var prev = lastFocus; lastFocus = null;
        document.querySelectorAll('.ku-modal-overlay').forEach(function (o) { o.dataset.kuTrapped = ''; });
        try { prev.focus(); } catch { /* noop */ }
      }
    });
    mo.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }

  /* ---------- Mobil menyu (hamburger) ----------
     Kichik ekranlarda asosiy menyu yashirin edi. Haqiqiy <a> elementlardan
     foydalanamiz (klonlamaymiz) — shunda admin paneldan qo'yilgan havolalar
     mobilda ham ishlaydi. */
  function mountMobileNav() {
    var header = document.querySelector('.site-header');
    var topMenu = document.querySelector('#menu-top-menu');
    var mainMenu = document.querySelector('#menu-main-menu');
    if (!header || (!topMenu && !mainMenu) || document.querySelector('.ku-burger')) return;

    // Hamburger tugma (header ichida, sticky bilan birga suriladi)
    var burger = document.createElement('button');
    burger.className = 'ku-burger';
    burger.type = 'button';
    burger.setAttribute('aria-label', 'Menyu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(burger);

    // Panel + fon — to'g'ridan-to'g'ri <body> ichida (toza stacking konteksti,
    // tema qatlamlariga bog'liq emas). Menyu <ul>'lari shu panelga KO'CHIRILADI
    // (klonlanmaydi) — shunda admin paneldagi havolalar mobilda ham ishlaydi.
    var overlay = document.createElement('div');
    overlay.className = 'ku-mnav__overlay';
    var panel = document.createElement('nav');
    panel.className = 'ku-mnav';
    panel.setAttribute('aria-label', 'Asosiy menyu');
    var inner = document.createElement('div');
    inner.className = 'ku-mnav__inner';
    panel.appendChild(inner);
    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    // Menyularning asl o'rnini belgi (comment) bilan eslab qolamiz
    var slots = [];
    [topMenu, mainMenu].forEach(function (ul) {
      if (!ul) return;
      var ph = document.createComment('ku-menu-slot');
      ul.parentNode.insertBefore(ph, ul);
      slots.push({ ul: ul, ph: ph });
    });

    function open() {
      slots.forEach(function (s) { inner.appendChild(s.ul); });
      document.body.classList.add('ku-nav-open');
      burger.setAttribute('aria-expanded', 'true');
    }
    function close() {
      document.body.classList.remove('ku-nav-open');
      burger.setAttribute('aria-expanded', 'false');
      // <ul>'larni asl joyiga qaytaramiz
      slots.forEach(function (s) { if (s.ph.parentNode) s.ph.parentNode.insertBefore(s.ul, s.ph); });
    }
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (document.body.classList.contains('ku-nav-open')) close(); else open();
    });
    overlay.addEventListener('click', close);
    inner.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- Buzuq placeholder havolalarini zararsizlantirish ----------
     WordPress'dan qolgan href="######" (faqat # belgilari) havolalar hech
     qayerga olib bormaydi. Ular odatda modal bilan bog'langan (data-ku-*),
     lekin bog'lanmaganlari bosilsa sahifa g'alati hashga sakraydi. Shuni
     to'xtatamiz (modal ishlovchilari baribir ishlayveradi). */
  function mountLinks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (/^#{2,}$/.test(href)) e.preventDefault();
    });
  }

  /* ---------- Bo'lim ajratgichlari (nozik to'lqin) ---------- */
  function mountDividers() {
    var wave = '<svg viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M0,30 C240,60 480,0 720,24 C960,48 1200,12 1440,34 L1440,60 L0,60 Z"></path></svg>';
    ['.whats_on-container', '.who_we_are-container'].forEach(function (sel) {
      var s = document.querySelector(sel);
      if (!s || s.previousElementSibling && s.previousElementSibling.classList && s.previousElementSibling.classList.contains('ku-wave')) return;
      var d = document.createElement('div');
      d.className = 'ku-wave';
      d.innerHTML = wave;
      s.parentNode.insertBefore(d, s);
    });
  }

  ready(function () {
    try { mountSkipLink(); } catch { /* noop */ }
    try { mountReveal(); } catch { /* noop */ }
    try { mountHero(); } catch { /* noop */ }
    try { mountImages(); } catch { /* noop */ }
    try { mountStickyNav(); } catch { /* noop */ }
    try { mountModalTrap(); } catch { /* noop */ }
    try { mountLinks(); } catch { /* noop */ }
    try { mountMobileNav(); } catch { /* noop */ }
    try { mountDividers(); } catch { /* noop */ }
    // Kontent dinamik yuklangach (site-features) rasm/reveal'ni qayta ulaymiz
    setTimeout(function () { try { mountImages(); mountReveal(); } catch { /* noop */ } }, 1500);
  });
})();
