'use strict';
const { test } = require('node:test');
const assert = require('node:assert');

const { sanitizeUrl, sanitizeString, isEmail, sanitizeFilename } = require('../src/security/sanitize');
const { hashPassword, newSalt, verifyPassword } = require('../src/security/passwords');
const { magicOk } = require('../src/uploads');
const { toPg, withReturningId } = require('../src/db/pg-sql');

test('sanitizeUrl xavfli sxemalarni bloklaydi', () => {
  assert.strictEqual(sanitizeUrl('javascript:alert(1)'), '');
  assert.strictEqual(sanitizeUrl('  javascript:alert(1)'), '');
  assert.strictEqual(sanitizeUrl('java\tscript:alert(1)'), '');
  assert.strictEqual(sanitizeUrl('data:text/html,<script>'), '');
  assert.strictEqual(sanitizeUrl('vbscript:msgbox'), '');
});

test('sanitizeUrl xavfsiz URL larni saqlaydi', () => {
  assert.strictEqual(sanitizeUrl('https://kokanduni.uz'), 'https://kokanduni.uz');
  assert.strictEqual(sanitizeUrl('/news.html'), '/news.html');
  assert.strictEqual(sanitizeUrl('#anchor'), '#anchor');
  assert.strictEqual(sanitizeUrl('mailto:a@b.uz'), 'mailto:a@b.uz');
  assert.strictEqual(sanitizeUrl('www.x.uz'), 'https://www.x.uz');
});

test('sanitizeString maxLength ni cheklaydi', () => {
  assert.strictEqual(sanitizeString('  hi  '), 'hi');
  assert.strictEqual(sanitizeString('abcdef', 3), 'abc');
  assert.strictEqual(sanitizeString(null), '');
});

test('isEmail to‘g‘ri ishlaydi', () => {
  assert.ok(isEmail('a@b.uz'));
  assert.ok(!isEmail('notanemail'));
  assert.ok(!isEmail('a@b'));
});

test('sanitizeFilename xavfli belgilarni tozalaydi', () => {
  assert.strictEqual(sanitizeFilename('../../etc/passwd'), 'passwd');
  assert.strictEqual(sanitizeFilename('a b!.png'), 'a-b-.png');
});

test('parol hash + verify (scrypt) ishlaydi', () => {
  const salt = newSalt();
  const hash = hashPassword('Secret123', salt);
  const user = { salt, password_hash: hash };
  assert.ok(verifyPassword('Secret123', user));
  assert.ok(!verifyPassword('wrong', user));
  assert.ok(!verifyPassword('Secret123', null)); // user yo'q
});

test('toPg ? belgilarini $n ga aylantiradi (Postgres)', () => {
  assert.strictEqual(toPg('SELECT * FROM x WHERE a = ? AND b = ?'), 'SELECT * FROM x WHERE a = $1 AND b = $2');
  assert.strictEqual(toPg('SELECT 1'), 'SELECT 1');
});

test('withReturningId: oddiy INSERT ga RETURNING id qo‘shadi', () => {
  assert.strictEqual(withReturningId('INSERT INTO news (title) VALUES ($1)'), 'INSERT INTO news (title) VALUES ($1) RETURNING id');
});

test('withReturningId: upsert (ON CONFLICT) ga RETURNING QO‘SHMAYDI — bu bug tuzatishi', () => {
  // settings va overrides jadvallarida `id` ustuni yo'q — RETURNING id Postgres'da xato berardi
  const settings = 'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = excluded.value';
  const overrides = 'INSERT INTO overrides (element_id, payload_json, updated_at) VALUES ($1, $2, $3) ON CONFLICT(element_id) DO UPDATE SET payload_json = excluded.payload_json';
  assert.strictEqual(withReturningId(settings), settings); // o'zgarmaydi
  assert.strictEqual(withReturningId(overrides), overrides); // o'zgarmaydi
});

test('withReturningId: allaqachon RETURNING bor bo‘lsa takrorlamaydi', () => {
  const q = 'INSERT INTO x (a) VALUES ($1) RETURNING id';
  assert.strictEqual(withReturningId(q), q);
});

test('magicOk fayl imzosini tekshiradi', () => {
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  assert.ok(magicOk('.png', png));
  assert.ok(!magicOk('.png', Buffer.from('notapng12345')));
  const pdf = Buffer.from('%PDF-1.4 rest of file here');
  assert.ok(magicOk('.pdf', pdf));
  assert.ok(!magicOk('.html', Buffer.from('<script>xxxx</script>')));
});
