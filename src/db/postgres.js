'use strict';
/** PostgreSQL adapter — production (Railway/VPS). `?` -> `$n` avtomatik tarjima. */
const fs = require('node:fs');
const { Pool } = require('pg');
const { toPg, withReturningId } = require('./pg-sql');

/**
 * TLS konfiguratsiyasi:
 *  - PGSSL=disable            -> SSL o'chirilgan (faqat ishonchli ichki tarmoq)
 *  - PGSSLROOTCERT=/path/ca   -> CA sertifikat bilan TO'LIQ tekshiruv (eng xavfsiz)
 *  - PGSSL=no-verify          -> shifrlangan, lekin sertifikat tekshirilmaydi (Railway default)
 *  - (default)                -> no-verify (Railway self-signed bilan ishlashi uchun)
 */
function buildSsl() {
  if (process.env.PGSSL === 'disable') return false;
  const caPath = process.env.PGSSLROOTCERT;
  if (caPath && fs.existsSync(caPath)) {
    return { ca: fs.readFileSync(caPath, 'utf8'), rejectUnauthorized: true };
  }
  return { rejectUnauthorized: false };
}

async function runQuery(client, sql, params) {
  const q = withReturningId(toPg(sql));
  const r = await client.query(q, params);
  return { changes: r.rowCount, lastId: r.rows[0] ? r.rows[0].id : undefined };
}

class PostgresAdapter {
  constructor(connectionString) {
    this.dialect = 'postgres';
    this.pool = new Pool({
      connectionString,
      ssl: buildSsl(),
      max: Number(process.env.PG_POOL_MAX || 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  async get(sql, params = []) {
    const r = await this.pool.query(toPg(sql), params);
    return r.rows[0] || null;
  }
  async all(sql, params = []) {
    const r = await this.pool.query(toPg(sql), params);
    return r.rows;
  }
  async run(sql, params = []) {
    return runQuery(this.pool, sql, params);
  }
  async exec(sql) {
    await this.pool.query(sql);
  }
  async tx(fn) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const wrap = {
        dialect: 'postgres',
        get: async (s, p = []) => (await client.query(toPg(s), p)).rows[0] || null,
        all: async (s, p = []) => (await client.query(toPg(s), p)).rows,
        run: (s, p = []) => runQuery(client, s, p),
      };
      const result = await fn(wrap);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
  async close() {
    await this.pool.end();
  }
}

module.exports = PostgresAdapter;
