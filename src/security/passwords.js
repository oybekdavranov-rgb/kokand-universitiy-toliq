'use strict';
const crypto = require('node:crypto');

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function newSalt() {
  return crypto.randomBytes(16).toString('hex');
}

/** Timing-safe tekshiruv. User topilmasa ham doimiy vaqt sarflaydi (enumeration himoyasi). */
function verifyPassword(password, user) {
  const salt = (user && user.salt) || 'x'.repeat(32);
  const stored = (user && user.password_hash) || hashPassword('dummy', salt);
  const derived = hashPassword(password, salt);
  const a = Buffer.from(derived, 'hex');
  const b = Buffer.from(stored, 'hex');
  if (a.length !== b.length) return false;
  const equal = crypto.timingSafeEqual(a, b);
  return Boolean(user) && equal;
}

module.exports = { hashPassword, newSalt, verifyPassword };
