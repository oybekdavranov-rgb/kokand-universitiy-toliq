'use strict';
// Muhitni require'dan OLDIN o'rnatamiz (config env'ni require vaqtida o'qiydi)
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');
process.env.NODE_ENV = 'development';
process.env.DEFAULT_STAFF_PASSWORD = 'TestStaff123';
process.env.DEFAULT_EDITOR_PASSWORD = 'TestEditor123';
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'kucms-'));
process.env.SQLITE_PATH = path.join(TMP, 'test.db');
process.env.UPLOAD_DIR = path.join(TMP, 'uploads');

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const db = require('../src/db');
const { bootstrapUsers, seedContent } = require('../src/db/seed');
const { loadManifest } = require('../src/manifest');
const { createServer } = require('../src/app');

let server, base, cookies = {};

function cookieHeader() {
  return Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
}
function storeCookies(res) {
  const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const c of sc) {
    const [pair] = c.split(';');
    const idx = pair.indexOf('=');
    cookies[pair.slice(0, idx)] = pair.slice(idx + 1);
  }
}
async function req(method, url, body) {
  const headers = { Cookie: cookieHeader() };
  if (body) headers['Content-Type'] = 'application/json';
  if (['POST', 'PUT', 'DELETE'].includes(method)) headers['x-csrf-token'] = cookies['ku_csrf'] || '';
  const res = await fetch(base + url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  storeCookies(res);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

before(async () => {
  await db.init();
  await bootstrapUsers();
  await seedContent();
  loadManifest();
  server = createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
});

after(async () => {
  await new Promise((r) => server.close(r));
  try { await db.close(); } catch { /* noop */ }
});

test('health endpoint', async () => {
  const { status, data } = await req('GET', '/api/health');
  assert.strictEqual(status, 200);
  assert.strictEqual(data.status, 'healthy');
});

test('public site seed ma\'lumot qaytaradi', async () => {
  const { data } = await req('GET', '/api/public/site');
  assert.ok(data.news.length >= 4);
  assert.ok(data.distinctions.length >= 6);
  assert.ok(Array.isArray(data.stories) && data.stories.length >= 8);
  assert.ok(Array.isArray(data.gallery) && data.gallery.length >= 10);
  assert.ok(Array.isArray(data.residences) && data.residences.length >= 5);
});

test('CSRF token siz login rad etiladi', async () => {
  await req('GET', '/api/admin/session'); // csrf cookie o'rnatiladi
  const csrf = cookies['ku_csrf'];
  const res = await fetch(base + '/api/admin/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookieHeader() },
    body: JSON.stringify({ email: 'staff@kokandu.uz', password: 'TestStaff123' }),
  });
  assert.strictEqual(res.status, 403);
  assert.ok(csrf); // token mavjud edi, lekin header yuborilmadi
});

test('staff login + noto\'g\'ri parol', async () => {
  await req('GET', '/api/admin/session');
  const bad = await req('POST', '/api/admin/login', { email: 'staff@kokandu.uz', password: 'wrong' });
  assert.strictEqual(bad.status, 401);
  const ok = await req('POST', '/api/admin/login', { email: 'staff@kokandu.uz', password: 'TestStaff123' });
  assert.strictEqual(ok.status, 200);
  assert.strictEqual(ok.data.user.role, 'staff');
});

test('staff CRUD + javascript: sanitize', async () => {
  const created = await req('POST', '/api/admin/news', { title: 'Test', link: 'javascript:alert(1)' });
  assert.strictEqual(created.status, 201);
  assert.strictEqual(created.data.item.link, '');
  const del = await req('DELETE', `/api/admin/news/${created.data.item.id}`);
  assert.strictEqual(del.status, 200);
});

test('staff users va settingsга kira oladi', async () => {
  const users = await req('GET', '/api/admin/users');
  assert.strictEqual(users.status, 200);
  assert.ok(users.data.users.length >= 2);
  const st = await req('PUT', '/api/admin/settings', { news_title: 'Yangi', evil: 'x' });
  assert.strictEqual(st.status, 200);
  assert.strictEqual(st.data.settings.news_title, 'Yangi');
  assert.ok(!('evil' in st.data.settings));
});

test('editor RBAC — users/settings/video rad etiladi', async () => {
  cookies = {}; // yangi sessiya
  await req('GET', '/api/admin/session');
  await req('POST', '/api/admin/login', { email: 'admin@kokandu.uz', password: 'TestEditor123' });
  assert.strictEqual((await req('GET', '/api/admin/users')).status, 403);
  assert.strictEqual((await req('PUT', '/api/admin/settings', { news_title: 'x' })).status, 403);
  assert.strictEqual((await req('PUT', '/api/admin/elements/cms-0001', { src: 'x' })).status, 403);
  // matn elementi — ruxsat
  assert.strictEqual((await req('PUT', '/api/admin/elements/cms-0138', { text: 'Salom' })).status, 200);
  // kontent yaratish — editor uchun ochiq
  assert.strictEqual((await req('POST', '/api/admin/interests', { title: 'E' })).status, 201);
});

test('ochiq ariza: validatsiya + honeypot + saqlash', async () => {
  cookies = {};
  await req('GET', '/api/admin/session');
  // qisqa ism rad etiladi
  assert.strictEqual((await req('POST', '/api/public/apply', { name: 'Al', phone: '+998901234567' })).status, 400);
  // yomon telefon rad etiladi
  assert.strictEqual((await req('POST', '/api/public/apply', { name: 'Alisher Karimov', phone: '12' })).status, 400);
  // honeypot to'ldirilgan -> saqlanmaydi (lekin 200)
  const bot = await req('POST', '/api/public/apply', { name: 'Bot Bot', phone: '+998901111111', website: 'spam' });
  assert.strictEqual(bot.status, 200);
  assert.ok(!bot.data.id);
  // to'g'ri ariza saqlanadi
  const ok = await req('POST', '/api/public/apply', { name: 'Nodira Yusupova', phone: '+998 91 234 56 78', email: 'n@example.com' });
  assert.strictEqual(ok.status, 201);
  assert.ok(ok.data.id);
});

test('PII himoyasi: arizalar faqat staff uchun', async () => {
  // editor sifatida
  cookies = {};
  await req('GET', '/api/admin/session');
  await req('POST', '/api/admin/login', { email: 'admin@kokandu.uz', password: 'TestEditor123' });
  assert.strictEqual((await req('GET', '/api/admin/applications')).status, 403);
  assert.strictEqual((await req('DELETE', '/api/admin/applications/1')).status, 403);
  // editor kontentni ko'ra oladi
  assert.strictEqual((await req('GET', '/api/admin/news')).status, 200);

  // staff sifatida
  cookies = {};
  await req('GET', '/api/admin/session');
  await req('POST', '/api/admin/login', { email: 'staff@kokandu.uz', password: 'TestStaff123' });
  const list = await req('GET', '/api/admin/applications');
  assert.strictEqual(list.status, 200);
  assert.ok(Array.isArray(list.data.items));
});

test('sayt profili: barcha to‘plamlar birlashgan rejimda ochiq', async () => {
  const { profile, PROFILES, has } = require('../src/site-profile');
  // Testlar SITE_PROFILE'siz ishlaydi -> "all"
  assert.strictEqual(profile.name, 'all');
  assert.ok(has('news') && has('residences') && has('applications'));
  // Har bir profil o'z jadvallarini bilishi kerak
  assert.ok(PROFILES.university.collections.includes('gallery'));
  assert.ok(!PROFILES.university.collections.includes('applications'));
  assert.ok(PROFILES.castle.collections.includes('applications'));
  assert.ok(!PROFILES.castle.collections.includes('news'));
  // Sessiya javobi admin panelга faol to'plamlar ro'yxatini beradi
  const s = await req('GET', '/api/admin/session');
  assert.ok(Array.isArray(s.data.collections));
  assert.ok(s.data.collections.includes('news'));
});
