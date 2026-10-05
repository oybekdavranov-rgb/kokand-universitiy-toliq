'use strict';
const path = require('node:path');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeString(value, maxLength = 5000) {
  if (value === undefined || value === null) return '';
  return String(value).trim().slice(0, maxLength);
}

/** Xavfli sxemalarni (javascript:, data:, ...) bloklaydi */
function sanitizeUrl(value) {
  const trimmed = sanitizeString(value, 2000);
  if (!trimmed) return '';
  const collapsed = trimmed.replace(/[\s\x00-\x1f]+/g, '').toLowerCase();
  if (/^(javascript|data|vbscript|file|blob):/.test(collapsed)) return '';
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(trimmed)) return trimmed;
  return trimmed.startsWith('www.') ? `https://${trimmed}` : trimmed;
}

function sanitizeFilename(filename) {
  const base = path.basename(filename || 'file');
  const safe = base.replace(/[^a-zA-Z0-9._-]/g, '-');
  return safe || 'file';
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
function isEmail(v) {
  return EMAIL_RE.test(String(v || ''));
}

module.exports = { escapeHtml, sanitizeString, sanitizeUrl, sanitizeFilename, isEmail };
