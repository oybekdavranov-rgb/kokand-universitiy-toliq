'use strict';
const fsp = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const db = require('./db');
const { config } = require('./config');
const { sanitizeFilename } = require('./security/sanitize');

/** Fayl imzosi (magic bytes) kengaytmaga mos kelishini tekshiradi (polyglot himoyasi). */
function magicOk(ext, buf) {
  if (buf.length < 12) return false;
  const hex = buf.subarray(0, 12).toString('hex').toLowerCase();
  const ascii = buf.subarray(0, 12).toString('latin1');
  switch (ext) {
    case '.jpg': case '.jpeg': return hex.startsWith('ffd8ff');
    case '.png': return hex.startsWith('89504e470d0a1a0a');
    case '.gif': return ascii.startsWith('GIF87a') || ascii.startsWith('GIF89a');
    case '.webp': return ascii.startsWith('RIFF') && ascii.substr(8, 4) === 'WEBP';
    case '.mp4': return buf.subarray(4, 8).toString('latin1') === 'ftyp';
    case '.webm': return hex.startsWith('1a45dfa3');
    case '.pdf': return ascii.startsWith('%PDF-');
    default: return false;
  }
}

async function listFiles() {
  return db.all('SELECT id, filename, original_name, mime_type, size_bytes, public_path, created_at FROM files ORDER BY created_at DESC');
}

async function saveUpload(uploaded) {
  const safeOriginal = sanitizeFilename(uploaded.name || 'upload');
  const ext = path.extname(safeOriginal).toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(config.ALLOWED_UPLOAD_TYPES, ext)) {
    throw Object.assign(new Error('Ruxsat etilmagan fayl turi. Faqat: JPG, PNG, WEBP, GIF, MP4, WEBM, PDF.'), { statusCode: 400 });
  }
  const buf = Buffer.from(await uploaded.arrayBuffer());
  if (buf.length > config.MAX_UPLOAD_BYTES) {
    throw Object.assign(new Error('Fayl hajmi juda katta (maks 50MB).'), { statusCode: 400 });
  }
  if (!magicOk(ext, buf)) {
    throw Object.assign(new Error('Fayl mazmuni kengaytmaga mos emas (buzuq yoki soxta fayl).'), { statusCode: 400 });
  }
  const uniqueName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${safeOriginal}`;
  const publicPath = `/uploads/${uniqueName}`;
  await fsp.mkdir(config.UPLOADS_DIR, { recursive: true });
  await fsp.writeFile(path.join(config.UPLOADS_DIR, uniqueName), buf, { mode: 0o644 });
  await db.run(
    'INSERT INTO files (filename, original_name, mime_type, size_bytes, public_path, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [uniqueName, safeOriginal, config.ALLOWED_UPLOAD_TYPES[ext], buf.length, publicPath, Date.now()]
  );
  return db.get('SELECT id, filename, original_name, mime_type, size_bytes, public_path, created_at FROM files WHERE filename = ?', [uniqueName]);
}

async function deleteUpload(filename) {
  const row = await db.get('SELECT * FROM files WHERE filename = ?', [filename]);
  if (!row) return false;
  try {
    await fsp.unlink(path.join(config.UPLOADS_DIR, row.filename));
  } catch { /* ignore missing */ }
  await db.run('DELETE FROM files WHERE filename = ?', [filename]);
  return true;
}

module.exports = { listFiles, saveUpload, deleteUpload, magicOk };
