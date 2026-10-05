/* ============================================================
   Kokand University — sayt qo'shimcha imkoniyatlari (frontend)
   - Results  -> modal oyna (yutuqqa erishgan yoshlar)
   - Ajralib turish bo'limi -> "Batafsil" modal oynalari
   - Yangiliklar -> oxirgi 3 ta (admin paneldan boshqariladi)
   - "Sizni qiziqtirishi mumkin" kartalari -> modal oynalar
   Ma'lumot manbai: GET /api/public/site
   ============================================================ */
(function () {
  'use strict';

  var SITE = { news: [], achievements: [], distinctions: [], interests: [], programmes: [], settings: {} };

  /* ---------- yordamchilar ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c];
    });
  }
  function nl2br(s) { return esc(s).replace(/\n/g, '<br>'); }
  function elem(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ---------- modal infratuzilma ---------- */
  var overlay, modalBox, modalBody;
  function buildModal() {
    if (overlay) return;
    overlay = elem('div', 'ku-modal-overlay');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    modalBox = elem('div', 'ku-modal');
    var close = elem('button', 'ku-modal__close unstyled', '&times;');
    close.setAttribute('aria-label', 'Yopish');
    close.addEventListener('click', closeModal);
    modalBody = elem('div', 'ku-modal__body');
    modalBox.appendChild(close);
    modalBox.appendChild(modalBody);
    overlay.appendChild(modalBox);
    // FAQ akkordeon (delegatsiya)
    modalBody.addEventListener('click', function (e) {
      var q = e.target.closest ? e.target.closest('.ku-faq__q') : null;
      if (q && q.parentElement) q.parentElement.classList.toggle('open');
    });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
    document.body.appendChild(overlay);
  }
  function openModal(html) {
    buildModal();
    modalBody.innerHTML = html;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modalBox.scrollTop = 0;
  }
  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* ---------- Natijalar (Results) ---------- */
  function openResults() {
    var s = SITE.settings || {};
    var items = SITE.achievements || [];
    var cards = items.map(function (a) {
      return '<article class="ku-ach-card">' +
        (a.image ? '<div class="ku-ach-card__img"><img src="' + esc(a.image) + '" alt="' + esc(a.name) + '" loading="lazy"></div>' : '') +
        '<div class="ku-ach-card__body"><h3>' + esc(a.name) + '</h3>' +
        (a.subtitle ? '<p class="ku-ach-card__sub">' + esc(a.subtitle) + '</p>' : '') +
        (a.description ? '<p>' + nl2br(a.description) + '</p>' : '') +
        '</div></article>';
    }).join('');
    var html = '<div class="ku-modal__head"><h2>' + esc(s.results_title || 'Natijalar') + '</h2>' +
      (s.results_intro ? '<p>' + esc(s.results_intro) + '</p>' : '') + '</div>' +
      '<div class="ku-ach-grid">' + (cards || '<p>Hozircha maʼlumot qoʻshilmagan.</p>') + '</div>';
    openModal(html);
  }

  /* ---------- Batafsil (ajralib turish / qiziqishlar) ---------- */
  function detailHtml(d) {
    return '<div class="ku-detail">' +
      (d.image ? '<div class="ku-detail__img"><img src="' + esc(d.image) + '" alt="' + esc(d.title) + '"></div>' : '') +
      '<div class="ku-detail__body"><h2>' + esc(d.title) + '</h2>' +
      (d.summary ? '<p class="ku-detail__lead">' + esc(d.summary) + '</p>' : '') +
      '<div class="ku-detail__text">' + nl2br(d.body || '') + '</div>' +
      (d.link ? '<div class="ku-detail__actions"><a class="ku-btn" href="' + esc(d.link) + '" target="_blank" rel="noopener">Batafsil saytda →</a></div>' : '') +
      '</div></div>';
  }
  function openDistinction(i) {
    var d = (SITE.distinctions || [])[i];
    if (d) openModal(detailHtml(d));
  }
  function openInterest(i) {
    var it = (SITE.interests || [])[i];
    if (it) openModal(detailHtml(it));
  }

  /* ---------- Dasturlar (programme) modal ---------- */
  function programmeHtml(p) {
    var html = '<div class="ku-prog">';
    if (p.image) {
      html += '<div class="ku-prog__hero"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '">' +
        '<div class="ku-prog__hero-overlay"><h2>' + esc(p.title) + '</h2>' +
        (p.subtitle ? '<p>' + esc(p.subtitle) + '</p>' : '') + '</div></div>';
    } else {
      html += '<div class="ku-modal__head"><h2>' + esc(p.title) + '</h2>' +
        (p.subtitle ? '<p>' + esc(p.subtitle) + '</p>' : '') + '</div>';
    }
    if (p.intro) html += '<p class="ku-prog__intro">' + nl2br(p.intro) + '</p>';

    var hl = String(p.highlights || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    if (hl.length) {
      html += '<h3 class="ku-prog__section-title">Dastur afzalliklari</h3><div class="ku-prog__highlights">' +
        hl.map(function (x) { return '<div class="ku-prog__hl">' + esc(x) + '</div>'; }).join('') + '</div>';
    }

    var faqLines = String(p.faq || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    if (faqLines.length) {
      html += '<h3 class="ku-prog__section-title">Ko‘p beriladigan savollar</h3><div class="ku-faq">' +
        faqLines.map(function (line) {
          var idx = line.indexOf('::');
          var q = idx >= 0 ? line.slice(0, idx).trim() : line;
          var a = idx >= 0 ? line.slice(idx + 2).trim() : '';
          return '<div class="ku-faq__item"><button type="button" class="ku-faq__q unstyled">' + esc(q) + '</button>' +
            '<div class="ku-faq__a">' + nl2br(a) + '</div></div>';
        }).join('') + '</div>';
    }

    if (p.link) {
      html += '<div class="ku-detail__actions"><a class="ku-btn" href="' + esc(p.link) + '" target="_blank" rel="noopener">Ariza topshirish →</a></div>';
    }
    html += '</div>';
    return html;
  }
  function openProgramme(key) {
    var list = SITE.programmes || [];
    var p = list.filter(function (x) { return x.key === key; })[0] || list[0];
    if (p) openModal(programmeHtml(p));
  }

  /* ---------- Yangiliklar (What's On) ---------- */
  function newsCard(n) {
    return '<div class="greenes-post-container">' +
      '<a class="greenes-post" href="/news.html?id=' + n.id + '">' +
      '<div class="greenes-post-content"><div class="image-overlay">' +
      (n.image ? '<img class="attachment-blog-thumbnail size-blog-thumbnail" src="' + esc(n.image) + '" alt="' + esc(n.title) + '" loading="lazy" width="352" height="228">' : '') +
      '</div>' +
      '<p class="greenes-post-content__date">' + esc(n.date || '') + '</p>' +
      '<h3 class="greenes-post-content__title">' + esc(n.title) + '</h3></div></a></div>';
  }
  function renderNews() {
    var grid = document.querySelector('[data-ku-news]');
    if (!grid || !SITE.news || !SITE.news.length) return;
    grid.innerHTML = SITE.news.slice(0, 3).map(newsCard).join('');
  }

  /* ---------- ulanishlar ----------
     Menyu bandiga admin paneldan HAQIQIY havola qo'yilgan bo'lsa — bosilganda
     o'sha tashqi/ichki saytga o'tadi (modal ochilmaydi). Havola qo'yilmagan
     (placeholder #, #dastur, ###### yoki bo'sh) bo'lsa — eski modal ochiladi. */
  function hasRealHref(a) {
    var h = (a.getAttribute('href') || '').trim();
    if (!h || /^#/.test(h)) return false; // #, #dastur, #results, ###### — placeholder
    return /^(https?:\/\/|\/|mailto:|tel:)/i.test(h);
  }

  function wireResults() {
    document.querySelectorAll('[data-ku-modal="results"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (hasRealHref(a)) return; // admin havola qo'ygan — o'sha saytga o'tadi
        e.preventDefault();
        openResults();
      });
    });
  }

  function wireDistinctions() {
    var section = document.querySelector('[data-ku-distinctions]');
    if (!section) return;
    var blocks = section.querySelectorAll('.who_we_are-content__section');
    blocks.forEach(function (block) {
      var idx = parseInt(block.getAttribute('data-section-num'), 10);
      if (isNaN(idx) || !(SITE.distinctions || [])[idx]) return;
      var holder = block.querySelector('.who_we_are-content__section-button') || block;
      var btn = elem('button', 'ku-more-btn unstyled', 'Batafsil');
      btn.type = 'button';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openDistinction(idx);
      });
      holder.appendChild(btn);
    });
  }

  function wireInterests() {
    var grid = document.querySelector('[data-ku-interests]');
    if (!grid) return;
    var cards = grid.querySelectorAll('.greenes-page');
    cards.forEach(function (card, i) {
      if (!(SITE.interests || [])[i]) return;
      card.addEventListener('click', function (e) {
        e.preventDefault();
        openInterest(i);
      });
    });
  }

  function wireProgrammes() {
    document.querySelectorAll('[data-ku-programme]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (hasRealHref(a)) return; // admin havola qo'ygan — o'sha saytga o'tadi
        e.preventDefault();
        openProgramme(a.getAttribute('data-ku-programme'));
      });
    });
  }

  /* ---------- ishga tushirish ---------- */
  function init() {
    // Results ni darhol ulaymiz (ma'lumotsiz ham bosilsa modal ochiladi)
    wireResults();
    fetch('/api/public/site')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.ok) return;
        SITE = {
          news: data.news || [],
          achievements: data.achievements || [],
          distinctions: data.distinctions || [],
          interests: data.interests || [],
          programmes: data.programmes || [],
          settings: data.settings || {},
        };
        renderNews();
        wireDistinctions();
        wireInterests();
        wireProgrammes();
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
