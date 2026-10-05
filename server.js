'use strict';
/**
 * Kokand University CMS — kirish nuqtasi (entry point).
 * Modullar: src/  (config, logger, db, auth, security, routes)
 * Baza: DATABASE_URL bo'lsa PostgreSQL, aks holda SQLite (dev).
 */
const { config, assertProductionSecrets } = require('./src/config');
const log = require('./src/logger');
const site = require('./src/site-profile');
const db = require('./src/db');
const { bootstrapUsers, seedContent, cleanupSessions } = require('./src/db/seed');
const { loadManifest } = require('./src/manifest');
const { createServer } = require('./src/app');

let server;

/**
 * Railway'da konteyner disk xotirasi vaqtinchalik: har deployda tozalanadi.
 * Baza uchun bu allaqachon bloklangan (assertProductionSecrets), lekin admin
 * panel orqali yuklangan rasm/video ham xuddi shunday yo'qoladi — buni
 * jimgina o'tkazib yubormaymiz.
 */
function warnEphemeralUploads() {
  const onRailway = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);
  if (!onRailway) return;
  if (config.UPLOADS_DIR.startsWith(config.ROOT_DIR)) {
    log.warn('DIQQAT: UPLOAD_DIR vaqtinchalik diskda — yuklangan fayllar har deployda o‘chadi.', {
      uploadDir: config.UPLOADS_DIR,
      yechim: 'Railway > Volume qo‘shing (mount: /data) va UPLOAD_DIR=/data/uploads o‘zgaruvchisini bering.',
    });
  }
}

async function start() {
  assertProductionSecrets();
  warnEphemeralUploads();
  await db.init();
  await cleanupSessions();
  const boot = await bootstrapUsers();
  await seedContent();
  loadManifest();

  server = createServer();
  server.listen(config.PORT, () => {
    log.info(`${site.profile.label} CMS ishga tushdi`, { port: config.PORT, env: config.IS_PROD ? 'production' : 'development', db: db.dialect, profile: site.profile.name });
    // Parollarni faqat ENDIGINA yaratilgan va env'dan kelmagan (ya'ni avtomatik
    // generatsiya qilingan) hollardagina ko'rsatamiz. Qayta ishga tushganda
    // adminlar allaqachon mavjud — eski parolni chop etib chalg'itmaymiz.
    if (boot.created) {
      if (!config.STAFF_PASSWORD_FROM_ENV) {
        log.info(`[birinchi ishga tushish] Staff:  ${config.DEFAULT_STAFF_EMAIL} / ${config.DEFAULT_STAFF_PASSWORD}  (avtomatik — saqlab qo‘ying)`);
      }
      if (!config.EDITOR_PASSWORD_FROM_ENV) {
        log.info(`[birinchi ishga tushish] Editor: ${config.DEFAULT_EDITOR_EMAIL} / ${config.DEFAULT_EDITOR_PASSWORD}  (avtomatik — saqlab qo‘ying)`);
      }
    }
  });
}

function shutdown(signal) {
  log.info(`${signal} qabul qilindi — to‘xtatilmoqda`);
  if (!server) process.exit(0);
  server.close(async () => {
    try { await db.close(); } catch { /* ignore */ }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => log.error('unhandledRejection', { err: String(err) }));

start().catch((err) => {
  log.error('Ishga tushirishda xato', { err: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = { start };
