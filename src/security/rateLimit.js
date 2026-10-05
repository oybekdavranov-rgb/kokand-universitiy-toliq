'use strict';
/**
 * In-memory rate limiter (sliding window, fixed reset).
 * Ko'p-instansli deployда Redis'ga o'tkazish tavsiya etiladi.
 */
const buckets = new Map();

/**
 * Har bir limiter O'Z nom maydonini (namespace) oladi. Aks holda bir xil kalit
 * (masalan IP) bilan ishlaydigan turli limiterlar bir-birining hisobini
 * buzadi — global 300/min limiter ariza uchun 5/soat limiterni noto'g'ri
 * ishga tushirib qo'yardi.
 */
let limiterSeq = 0;

function createLimiter(max, windowMs, name) {
  const ns = `${name || 'rl'}#${++limiterSeq}:`;
  return function hit(key) {
    const now = Date.now();
    const k = ns + key;
    const rec = buckets.get(k);
    if (!rec || rec.resetAt < now) {
      buckets.set(k, { count: 1, resetAt: now + windowMs });
      return { limited: false, remaining: max - 1 };
    }
    rec.count += 1;
    return { limited: rec.count > max, remaining: Math.max(0, max - rec.count) };
  };
}

function reset(key) {
  // Barcha nom maydonlaridan shu kalitni o'chiradi
  for (const k of buckets.keys()) {
    if (k.endsWith(':' + key) || k === key) buckets.delete(k);
  }
}

// Vaqti-vaqti bilan eski yozuvlarni tozalash (xotira o'sishini oldini olish)
const sweep = setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
}, 5 * 60 * 1000);
if (sweep.unref) sweep.unref();

/**
 * Ishonchli klient IP.
 * X-Forwarded-For klient tomonidan soxtalashtirilishi mumkin, shuning uchun
 * faqat TRUST_PROXY_HOPS (ishonchli proxy'lar soni) orqali o'ngdan hisoblab
 * olamiz. Proxy real klient IP'ni ro'yxat oxiriga qo'shadi, demak N-hop uchun
 * o'ngdan N-chi element ishonchli. TRUST_PROXY_HOPS=0 bo'lsa (default) —
 * XFF butunlay e'tiborsiz qoldiriladi va socket IP ishlatiladi.
 */
// Railway (va boshqa bitta reverse-proxy ortidagi) muhitlarda klient IP
// X-Forwarded-For oxiridan olinishi kerak, aks holda barcha tashriflar proxy
// IP'si sifatida ko'rinib, rate-limit hammani birga bloklab qo'yadi. Railway
// aniqlansa TRUST_PROXY_HOPS default 1 bo'ladi; aniq qiymat berilsa — o'sha.
const ON_RAILWAY = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);
const DEFAULT_HOPS = ON_RAILWAY ? 1 : 0;
const TRUST_HOPS = Math.max(0, Number(
  process.env.TRUST_PROXY_HOPS != null && process.env.TRUST_PROXY_HOPS !== ''
    ? process.env.TRUST_PROXY_HOPS
    : DEFAULT_HOPS
));

function clientIp(req) {
  const socketIp = (req.socket && req.socket.remoteAddress) || 'unknown';
  if (TRUST_HOPS > 0) {
    const xff = req.headers['x-forwarded-for'];
    if (xff) {
      const list = String(xff).split(',').map((s) => s.trim()).filter(Boolean);
      const idx = list.length - TRUST_HOPS;
      if (idx >= 0 && list[idx]) return list[idx];
    }
  }
  return socketIp;
}

module.exports = { createLimiter, reset, clientIp };
