'use strict';
// Xavfsizlik testlari — ichki server (in-process) ustida real so'rovlar.
// Muhitni require'dan OLDIN o'rnatamiz.
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');
process.env.NODE_ENV = 'development';
process.env.DEFAULT_STAFF_PASSWORD = 'SecStaff123';
process.env.DEFAULT_EDITOR_PASSWORD = 'SecEditor123';
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'kusec-'));
process.env.SQLITE_PATH = path.join(TMP, 'test.db');
process.env.UPLOAD_DIR = path.join(TMP, 'uploads');

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const db = require('../src/db');
const { bootstrapUsers, seedContent } = require('../src/db/seed');
const { loadManifest } = require('../src/manifest');
const { createServer } = require('../src/app');

let server, base;

function jar() { return {}; }
function cookieHeader(j) { return Object.entries(j).map(([k, v]) => `${k}=${v}`).join('; '); }
function store(j, res) {
  const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const c of sc) { const p = c.split(';')[0]; const i = p.indexOf('='); j[p.slice(0, i)] = p.slice(i + 1); }
  return sc;
}
async function req(j, method, url, { body, csrf = true, headers } = {}) {
  const h = Object.assign({ Cookie: cookieHeader(j) }, headers || {});
  if (body !== undefined) h['Content-Type'] = 'application/json';
  if (csrf && ['POST', 'PUT', 'DELETE'].includes(method)) h['x-csrf-token'] = j.ku_csrf || '';
  const res = await fetch(base + url, { method, headers: h, body: body !== undefined ? JSON.stringify(body) : undefined, redirect: 'manual' });
  store(j, res);
  let data = null; try { data = await res.json(); } catch { data = null; }
  return { status: res.status, data, res };
}
async function session(j) { return req(j, 'GET', '/api/admin/session'); }
async function login(j, email, password) { await session(j); return req(j, 'POST', '/api/admin/login', { body: { email, password } }); }

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

test('CSRF: mutating admin so’rov tokensiz → 403', async () => {
  const j = jar(); await session(j);
  const r = await req(j, 'POST', '/api/admin/news', { body: { title: 'x' }, csrf: false });
  assert.strictEqual(r.status, 403);
});

test('Anon admin API → 401', async () => {
  const j = jar();
  assert.strictEqual((await req(j, 'GET', '/api/admin/elements')).status, 401);
  assert.strictEqual((await req(j, 'GET', '/api/admin/users')).status, 401);
});

test('SQLi login email bypass bermaydi → 401', async () => {
  const j = jar();
  assert.strictEqual((await login(j, "' OR '1'='1' --", 'x')).status, 401);
});

test('RBAC: editor cheklangan (users/settings/video)', async () => {
  const j = jar(); await login(j, 'admin@kokandu.uz', 'SecEditor123');
  assert.strictEqual((await req(j, 'GET', '/api/admin/users')).status, 403);
  assert.strictEqual((await req(j, 'PUT', '/api/admin/settings', { body: { news_title: 'x' } })).status, 403);
  assert.strictEqual((await req(j, 'PUT', '/api/admin/elements/cms-0001', { body: { src: 'x' } })).status, 403);
});

test('XSS: javascript: havola tozalanadi', async () => {
  const j = jar(); await login(j, 'staff@kokandu.uz', 'SecStaff123');
  const r = await req(j, 'POST', '/api/admin/news', { body: { title: 'ok', link: 'javascript:alert(1)' } });
  assert.strictEqual(r.status, 201);
  assert.strictEqual(r.data.item.link, '');
});

test('XSS: menyu havola href (javascript:) tozalanadi', async () => {
  const j = jar(); await login(j, 'staff@kokandu.uz', 'SecStaff123');
  const put = await req(j, 'PUT', '/api/admin/elements/cms-0011', { body: { href: 'javascript:alert(1)', target: '_blank' } });
  assert.strictEqual(put.status, 200);
  const ov = await req(jar(), 'GET', '/api/public/overrides');
  const e = ov.data.overrides && ov.data.overrides['cms-0011'];
  assert.ok(!e || !/javascript:/i.test(e.href || ''));
});

test('SQLi: title matn sifatida saqlanadi, jadval buzilmaydi', async () => {
  const j = jar(); await login(j, 'staff@kokandu.uz', 'SecStaff123');
  const r = await req(j, 'POST', '/api/admin/news', { body: { title: "x'); DROP TABLE news;--" } });
  assert.strictEqual(r.status, 201);
  assert.strictEqual((await req(j, 'GET', '/api/admin/news')).status, 200);
});

test('Fayl yuklash: magic-bytes va tur allowlist', async () => {
  const j = jar(); await login(j, 'staff@kokandu.uz', 'SecStaff123');
  async function up(name, bytes, type) {
    const fd = new FormData();
    fd.append('file', new Blob([bytes], { type: type || 'application/octet-stream' }), name);
    const res = await fetch(base + '/api/admin/files', { method: 'POST', headers: { Cookie: cookieHeader(j), 'x-csrf-token': j.ku_csrf || '' }, body: fd });
    store(j, res); let d = null; try { d = await res.json(); } catch { /**/ }
    return { status: res.status, data: d };
  }
  const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0]);
  assert.strictEqual((await up('fake.png', Buffer.from('not a png'), 'image/png')).status, 400);
  assert.strictEqual((await up('x.txt', Buffer.from('hi'))).status, 400);
  assert.strictEqual((await up('x.html', Buffer.from('<script>'))).status, 400);
  const ok = await up('good.png', PNG, 'image/png');
  assert.strictEqual(ok.status, 201);
  const trav = await up('../../../etc/passwd.png', PNG, 'image/png');
  assert.strictEqual(trav.status, 201);
  assert.ok(!/\.\.|\//.test(trav.data.file.filename));
});

test('Path traversal (static) → 404', async () => {
  for (const p of ['/uploads/../../src/config.js', '/../src/config.js', '/%2e%2e/src/config.js']) {
    const r = await fetch(base + p, { redirect: 'manual' });
    assert.ok(r.status === 404 || r.status === 403, `${p} status=${r.status}`);
  }
});

test('Xavfsizlik sarlavhalari va cookie bayroqlari', async () => {
  const home = await fetch(base + '/');
  assert.match(home.headers.get('content-security-policy') || '', /default-src 'self'/);
  assert.strictEqual(home.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.strictEqual(home.headers.get('x-content-type-options'), 'nosniff');
  const j = jar();
  const sl = await login(j, 'staff@kokandu.uz', 'SecStaff123');
  const sc = sl.res.headers.getSetCookie();
  const sidC = sc.find((c) => c.startsWith('ku_cms_sid='));
  assert.ok(sidC && /HttpOnly/i.test(sidC) && /SameSite=Lax/i.test(sidC), 'sessiya cookie HttpOnly+SameSite');
});

test('Oxirgi staff adminni o’chirib bo’lmaydi', async () => {
  const j = jar(); await login(j, 'staff@kokandu.uz', 'SecStaff123');
  const list = await req(j, 'GET', '/api/admin/users');
  const staff = (list.data.users || []).filter((u) => u.role === 'staff');
  if (staff.length === 1) {
    const del = await req(j, 'DELETE', `/api/admin/users/${staff[0].id}`);
    assert.strictEqual(del.status, 400);
  }
});
