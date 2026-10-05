'use strict';
/**
 * Avtomatik tarjima moduli — ulanadigan provayder bilan.
 *
 * Provayderlar (TRANSLATE_PROVIDER env yoki avtomatik):
 *  - google : Google Cloud Translation API (GOOGLE_TRANSLATE_KEY kerak) — eng sifatli,
 *             o'zbek tilini qo'llab-quvvatlaydi. PRODUCTION uchun TAVSIYA ETILADI.
 *  - gtx    : Google'ning bepul (norasmiy) endpointi — kalit shart emas, lekin
 *             cheklangan/beqaror. Default (kalit berilmasa).
 *  - mock   : deterministik soxta tarjima — test/dev uchun.
 *  - none   : tarjima qilinmaydi (asl matn qaytadi).
 *
 * `translate(text, to)` — `to` = 'en' yoki 'ru'. Manba doimo o'zbekcha ('uz').
 * Xatolik bo'lsa asl matn qaytadi (sayt baribir ishlaydi).
 */
const log = require('./logger');

const KEY = process.env.GOOGLE_TRANSLATE_KEY || '';
let PROVIDER = (process.env.TRANSLATE_PROVIDER || (KEY ? 'google' : 'gtx')).toLowerCase();
const TIMEOUT_MS = Number(process.env.TRANSLATE_TIMEOUT_MS || 8000);

const cache = new Map(); // `${to}:${text}` -> tarjima

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('translate timeout')), ms)),
  ]);
}

async function viaGoogle(text, to) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(KEY)}`;
  const res = await withTimeout(fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'uz', target: to, format: 'text' }),
  }), TIMEOUT_MS);
  if (!res.ok) throw new Error('google ' + res.status);
  const data = await res.json();
  const t = data && data.data && data.data.translations && data.data.translations[0];
  if (!t || typeof t.translatedText !== 'string') throw new Error('google bad response');
  return t.translatedText;
}

async function viaGtx(text, to) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await withTimeout(fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }), TIMEOUT_MS);
  if (!res.ok) throw new Error('gtx ' + res.status);
  const data = await res.json();
  // data[0] = [[translatedChunk, originalChunk, ...], ...]
  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error('gtx bad response');
  return data[0].map((seg) => (seg && seg[0]) || '').join('');
}

function viaMock(text, to) {
  return `[${to.toUpperCase()}] ${text}`;
}

async function provider(text, to) {
  switch (PROVIDER) {
    case 'google': return viaGoogle(text, to);
    case 'gtx': return viaGtx(text, to);
    case 'mock': return viaMock(text, to);
    case 'none': return text;
    default: return viaGtx(text, to);
  }
}

/** Bitta matnni `to` tiliga tarjima qiladi. Xatoda asl matn. */
async function translate(text, to) {
  const src = String(text == null ? '' : text).trim();
  if (!src || (to !== 'en' && to !== 'ru')) return src;
  if (PROVIDER === 'none') return src;
  const ck = to + ':' + src;
  if (cache.has(ck)) return cache.get(ck);
  try {
    const out = await provider(src, to);
    const val = (out && String(out).trim()) || src;
    cache.set(ck, val);
    return val;
  } catch (err) {
    log.warn('tarjima xatosi', { to, provider: PROVIDER, err: err.message });
    return src; // graceful: asl matn
  }
}

function info() { return { provider: PROVIDER, hasKey: Boolean(KEY) }; }
// Test uchun provayderni almashtirish
function _setProvider(p) { PROVIDER = p; cache.clear(); }

module.exports = { translate, info, _setProvider };
