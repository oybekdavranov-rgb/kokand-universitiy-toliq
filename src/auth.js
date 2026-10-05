'use strict';
const crypto = require('node:crypto');
const db = require('./db');
const { config } = require('./config');
const { parseCookies, setCookie, clearCookie, sendJson } = require('./http-helpers');

async function createSession(userId) {
  const id = crypto.randomUUID();
  const now = Date.now();
  const expiresAt = now + config.SESSION_TTL_MS;
  await db.run('INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)', [id, userId, expiresAt, now]);
  return { id, expiresAt };
}

function setSessionCookie(res, sessionId) {
  setCookie(res, config.COOKIE_NAME, sessionId, {
    maxAge: config.SESSION_TTL_MS,
    sameSite: 'Lax',
    secure: config.IS_PROD,
    httpOnly: true,
  });
}

async function destroySession(sessionId) {
  await db.run('DELETE FROM sessions WHERE id = ?', [sessionId]);
}

/** Foydalanuvchining boshqa barcha sessiyalarini bekor qilish (parol o'zgarganda) */
async function destroyOtherSessions(userId, keepSessionId) {
  await db.run('DELETE FROM sessions WHERE user_id = ? AND id <> ?', [userId, keepSessionId]);
}

async function getCurrentUser(req) {
  const cookies = parseCookies(req);
  const sid = cookies[config.COOKIE_NAME];
  if (!sid) return null;
  const row = await db.get(
    `SELECT users.id, users.email, users.role, sessions.id AS session_id, sessions.expires_at
     FROM sessions INNER JOIN users ON users.id = sessions.user_id
     WHERE sessions.id = ? AND sessions.expires_at > ?`,
    [sid, Date.now()]
  );
  return row || null;
}

async function requireAuth(req, res) {
  const user = await getCurrentUser(req);
  if (!user) {
    sendJson(res, 401, { ok: false, error: 'Unauthorized' });
    return null;
  }
  return user;
}

async function requireStaff(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return null;
  if (user.role !== 'staff') {
    sendJson(res, 403, { ok: false, error: 'Bu amal faqat staff admin uchun ruxsat etilgan.' });
    return null;
  }
  return user;
}

function logout(res, sessionId) {
  if (sessionId) destroySession(sessionId).catch(() => {});
  clearCookie(res, config.COOKIE_NAME);
}

module.exports = {
  createSession, setSessionCookie, destroySession, destroyOtherSessions,
  getCurrentUser, requireAuth, requireStaff, logout,
};
