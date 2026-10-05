'use strict';
/**
 * CSRF himoyasi — double-submit cookie pattern.
 * Server random token'ni non-HttpOnly cookie'ga qo'yadi; klient uni
 * X-CSRF-Token header'ida qaytaradi. SameSite=Lax cookie bilan birga
 * cross-site so'rovlar tokenni o'qiy olmaydi.
 */
const crypto = require('node:crypto');
const { config } = require('../config');
const { parseCookies, setCookie } = require('../http-helpers');

function issueToken(req, res) {
  const cookies = parseCookies(req);
  let token = cookies[config.CSRF_COOKIE];
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    token = crypto.randomBytes(32).toString('hex');
    setCookie(res, config.CSRF_COOKIE, token, {
      httpOnly: false, // klient JS o'qishi kerak
      sameSite: 'Lax',
      secure: config.IS_PROD,
      maxAge: config.SESSION_TTL_MS,
    });
  }
  return token;
}

/** State-o'zgartiruvchi so'rovlar uchun tekshiruv */
function verify(req) {
  const cookies = parseCookies(req);
  const cookieToken = cookies[config.CSRF_COOKIE];
  const headerToken = req.headers[config.CSRF_HEADER];
  if (!cookieToken || !headerToken) return false;
  const a = Buffer.from(String(cookieToken));
  const b = Buffer.from(String(headerToken));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = { issueToken, verify };
