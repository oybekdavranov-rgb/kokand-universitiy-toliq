'use strict';
/** Dialekt-agnostik sxema. SQLite va PostgreSQL uchun bir manbadan. */
const site = require('../site-profile');

/**
 * Faqat shu profilda faol bo'lgan jadvallar yaratiladi.
 * Tizim jadvallari (users, sessions, overrides, files, settings, audit_log)
 * har doim kerak — ular `null` bilan belgilanadi.
 */
function ddl(dialect) {
  const pk = dialect === 'postgres' ? 'BIGSERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
  const big = 'BIGINT';
  const all = [
    `CREATE TABLE IF NOT EXISTS users (
      id ${pk},
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editor',
      created_at ${big} NOT NULL,
      updated_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id ${big} NOT NULL,
      expires_at ${big} NOT NULL,
      created_at ${big} NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`,
    `CREATE TABLE IF NOT EXISTS overrides (
      element_id TEXT PRIMARY KEY,
      payload_json TEXT NOT NULL,
      updated_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS files (
      id ${pk},
      filename TEXT NOT NULL UNIQUE,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes ${big} NOT NULL,
      public_path TEXT NOT NULL,
      created_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS news (
      id ${pk}, title TEXT NOT NULL, date TEXT, image TEXT, excerpt TEXT,
      body TEXT, link TEXT, sort INTEGER NOT NULL DEFAULT 0,
      created_at ${big} NOT NULL, updated_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS achievements (
      id ${pk}, name TEXT NOT NULL, subtitle TEXT, image TEXT, description TEXT,
      sort INTEGER NOT NULL DEFAULT 0, created_at ${big} NOT NULL, updated_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS distinctions (
      id ${pk}, title TEXT NOT NULL, image TEXT, summary TEXT, body TEXT,
      sort INTEGER NOT NULL DEFAULT 0, created_at ${big} NOT NULL, updated_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS interests (
      id ${pk}, title TEXT NOT NULL, image TEXT, body TEXT, link TEXT,
      sort INTEGER NOT NULL DEFAULT 0, created_at ${big} NOT NULL, updated_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS programmes (
      id ${pk}, key TEXT, title TEXT NOT NULL, subtitle TEXT, image TEXT,
      intro TEXT, highlights TEXT, faq TEXT, link TEXT,
      sort INTEGER NOT NULL DEFAULT 0, created_at ${big} NOT NULL, updated_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS stories (
      id ${pk}, title TEXT NOT NULL, date TEXT, category TEXT, image TEXT,
      excerpt TEXT, body TEXT, link TEXT,
      sort INTEGER NOT NULL DEFAULT 0, created_at ${big} NOT NULL, updated_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS applications (
      id ${pk}, name TEXT NOT NULL, phone TEXT, email TEXT, gender TEXT,
      faculty TEXT, course TEXT, city TEXT, residence TEXT, duration TEXT,
      note TEXT, status TEXT NOT NULL DEFAULT 'yangi', ip TEXT,
      sort INTEGER NOT NULL DEFAULT 0, created_at ${big} NOT NULL, updated_at ${big} NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_apps_created ON applications(created_at)`,
    `CREATE TABLE IF NOT EXISTS castle_pages (
      id ${pk}, title TEXT NOT NULL, slug TEXT, icon TEXT, image TEXT,
      summary TEXT, body TEXT, faq TEXT,
      sort INTEGER NOT NULL DEFAULT 0, created_at ${big} NOT NULL, updated_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS residences (
      id ${pk}, name TEXT NOT NULL, city TEXT, image TEXT, summary TEXT,
      description TEXT, amenities TEXT, price TEXT, link TEXT,
      sort INTEGER NOT NULL DEFAULT 0, created_at ${big} NOT NULL, updated_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS gallery (
      id ${pk}, title TEXT NOT NULL, category TEXT, image TEXT, description TEXT,
      video TEXT, sort INTEGER NOT NULL DEFAULT 0,
      created_at ${big} NOT NULL, updated_at ${big} NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY, value TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS audit_log (
      id ${pk}, user_id ${big}, email TEXT, action TEXT NOT NULL, target TEXT,
      ip TEXT, created_at ${big} NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at)`,
    // Avtomatik tarjima keshi/ombori: har bir tarjima qilingan matn maydoni uchun
    // uz (asl) + en + ru. Ochiq sayt /api/public/i18n orqali lug'at sifatida oladi.
    `CREATE TABLE IF NOT EXISTS content_i18n (
      id ${pk}, ref_table TEXT NOT NULL, ref_id ${big} NOT NULL, field TEXT NOT NULL,
      uz TEXT NOT NULL, en TEXT, ru TEXT, updated_at ${big} NOT NULL
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_i18n_ref ON content_i18n(ref_table, ref_id, field)`,
    `CREATE INDEX IF NOT EXISTS idx_i18n_uz ON content_i18n(uz)`,
  ];

  // Har bir DDL qaysi jadvalga tegishli — shundan kelib chiqib filtrlaymiz.
  return all.filter((stmt) => {
    const t = tableOf(stmt);
    // Tizim jadvallari yoki noma'lum — har doim qoldiramiz.
    return !t || !ALL_COLLECTIONS.has(t) || site.has(t);
  });
}

/** DDL matnidan jadval nomini ajratib olamiz (CREATE TABLE yoki CREATE INDEX ... ON). */
function tableOf(stmt) {
  const table = stmt.match(/CREATE TABLE IF NOT EXISTS\s+(\w+)/i);
  if (table) return table[1];
  const index = stmt.match(/CREATE INDEX IF NOT EXISTS\s+\w+\s+ON\s+(\w+)/i);
  return index ? index[1] : null;
}

/** Barcha mumkin bo'lgan kontent jadvallari (profilga bog'liq bo'lganlari). */
const ALL_COLLECTIONS = new Set(site.PROFILES.all.collections);

async function migrate(adapter) {
  for (const stmt of ddl(adapter.dialect)) {
    await adapter.exec(stmt);
  }
}

module.exports = { migrate, ddl };
