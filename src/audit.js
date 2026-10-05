'use strict';
const db = require('./db');
const log = require('./logger');
const { clientIp } = require('./security/rateLimit');

/** Admin amalini audit jurnaliga yozadi (kim / nima / qachon / IP). */
async function record(req, user, action, target) {
  try {
    await db.run(
      'INSERT INTO audit_log (user_id, email, action, target, ip, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [user ? user.id : null, user ? user.email : null, action, target || null, clientIp(req), Date.now()]
    );
  } catch (err) {
    log.error('audit yozishda xato', { err: err.message });
  }
}

module.exports = { record };
