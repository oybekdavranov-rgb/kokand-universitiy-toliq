'use strict';
/**
 * Kontent avto-tarjimasi. Admin o'zbekcha matn kiritganda, matn maydonlari
 * en/ru ga tarjima qilinib content_i18n jadvaliga saqlanadi. Ochiq sayt
 * /api/public/i18n orqali { "uz matn": { en, ru } } lug'atini oladi va
 * mavjud i18n dvigateli (public/i18n.js) uni avtomatik qo'llaydi.
 *
 * PII (applications) tarjima qilinmaydi.
 */
const db = require('./db');
const log = require('./logger');
const { translate } = require('./translate');

// Har bir to'plamда tarjima qilinadigan MATN maydonlari (URL/slug/raqam emas).
const FIELDS = {
  news: ['title', 'excerpt', 'body'],
  achievements: ['name', 'subtitle', 'description'],
  distinctions: ['title', 'summary', 'body'],
  interests: ['title', 'body'],
  stories: ['title', 'category', 'excerpt', 'body'],
  programmes: ['title', 'subtitle', 'intro', 'highlights', 'faq'],
  gallery: ['title', 'category', 'description'],
  residences: ['name', 'city', 'summary', 'description', 'amenities', 'price'],
  castle_pages: ['title', 'summary', 'body', 'faq'],
};

function fieldsFor(table) { return FIELDS[table] || []; }

/** Boshqa yozuvда shu uz matn allaqachon tarjima qilinganmi (doimiy kesh). */
async function reuseExisting(uz, col) {
  const row = await db.get(
    `SELECT ${col} AS v FROM content_i18n WHERE uz = ? AND ${col} IS NOT NULL AND ${col} <> '' LIMIT 1`,
    [uz]
  );
  return row && row.v ? row.v : null;
}

async function translateField(uz) {
  const src = String(uz == null ? '' : uz).trim();
  if (!src) return { en: '', ru: '' };
  let en = await reuseExisting(src, 'en'); if (!en) en = await translate(src, 'en');
  let ru = await reuseExisting(src, 'ru'); if (!ru) ru = await translate(src, 'ru');
  return { en, ru };
}

/** Bitta yozuvning matn maydonlarini tarjima qilib saqlaydi (o'zgarganini). */
async function translateRow(table, row) {
  const fields = fieldsFor(table);
  if (!fields.length || !row || !row.id) return;
  const now = Date.now();
  for (const f of fields) {
    const uz = String(row[f] == null ? '' : row[f]).trim();
    if (!uz) { await db.run('DELETE FROM content_i18n WHERE ref_table = ? AND ref_id = ? AND field = ?', [table, row.id, f]); continue; }
    const ex = await db.get('SELECT uz FROM content_i18n WHERE ref_table = ? AND ref_id = ? AND field = ?', [table, row.id, f]);
    if (ex && ex.uz === uz) continue; // o'zgarmagan — qayta tarjima shart emas
    const { en, ru } = await translateField(uz);
    await db.run(
      `INSERT INTO content_i18n (ref_table, ref_id, field, uz, en, ru, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(ref_table, ref_id, field) DO UPDATE SET uz = excluded.uz, en = excluded.en, ru = excluded.ru, updated_at = excluded.updated_at`,
      [table, row.id, f, uz, en, ru, now]
    );
  }
}

/** Fire-and-forget: saqlashни bloklanmaydi, xato jimgina loglanadi. */
function translateRowAsync(table, row) {
  Promise.resolve().then(() => translateRow(table, row)).catch((err) => log.warn('translateRow xato', { table, err: err.message }));
}

async function deleteRow(table, id) {
  await db.run('DELETE FROM content_i18n WHERE ref_table = ? AND ref_id = ?', [table, id]);
}

function addLineEntries(dict, uz, en, ru) {
  const U = uz.split('\n'); const E = (en || '').split('\n'); const R = (ru || '').split('\n');
  if (U.length > 1 && U.length === E.length && U.length === R.length) {
    for (let i = 0; i < U.length; i++) {
      const u = U[i].trim();
      if (u && !dict[u]) dict[u] = { en: E[i].trim() || u, ru: R[i].trim() || u };
    }
  }
}

/** { "uz matn": { en, ru } } lug'ati. To'liq matn + (mos kelganda) qatorma-qator. */
async function buildDictionary() {
  const rows = await db.all("SELECT uz, en, ru FROM content_i18n WHERE uz <> ''");
  const dict = {};
  for (const r of rows) {
    const uz = (r.uz || '').trim();
    if (!uz) continue;
    dict[uz] = { en: (r.en || '').trim() || uz, ru: (r.ru || '').trim() || uz };
    addLineEntries(dict, uz, r.en || '', r.ru || '');
  }
  return dict;
}

/** Barcha mavjud kontentni tarjima qilish (admin tugmasi / seed uchun). */
async function retranslateAll(listFn) {
  let count = 0;
  for (const table of Object.keys(FIELDS)) {
    let rows = [];
    try { rows = await listFn(table); } catch { rows = []; }
    for (const row of rows) { await translateRow(table, row); count++; }
  }
  return count;
}

module.exports = { translateRow, translateRowAsync, deleteRow, buildDictionary, retranslateAll, fieldsFor, FIELDS };
