'use strict';
/**
 * Markazlashgan konfiguratsiya + env validatsiya.
 * Production'da default parollar ishlatilishiga yo'l qo'ymaydi (secrets guard).
 */
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT_DIR = path.join(__dirname, '..');
const IS_PROD = process.env.NODE_ENV === 'production';

/** Env'da parol berilmasa — har ishga tushishda yangi, kuchli tasodifiy parol. */
function randomPassword() {
  return crypto.randomBytes(12).toString('base64url'); // ~16 belgi, ~96 bit
}

// Parol env'dan keldimi yoki avtomatik generatsiya qilindimi — shuni belgilaymiz.
// Production guard shu bayroqqa qarab ishlaydi (qattiq yozilgan default emas).
const STAFF_PASSWORD_FROM_ENV = Boolean(process.env.DEFAULT_STAFF_PASSWORD);
const EDITOR_PASSWORD_FROM_ENV = Boolean(process.env.DEFAULT_EDITOR_PASSWORD);

const config = {
  ROOT_DIR,
  IS_PROD,
  PORT: Number(process.env.PORT || 3000),

  PUBLIC_DIR: path.join(ROOT_DIR, 'public'),
  ADMIN_DIR: path.join(ROOT_DIR, 'admin-static'),
  DATA_DIR: path.join(ROOT_DIR, 'data'),
  UPLOADS_DIR: process.env.UPLOAD_DIR || path.join(ROOT_DIR, 'public', 'uploads'),
  MANIFEST_PATH: path.join(ROOT_DIR, 'public', 'cms-manifest.json'),

  // Baza: DATABASE_URL bo'lsa Postgres, aks holda SQLite (dev)
  DB_DRIVER: process.env.DATABASE_URL ? 'postgres' : 'sqlite',
  DATABASE_URL: process.env.DATABASE_URL || '',
  SQLITE_PATH: process.env.SQLITE_PATH || path.join(ROOT_DIR, 'data', 'app.db'),

  SESSION_TTL_MS: 1000 * 60 * 60 * 24 * 7,
  COOKIE_NAME: 'ku_cms_sid',
  CSRF_COOKIE: 'ku_csrf',
  CSRF_HEADER: 'x-csrf-token',

  MAX_UPLOAD_BYTES: Number(process.env.MAX_UPLOAD_BYTES || 50 * 1024 * 1024),
  MAX_JSON_BYTES: 1 * 1024 * 1024, // JSON body alohida kichik limit (DoS)

  DEFAULT_STAFF_EMAIL: (process.env.DEFAULT_STAFF_EMAIL || 'staff@kokandu.uz').toLowerCase(),
  DEFAULT_STAFF_PASSWORD: process.env.DEFAULT_STAFF_PASSWORD || randomPassword(),
  DEFAULT_EDITOR_EMAIL: (process.env.DEFAULT_EDITOR_EMAIL || 'admin@kokandu.uz').toLowerCase(),
  DEFAULT_EDITOR_PASSWORD: process.env.DEFAULT_EDITOR_PASSWORD || randomPassword(),
  // server.js shu bayroqlarga qarab dev'da generatsiya qilingan parolni ko'rsatadi.
  STAFF_PASSWORD_FROM_ENV,
  EDITOR_PASSWORD_FROM_ENV,

  LOGIN_MAX_ATTEMPTS: 8,
  LOGIN_WINDOW_MS: 15 * 60 * 1000,
  API_RATE_MAX: Number(process.env.API_RATE_MAX || 300), // har IP / daqiqa
  API_RATE_WINDOW_MS: 60 * 1000,

  ALLOWED_UPLOAD_TYPES: {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4',
    '.webm': 'video/webm', '.pdf': 'application/pdf',
  },
  ALLOWED_SETTINGS_KEYS: new Set([
    'stories_url', 'our_tutors_url', 'results_title', 'results_intro',
    'distinctions_title', 'interests_title', 'news_title',
    'gallery_title', 'gallery_intro', 'gallery_video_url',
    'castle_title', 'castle_intro', 'castle_phone', 'castle_email',
    'university_url',
  ]),
};

/**
 * Production secrets guard — default parol bilan ishga tushishni bloklaydi.
 * NODE_ENV=production BO'LMASA ham, DATABASE_URL ulangan bo'lsa (ya'ni real
 * deploy) guard ishlaydi — "NODE_ENV qo'yishni unutish" tuynugini yopadi.
 */
function assertProductionSecrets() {
  const deployLike = IS_PROD || Boolean(process.env.DATABASE_URL);
  if (!deployLike) return;
  const problems = [];
  if (!STAFF_PASSWORD_FROM_ENV) {
    problems.push('DEFAULT_STAFF_PASSWORD o‘rnatilmagan (env orqali bering)');
  }
  if (!EDITOR_PASSWORD_FROM_ENV) {
    problems.push('DEFAULT_EDITOR_PASSWORD o‘rnatilmagan (env orqali bering)');
  }
  // SQLite production'da faqat doimiy disk (Replit, VPS volume) bo'lsa ruxsat.
  // Railway kabi ephemeral muhitda ALLOW_SQLITE qo'yilmasa — bloklaymiz.
  if (config.DB_DRIVER === 'sqlite' && process.env.ALLOW_SQLITE !== 'true') {
    problems.push('DATABASE_URL o‘rnatilmagan. Ephemeral muhitda (Railway) PostgreSQL ulang; doimiy diskda (Replit/VPS) ALLOW_SQLITE=true qo‘ying.');
  }
  if (problems.length) {
    console.error('\n🔴 PRODUCTION XAVFSIZLIK: ishga tushirish to‘xtatildi:\n - ' + problems.join('\n - ') + '\n');
    process.exit(1);
  }
}

module.exports = { config, assertProductionSecrets };
