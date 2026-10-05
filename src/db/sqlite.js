'use strict';
/** node:sqlite adapter — dev/lokal (sinxron, async interfeysga o'ralgan) */
const { DatabaseSync } = require('node:sqlite');

class SqliteAdapter {
  constructor(dbPath) {
    this.dialect = 'sqlite';
    this.db = new DatabaseSync(dbPath);
    // WAL — tez va xavfsiz. wal_autocheckpoint: WAL 1MB dan oshsa asosiy
    // faylga yoziladi, shunda `app.db` ni nusxa olish ham yetarli bo'ladi.
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      PRAGMA synchronous = FULL;
      PRAGMA wal_autocheckpoint = 256;
    `);
  }
  /** WAL ni asosiy faylga yozib qo'yadi (zaxira nusxa olish uchun muhim) */
  async checkpoint() {
    try { this.db.exec('PRAGMA wal_checkpoint(TRUNCATE);'); } catch { /* ignore */ }
  }
  async get(sql, params = []) {
    return this.db.prepare(sql).get(...params) || null;
  }
  async all(sql, params = []) {
    return this.db.prepare(sql).all(...params);
  }
  async run(sql, params = []) {
    const info = this.db.prepare(sql).run(...params);
    return { changes: Number(info.changes), lastId: Number(info.lastInsertRowid) };
  }
  async exec(sql) {
    this.db.exec(sql);
  }
  async tx(fn) {
    this.db.exec('BEGIN');
    try {
      const result = await fn(this);
      this.db.exec('COMMIT');
      return result;
    } catch (err) {
      this.db.exec('ROLLBACK');
      throw err;
    }
  }
  async close() {
    // Yopishdan oldin WAL ni asosiy faylga yozamiz — shunda app.db to'liq bo'ladi
    await this.checkpoint();
    this.db.close();
  }
}

module.exports = SqliteAdapter;
