/* ============================================================
   Kokand University — kontent himoyasi (rasm/matn)
   Rasmlarni saqlash/sudrab olish, matnni belgilash/nusxalash,
   o'ng tugma menyusi va asosiy tez-tugmalarni bloklaydi.

   DIQQAT: bu MUTLAQ himoya emas. JavaScript o'chirilsa, brauzer
   DevTools'i yoki oddiy skrinshot bilan chetlab o'tish mumkin.
   Maqsad — oddiy foydalanuvchini nusxalashdan to'xtatuvchi amaliy
   to'siq (deterrent) qo'yish. Forma inputlari va [data-allow-select]
   belgilangan joylar bundan mustasno — ular normal ishlaydi.
   ============================================================ */
(function () {
  'use strict';

  // Tanlash/nusxalashga RUXSAT etilgan joylar: forma inputlari (to'ldirish uchun)
  // va kontakt havolalari (telefon/email'ni nusxalash — foydalanish qulayligi).
  var ALLOW = 'input, textarea, select, [contenteditable="true"], [data-allow-select], a[href^="tel:"], a[href^="mailto:"]';
  function inAllowed(el) {
    return !!(el && el.closest && el.closest(ALLOW));
  }

  // CSS himoyasini o'zi joylaydi (alohida fayl kerak emas)
  var css =
    'html.ku-protected, html.ku-protected body {' +
    '-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;' +
    '-webkit-touch-callout:none;}' +
    'html.ku-protected input,html.ku-protected textarea,html.ku-protected select,' +
    'html.ku-protected [contenteditable="true"],html.ku-protected [data-allow-select],' +
    'html.ku-protected a[href^="tel:"],html.ku-protected a[href^="mailto:"]{' +
    '-webkit-user-select:text!important;-moz-user-select:text!important;' +
    '-ms-user-select:text!important;user-select:text!important;-webkit-touch-callout:default;}' +
    'html.ku-protected img{-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;' +
    'user-drag:none;-webkit-touch-callout:none;}';
  var style = document.createElement('style');
  style.setAttribute('data-ku', 'protect');
  style.appendChild(document.createTextNode(css));
  (document.head || document.documentElement).appendChild(style);
  document.documentElement.classList.add('ku-protected');

  // 1) O'ng tugma (kontekst menyu) — rasm/matndan tashqari joyda bloklanadi
  document.addEventListener('contextmenu', function (e) {
    if (inAllowed(e.target)) return;
    e.preventDefault();
  });

  // 2) Rasmlarni sudrab (drag) olib ketish
  document.addEventListener('dragstart', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'IMG' || (t.closest && t.closest('picture, img')))) {
      e.preventDefault();
    }
  });

  // 3) Nusxalash / kesish — faqat ruxsat etilgan joylarda ishlaydi
  ['copy', 'cut'].forEach(function (type) {
    document.addEventListener(type, function (e) {
      if (inAllowed(e.target)) return;
      e.preventDefault();
    });
  });

  // 4) Tez-tugmalar
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    var mod = e.ctrlKey || e.metaKey;
    // Saqlash (Ctrl/Cmd+S), manbani ko'rish (Ctrl+U), chop etish (Ctrl+P)
    if (mod && (k === 's' || k === 'u' || k === 'p')) { e.preventDefault(); return; }
    // Nusxalash (Ctrl/Cmd+C) — input bo'lmaganda
    if (mod && k === 'c' && !inAllowed(e.target)) { e.preventDefault(); return; }
    // DevTools (chalg'ituvchi to'siq — texnik jihatdan to'liq bloklab bo'lmaydi)
    if (k === 'f12') { e.preventDefault(); return; }
    if (mod && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) { e.preventDefault(); return; }
  });
})();
