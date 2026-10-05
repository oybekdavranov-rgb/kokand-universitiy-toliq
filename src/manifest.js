'use strict';
const fs = require('node:fs');
const db = require('./db');
const { config } = require('./config');
const { sanitizeString, sanitizeUrl } = require('./security/sanitize');

let manifest = [];
let manifestMap = new Map();

let manifestLoaded = false;

function loadManifest() {
  // Manifest bo'lmasligi ham mumkin (masalan, kontenti to'liq bazadan keladigan
  // sayt) — bunda "Kontent" bo'limi bo'sh bo'ladi, server esa ishlayveradi.
  if (fs.existsSync(config.MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(config.MANIFEST_PATH, 'utf8'));
  } else {
    manifest = [];
  }
  manifestMap = new Map(manifest.map((item) => [item.id, item]));
  manifestLoaded = true;
  return manifest;
}

function getManifest() {
  if (!manifestLoaded) loadManifest();
  return { manifest, manifestMap };
}

async function getOverridesMap() {
  const rows = await db.all('SELECT element_id, payload_json, updated_at FROM overrides');
  const map = new Map();
  for (const row of rows) {
    try {
      map.set(row.element_id, { ...JSON.parse(row.payload_json), updatedAt: row.updated_at });
    } catch {
      map.set(row.element_id, { updatedAt: row.updated_at });
    }
  }
  return map;
}

function mergeElement(element, override) {
  return {
    ...element,
    hasOverride: Boolean(override),
    updatedAt: override?.updatedAt || null,
    current: { ...element.original, ...(override || {}) },
  };
}

async function saveOverride(elementId, payload) {
  await db.run(
    `INSERT INTO overrides (element_id, payload_json, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(element_id) DO UPDATE SET payload_json = excluded.payload_json, updated_at = excluded.updated_at`,
    [elementId, JSON.stringify(payload), Date.now()]
  );
}

async function deleteOverride(elementId) {
  await db.run('DELETE FROM overrides WHERE element_id = ?', [elementId]);
}

function normalizeOverridePayload(element, body) {
  const payload = {};
  payload.hide = Boolean(body.hide);
  payload.linkUrl = sanitizeUrl(body.linkUrl || '');
  payload.linkTarget = body.linkTarget === '_blank' ? '_blank' : '_self';
  if (element.type === 'text') {
    payload.text = sanitizeString(body.text, 20000);
  } else if (element.type === 'link') {
    if (element.editableText) payload.text = sanitizeString(body.text, 5000);
    payload.href = sanitizeUrl(body.href || '');
    payload.target = body.target === '_blank' ? '_blank' : '_self';
  } else if (element.type === 'image') {
    payload.src = sanitizeUrl(body.src || '');
    payload.alt = sanitizeString(body.alt, 1000);
    payload.title = sanitizeString(body.title, 1000);
  } else if (element.type === 'video') {
    payload.src = sanitizeUrl(body.src || '');
    payload.mimeType = sanitizeString(body.mimeType, 255);
    payload.poster = sanitizeUrl(body.poster || '');
    payload.autoplay = Boolean(body.autoplay);
    payload.controls = Boolean(body.controls);
    payload.muted = Boolean(body.muted);
    payload.loop = Boolean(body.loop);
  }
  return payload;
}

module.exports = {
  loadManifest, getManifest, getOverridesMap, mergeElement,
  saveOverride, deleteOverride, normalizeOverridePayload,
};
