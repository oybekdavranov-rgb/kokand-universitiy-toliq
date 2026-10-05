'use strict';
const db = require('./db');
const site = require('./site-profile');
const { sanitizeString, sanitizeUrl } = require('./security/sanitize');

const ALL_COLLECTIONS = {
  news: {
    columns: ['title', 'date', 'image', 'excerpt', 'body', 'link', 'sort'],
    required: 'title',
    sanitize: (b) => ({
      title: sanitizeString(b.title, 500), date: sanitizeString(b.date, 100),
      image: sanitizeUrl(b.image), excerpt: sanitizeString(b.excerpt, 2000),
      body: sanitizeString(b.body, 40000), link: sanitizeUrl(b.link),
      sort: Number.isFinite(Number(b.sort)) ? Number(b.sort) : 0,
    }),
  },
  achievements: {
    columns: ['name', 'subtitle', 'image', 'description', 'sort'],
    required: 'name',
    sanitize: (b) => ({
      name: sanitizeString(b.name, 500), subtitle: sanitizeString(b.subtitle, 500),
      image: sanitizeUrl(b.image), description: sanitizeString(b.description, 20000),
      sort: Number.isFinite(Number(b.sort)) ? Number(b.sort) : 0,
    }),
  },
  distinctions: {
    columns: ['title', 'image', 'summary', 'body', 'sort'],
    required: 'title',
    sanitize: (b) => ({
      title: sanitizeString(b.title, 500), image: sanitizeUrl(b.image),
      summary: sanitizeString(b.summary, 2000), body: sanitizeString(b.body, 40000),
      sort: Number.isFinite(Number(b.sort)) ? Number(b.sort) : 0,
    }),
  },
  interests: {
    columns: ['title', 'image', 'body', 'link', 'sort'],
    required: 'title',
    sanitize: (b) => ({
      title: sanitizeString(b.title, 500), image: sanitizeUrl(b.image),
      body: sanitizeString(b.body, 20000), link: sanitizeUrl(b.link),
      sort: Number.isFinite(Number(b.sort)) ? Number(b.sort) : 0,
    }),
  },
  stories: {
    columns: ['title', 'date', 'category', 'image', 'excerpt', 'body', 'link', 'sort'],
    required: 'title',
    sanitize: (b) => ({
      title: sanitizeString(b.title, 500), date: sanitizeString(b.date, 100),
      category: sanitizeString(b.category, 120), image: sanitizeUrl(b.image),
      excerpt: sanitizeString(b.excerpt, 2000), body: sanitizeString(b.body, 40000),
      link: sanitizeUrl(b.link),
      sort: Number.isFinite(Number(b.sort)) ? Number(b.sort) : 0,
    }),
  },
  applications: {
    order: 'created_at DESC, id DESC', // yangi arizalar tepada
    limit: 500, // ochiq formadan to'ladi — cheksiz yuklashning oldini olamiz
               // (to'liq ro'yxat uchun CSV eksport bor)
    columns: ['name', 'phone', 'email', 'gender', 'faculty', 'course', 'city', 'residence', 'duration', 'note', 'status', 'sort'],
    required: 'name',
    sanitize: (b) => ({
      name: sanitizeString(b.name, 200), phone: sanitizeString(b.phone, 60),
      email: sanitizeString(b.email, 200), gender: sanitizeString(b.gender, 30),
      faculty: sanitizeString(b.faculty, 200), course: sanitizeString(b.course, 40),
      city: sanitizeString(b.city, 200), residence: sanitizeString(b.residence, 200),
      duration: sanitizeString(b.duration, 60), note: sanitizeString(b.note, 4000),
      status: ['yangi', 'ko\u2018rildi', 'tasdiqlandi', 'rad etildi'].includes(b.status) ? b.status : 'yangi',
      sort: Number.isFinite(Number(b.sort)) ? Number(b.sort) : 0,
    }),
  },
  castle_pages: {
    columns: ['title', 'slug', 'icon', 'image', 'summary', 'body', 'faq', 'sort'],
    required: 'title',
    sanitize: (b) => ({
      title: sanitizeString(b.title, 500), slug: sanitizeString(b.slug, 120),
      icon: sanitizeString(b.icon, 40), image: sanitizeUrl(b.image),
      summary: sanitizeString(b.summary, 2000), body: sanitizeString(b.body, 60000),
      faq: sanitizeString(b.faq, 40000),
      sort: Number.isFinite(Number(b.sort)) ? Number(b.sort) : 0,
    }),
  },
  residences: {
    columns: ['name', 'city', 'image', 'summary', 'description', 'amenities', 'price', 'link', 'sort'],
    required: 'name',
    sanitize: (b) => ({
      name: sanitizeString(b.name, 500), city: sanitizeString(b.city, 200),
      image: sanitizeUrl(b.image), summary: sanitizeString(b.summary, 2000),
      description: sanitizeString(b.description, 40000),
      amenities: sanitizeString(b.amenities, 4000), // har qatorda bitta qulaylik
      price: sanitizeString(b.price, 200), link: sanitizeUrl(b.link),
      sort: Number.isFinite(Number(b.sort)) ? Number(b.sort) : 0,
    }),
  },
  gallery: {
    columns: ['title', 'category', 'image', 'description', 'video', 'sort'],
    required: 'title',
    sanitize: (b) => ({
      title: sanitizeString(b.title, 500), category: sanitizeString(b.category, 120),
      image: sanitizeUrl(b.image), description: sanitizeString(b.description, 40000),
      video: sanitizeUrl(b.video),
      sort: Number.isFinite(Number(b.sort)) ? Number(b.sort) : 0,
    }),
  },
  programmes: {
    columns: ['key', 'title', 'subtitle', 'image', 'intro', 'highlights', 'faq', 'link', 'sort'],
    required: 'title',
    sanitize: (b) => ({
      key: sanitizeString(b.key, 100),
      title: sanitizeString(b.title, 500),
      subtitle: sanitizeString(b.subtitle, 500),
      image: sanitizeUrl(b.image),
      intro: sanitizeString(b.intro, 10000),
      highlights: sanitizeString(b.highlights, 10000), // har qatorda bitta band
      faq: sanitizeString(b.faq, 20000),               // "Savol :: Javob" har qatorda
      link: sanitizeUrl(b.link),
      sort: Number.isFinite(Number(b.sort)) ? Number(b.sort) : 0,
    }),
  },
};

/** Faqat shu sayt profilida faol bo'lgan to'plamlar. */
const COLLECTIONS = Object.fromEntries(
  Object.entries(ALL_COLLECTIONS).filter(([name]) => site.has(name)),
);

/** Ro'yxatdagi nom shu profilda mavjudmi (route regex uchun ham ishlatiladi). */
const NAMES = Object.keys(COLLECTIONS);

async function list(collection) {
  const cfg = COLLECTIONS[collection];
  const order = (cfg && cfg.order) || 'sort ASC, id ASC';
  // Cheklov faqat ichki konfiguratsiyadan keladi (foydalanuvchi kiritmaydi)
  const lim = Number.isInteger(cfg && cfg.limit) ? ` LIMIT ${cfg.limit}` : '';
  return db.all(`SELECT * FROM ${collection} ORDER BY ${order}${lim}`);
}

/** Yozuvlar umumiy soni (ro'yxat cheklangani haqida xabar berish uchun) */
async function count(collection) {
  const r = await db.get(`SELECT COUNT(*) AS c FROM ${collection}`);
  return Number(r && r.c) || 0;
}

async function create(collection, body) {
  const cfg = COLLECTIONS[collection];
  const data = cfg.sanitize(body);
  if (!data[cfg.required]) throw Object.assign(new Error('Sarlavha/nom majburiy.'), { statusCode: 400 });
  const now = Date.now();
  const cols = [...cfg.columns, 'created_at', 'updated_at'];
  const ph = cols.map(() => '?').join(', ');
  const values = [...cfg.columns.map((c) => data[c]), now, now];
  const { lastId } = await db.run(`INSERT INTO ${collection} (${cols.join(', ')}) VALUES (${ph})`, values);
  return db.get(`SELECT * FROM ${collection} WHERE id = ?`, [lastId]);
}

async function update(collection, id, body) {
  const cfg = COLLECTIONS[collection];
  const existing = await db.get(`SELECT id FROM ${collection} WHERE id = ?`, [id]);
  if (!existing) return null;
  const data = cfg.sanitize(body);
  if (!data[cfg.required]) throw Object.assign(new Error('Sarlavha/nom majburiy.'), { statusCode: 400 });
  const setClause = cfg.columns.map((c) => `${c} = ?`).join(', ');
  const values = [...cfg.columns.map((c) => data[c]), Date.now(), id];
  await db.run(`UPDATE ${collection} SET ${setClause}, updated_at = ? WHERE id = ?`, values);
  return db.get(`SELECT * FROM ${collection} WHERE id = ?`, [id]);
}

async function remove(collection, id) {
  await db.run(`DELETE FROM ${collection} WHERE id = ?`, [id]);
}

module.exports = { COLLECTIONS, NAMES, list, count, create, update, remove };
