'use strict';
/**
 * Baza abstraksiyasi. DATABASE_URL bo'lsa PostgreSQL, aks holda SQLite.
 * Bir xil async interfeys: get / all / run / tx / exec / close.
 */
const { config } = require('../config');
const log = require('../logger');
const { migrate } = require('./schema');

let adapter = null;

async function init() {
  if (adapter) return adapter;
  if (config.DB_DRIVER === 'postgres') {
    const PostgresAdapter = require('./postgres');
    adapter = new PostgresAdapter(config.DATABASE_URL);
    log.info('DB: PostgreSQL adapter');
  } else {
    const fs = require('node:fs');
    fs.mkdirSync(config.DATA_DIR, { recursive: true });
    const SqliteAdapter = require('./sqlite');
    adapter = new SqliteAdapter(config.SQLITE_PATH);
    log.info('DB: SQLite adapter', { path: config.SQLITE_PATH });
  }
  await migrate(adapter);
  log.info('DB: migratsiya tayyor', { dialect: adapter.dialect });
  return adapter;
}

function ensure() {
  if (!adapter) throw new Error('DB init() chaqirilmagan');
  return adapter;
}

module.exports = {
  init,
  get dialect() { return ensure().dialect; },
  get: (sql, params) => ensure().get(sql, params),
  all: (sql, params) => ensure().all(sql, params),
  run: (sql, params) => ensure().run(sql, params),
  tx: (fn) => ensure().tx(fn),
  exec: (sql) => ensure().exec(sql),
  close: () => ensure().close(),
  /** SQLite uchun WAL'ni asosiy faylga yozadi. Postgres'da hech narsa qilmaydi. */
  checkpoint: async () => {
    const a = ensure();
    if (typeof a.checkpoint === 'function') await a.checkpoint();
  },
};
