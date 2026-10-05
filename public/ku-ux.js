/* ============================================================
   Kokand University — umumiy UX qatlami (barcha sahifalarda)
   1) Dark mode (xotirada saqlanadi, tizim sozlamasiga mos)
   2) Sahifalar orasida yumshoq o'tish (fade)
   3) Magnetic tugmalar (kursor bilan o'zaro ta'sir)
   4) Mikro-animatsiyalar (bosish to'lqini, forma yuborilishi)
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1) DARK MODE ---------- */
  var KEY = 'ku-theme';
  function systemDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function current() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch { /* private mode */ }
    return saved || (systemDark() ? 'dark' : 'light');
  }
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var b = document.getElementById('kuThemeBtn');
    if (b) {
      b.textContent = theme === 'dark' ? '☀' : '☾';
      b.setAttribute('aria-label', theme === 'dark' ? 'Yorug‘ rejim' : 'Tungi rejim');
      b.setAttribute('title', theme === 'dark' ? 'Yorug‘ rejim' : 'Tungi rejim');
    }
  }
  function toggle() {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch { /* noop */ }
    apply(next);
  }
  apply(current());

  function mountThemeBtn() {
    if (document.getElementById('kuThemeBtn')) return;
    var b = document.createElement('button');
    b.id = 'kuThemeBtn';
    b.className = 'ku-theme-btn unstyled';
    b.type = 'button';
    b.addEventListener('click', toggle);
    document.body.appendChild(b);
    apply(document.documentElement.getAttribute('data-theme') || current());
  }

  /* ---------- 2) SAHIFA O'TISHLARI ---------- */
  function mountTransition() {
    if (reduce) return;
    var veil = document.createElement('div');
    veil.className = 'ku-veil';
    document.body.appendChild(veil);
    // kirish: ochilish
    requestAnimationFrame(function () { document.body.classList.add('ku-ready'); });

    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || a.target === '_blank') return;
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
      // faqat ichki sahifalar
      var url;
      try { url = new URL(href, location.href); } catch { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      document.body.classList.add('ku-leaving');
      setTimeout(function () { location.href = url.href; }, 340);
    });
    // orqaga qaytishda oq ekran qolmasin
    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) document.body.classList.remove('ku-leaving');
    });
  }

  /* ---------- 3) MAGNETIC TUGMALAR ---------- */
  var MAG = '.btn, .ku-btn, .g-chip, .ku-chip, .primary-btn, .ku-theme-btn, .cta, .button';
  function mountMagnetic() {
    if (reduce || !window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest ? e.target.closest(MAG) : null;
      if (!el) return;
      var r = el.getBoundingClientRect();
      var mx = e.clientX - (r.left + r.width / 2);
      var my = e.clientY - (r.top + r.height / 2);
      var s = Math.min(0.32, 14 / Math.max(r.width, r.height));
      el.style.transform = 'translate(' + (mx * s).toFixed(2) + 'px,' + (my * s).toFixed(2) + 'px)';
    });
    document.addEventListener('pointerout', function (e) {
      var el = e.target.closest ? e.target.closest(MAG) : null;
      if (el) el.style.transform = '';
    });
  }

  /* ---------- 4) MIKRO-ANIMATSIYALAR ---------- */
  function mountMicro() {
    // bosish to'lqini (ripple)
    document.addEventListener('pointerdown', function (e) {
      var el = e.target.closest ? e.target.closest(MAG + ', button') : null;
      if (!el || reduce) return;
      var r = el.getBoundingClientRect();
      var d = Math.max(r.width, r.height);
      var s = document.createElement('span');
      s.className = 'ku-ripple';
      s.style.width = s.style.height = d + 'px';
      s.style.left = (e.clientX - r.left - d / 2) + 'px';
      s.style.top = (e.clientY - r.top - d / 2) + 'px';
      var pos = getComputedStyle(el).position;
      if (pos === 'static') el.style.position = 'relative';
      if (getComputedStyle(el).overflow === 'visible') el.style.overflow = 'hidden';
      el.appendChild(s);
      setTimeout(function () { s.remove(); }, 620);
    });

    // forma yuborilganda: tugma "yuklanmoqda" holatiga o'tadi
    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (!form || form.dataset.kuNoBusy === '1') return;
      var btn = form.querySelector('[type="submit"], button:not([type="button"])');
      if (!btn || btn.dataset.kuBusy === '1') return;
      btn.dataset.kuBusy = '1';
      btn.dataset.kuLabel = btn.textContent;
      btn.classList.add('ku-busy');
      setTimeout(function () {
        btn.classList.remove('ku-busy');
        btn.dataset.kuBusy = '';
        if (btn.dataset.kuLabel) btn.textContent = btn.dataset.kuLabel;
      }, 2500);
    }, true);
  }

  function init() {
    mountThemeBtn();
    mountTransition();
    mountMagnetic();
    mountMicro();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
