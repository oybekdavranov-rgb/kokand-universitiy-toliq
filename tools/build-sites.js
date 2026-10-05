#!/usr/bin/env node
'use strict';
/**
 * IKKI ALOHIDA LOYIHA YIG'ISH
 *
 *   node tools/build-sites.js [chiqish-papkasi]
 *
 * Bitta kod bazasidan ikkita mustaqil ishlaydigan loyiha tayyorlaydi:
 *   1) kokand-university/     — SITE_PROFILE=university
 *   2) talabalar-shaharchasi/ — SITE_PROFILE=castle
 *
 * Har biri o'z bazasi, o'z admin paneli va faqat o'ziga kerakli fayllar bilan
 * keladi. `npm install` shart emas — SQLite Node 22 ichida.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'dist-sites'));

/** Ikkala loyihaga ham tushadigan server fayllari. */
const SHARED = [
  'server.js', 'package.json', 'package-lock.json', 'eslint.config.js',
  'Dockerfile', 'railway.json', 'src', 'admin-static', 'test', 'tools',
  'MIGRATION-POSTGRES.md', 'PRODUCTION.md', 'DEPLOY.md',
];

/** Ikkala saytga ham kerak bo'ladigan ochiq fayllar. */
const PUBLIC_SHARED = ['css', 'fonts', 'ku-ux.js', 'cms-runtime.js'];

const SITES = {
  // Birlashgan variant: ikkala sayt ham bitta serverda, bitta admin panelda
  'kokand-university-toliq': {
    profile: 'all',
    label: 'Kokand University + Shaharcha',
    port: 3000,
    publicFiles: [
      ...PUBLIC_SHARED,
      'index.html', 'galereya.html', 'stories.html', 'news.html',
      'shaharcha.html', 'shaharcha',
      'cms-manifest.json', 'i18n.js', 'site-features.js',
      'images', 'media', 'js',
    ],
  },
  'kokand-university': {
    profile: 'university',
    label: 'Kokand University',
    port: 3000,
    publicFiles: [
      ...PUBLIC_SHARED,
      'index.html', 'galereya.html', 'stories.html', 'news.html',
      'cms-manifest.json', 'i18n.js', 'site-features.js',
      'images', 'media', 'js',
    ],
  },
  'talabalar-shaharchasi': {
    profile: 'castle',
    label: 'Talabalar shaharchasi',
    port: 3100,
    publicFiles: [
      ...PUBLIC_SHARED,
      'shaharcha.html', 'shaharcha',
      // Faqat shu sayt ishlatadigan rasmlar (butun images/ papkasi shart emas)
      'images/cropped-favicon-32x32.png', 'images/logo2.png', 'images/logo2-white.png',
      // GSAP / Lenis / SplitType
      'js/vendor',
    ],
  },
};

/* ------------------------------ yordamchilar ------------------------------ */
function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) copy(path.join(src, entry), path.join(dest, entry));
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function du(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    total += entry.isDirectory() ? du(p) : fs.statSync(p).size;
  }
  return total;
}

/* -------------------------------- yig'ish -------------------------------- */
function build(name, cfg) {
  const dest = path.join(OUT, name);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });

  for (const item of SHARED) {
    const src = path.join(ROOT, item);
    if (fs.existsSync(src)) copy(src, path.join(dest, item));
  }
  for (const item of cfg.publicFiles) {
    const src = path.join(ROOT, 'public', item);
    if (fs.existsSync(src)) copy(src, path.join(dest, 'public', item));
    else console.warn(`  ! topilmadi: public/${item}`);
  }
  fs.mkdirSync(path.join(dest, 'public', 'uploads'), { recursive: true });
  fs.writeFileSync(path.join(dest, 'public', 'uploads', '.gitkeep'), '');
  fs.mkdirSync(path.join(dest, 'data'), { recursive: true });

  writeEnv(dest, cfg);
  writeLaunchers(dest, cfg);
  writeReadme(dest, name, cfg);
  patchPackageJson(dest, name, cfg);

  console.log(`✔ ${name}  (${(du(dest) / 1024 / 1024).toFixed(1)} MB)  SITE_PROFILE=${cfg.profile}  PORT=${cfg.port}`);
}

function writeEnv(dest, cfg) {
  const env = [
    '# Bu fayl saytni sozlaydi. O\'zgartirgandan keyin serverni qayta ishga tushiring.',
    `SITE_PROFILE=${cfg.profile}`,
    `PORT=${cfg.port}`,
    '',
    '# Birinchi kirish uchun login/parol. BIRINCHI KIRISHDAN KEYIN ALBATTA O\'ZGARTIRING!',
    'DEFAULT_STAFF_EMAIL=staff@kokandu.uz',
    'DEFAULT_STAFF_PASSWORD=',
    'DEFAULT_EDITOR_EMAIL=admin@kokandu.uz',
    'DEFAULT_EDITOR_PASSWORD=',
    '',
    '# Production (Railway/VPS) uchun:',
    '# NODE_ENV=production',
    '# SESSION_SECRET=<64 belgidan uzun tasodifiy satr>',
    '# DATABASE_URL=postgres://...',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dest, '.env.example'), env);
}

function writeLaunchers(dest, cfg) {
  const sh = [
    '#!/bin/sh',
    `# ${cfg.label} — ishga tushirish`,
    'cd "$(dirname "$0")"',
    `SITE_PROFILE=${cfg.profile} PORT=\${PORT:-${cfg.port}} node server.js`,
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dest, 'ishga-tushirish.sh'), sh, { mode: 0o755 });

  const bat = [
    '@echo off',
    `title ${cfg.label}`,
    'cd /d "%~dp0"',
    `set SITE_PROFILE=${cfg.profile}`,
    `if "%PORT%"=="" set PORT=${cfg.port}`,
    'node server.js',
    'pause',
    '',
  ].join('\r\n');
  fs.writeFileSync(path.join(dest, 'ISHGA-TUSHIRISH.bat'), bat);
}

function patchPackageJson(dest, name, cfg) {
  const file = path.join(dest, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  pkg.name = name;
  pkg.description = cfg.label;
  pkg.scripts = { ...pkg.scripts, start: `SITE_PROFILE=${cfg.profile} node server.js` };
  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
}

function writeReadme(dest, name, cfg) {
  const both = cfg.profile === 'all';
  const uni = cfg.profile === 'university';
  const lines = [
    `# ${cfg.label}`,
    '',
    ...(both
      ? ['Bu — BIRLASHGAN variant: universitet sayti ham, talabalar shaharchasi ham',
        'bitta serverda ishlaydi va bitta admin paneldan boshqariladi.', '']
      : ['Bu — mustaqil ishlaydigan alohida loyiha. Ikkinchi sayt bilan hech qanday',
        'umumiy bazasi yoki fayli yo\'q: alohida ishga tushadi, alohida admin paneli bor.', '']),
    '## Ishga tushirish',
    '',
    '1. Node.js 22 yoki undan yangisi o\'rnatilgan bo\'lsin (https://nodejs.org).',
    `2. Windows: \`ISHGA-TUSHIRISH.bat\` faylini ikki marta bosing.`,
    '   Mac/Linux: terminalda `./ishga-tushirish.sh`.',
    `3. Brauzerda oching: http://localhost:${cfg.port}`,
    `4. Admin panel: http://localhost:${cfg.port}/admin`,
    '',
    '`npm install` SHART EMAS — baza (SQLite) Node.js ichida keladi.',
    '',
    '## Login va parol',
    '',
    'Birinchi ishga tushirishda parol berilmagan bo\'lsa, konsolga tasodifiy parol',
    'chiqadi — uni saqlab qo\'ying. O\'zingiz belgilamoqchi bo\'lsangiz, `.env.example`',
    'faylini `.env` deb nusxalang va parollarni yozing.',
    '',
    '| Rol | Email | Nima qila oladi |',
    '|---|---|---|',
    '| staff | staff@kokandu.uz | Hammasi: sozlamalar, adminlar, rasm/video' + (uni ? '' : ', arizalar') + ' |',
    '| editor | admin@kokandu.uz | Faqat matn, rasm va havolalarni tahrirlash |',
    '',
    '## Ma\'lumotlar qayerda saqlanadi',
    '',
    'Barcha kontent `data/app.db` faylida (SQLite). **Zaxira nusxa olayotganda',
    '`data/` papkasini butunlay nusxalang** — `app.db-wal` va `app.db-shm` fayllari',
    'ham kerak.',
    '',
    'Railway/VPS\'ga qo\'yganda diskingiz doimiy bo\'lmasa ma\'lumot yo\'qoladi —',
    'PostgreSQL\'ga o\'tish yo\'riqnomasi: `MIGRATION-POSTGRES.md`.',
    '',
    '## Bu loyihada nima bor',
    '',
  ];

  if (both) {
    lines.push(
      '**Universitet sayti**',
      '',
      '- Bosh sahifa (`/`)',
      '- Galereya (`/galereya.html`) — binolar, ichki ko\'rinish, video fon',
      '- Hikoyalar (`/stories.html`) va Yangiliklar (`/news.html`)',
      '',
      '**Talabalar shaharchasi**',
      '',
      '- `/shaharcha.html` — yuqoridagi menyudagi "Shaharcha" tugmasi orqali ochiladi',
      '- Turar joylar, qulayliklar, 4 bosqichli jarayon',
      '- 11 ta ma\'lumot sahifasi — to\'liq ekranli modal oynalarda',
      '- **"Yotoq xonaga qo\'shilish"** ariza formasi',
      '',
      '**Admin panel** — hammasi bitta joyda: Kontent, Yangiliklar, Natijalar,',
      'Ajralib turish, Qiziqishlar, Hikoyalar, Galereya, Shaharcha, Shaharcha',
      'sahifalari, Yotoqxona arizalari, Dasturlar, Fayllar, Sozlamalar, Adminlar.',
      '',
      '### Arizalar',
      '',
      'Yuborilgan arizalar bazada saqlanadi va **Yotoqxona arizalari** bo\'limida',
      'ko\'rinadi. Ularni faqat `staff` roli ko\'ra oladi — `editor` uchun bu bo\'lim',
      'umuman ochilmaydi. CSV tugmasi orqali Excel uchun yuklab olish mumkin.',
      '',
      '### Keyinchalik ikkiga ajratmoqchi bo\'lsangiz',
      '',
      'Loyiha `SITE_PROFILE` bilan boshqariladi. Hozir u `all` — ikkalasi birga.',
      'Ikkita alohida saytga ajratish uchun: `node tools/build-sites.js` —',
      'natijada `dist-sites/` papkasida uchala variant tayyor bo\'ladi.',
    );
  } else if (uni) {
    lines.push(
      '- Bosh sahifa (`/`) — universitet sayti',
      '- Galereya (`/galereya.html`) — binolar, ichki ko\'rinish, video fon',
      '- Hikoyalar (`/stories.html`) va Yangiliklar (`/news.html`)',
      '- Admin bo\'limlari: Kontent, Yangiliklar, Natijalar, Ajralib turish,',
      '  Qiziqishlar, Hikoyalar, Galereya, Dasturlar, Fayllar, Sozlamalar, Adminlar',
      '',
      '### Muhim: "Shaharcha" menyu havolasi',
      '',
      'Yuqoridagi menyudagi **Shaharcha** havolasi hozir `/shaharcha.html` ga',
      'ishora qiladi — u sahifa endi ikkinchi loyihada. Admin panelda',
      '**Kontent → cms-0398** elementini ochib, havolani shaharcha saytining',
      'haqiqiy manziliga (masalan `https://shaharcha.kokanduni.uz`) o\'zgartiring.',
    );
  } else {
    lines.push(
      '- Bosh sahifa (`/`) — talabalar shaharchasi sayti',
      '- Turar joylar ro\'yxati, qulayliklar, 4 bosqichli jarayon',
      '- 11 ta ma\'lumot sahifasi — to\'liq ekranli modal oynalarda',
      '- **"Yotoq xonaga qo\'shilish"** ariza formasi',
      '- Admin bo\'limlari: Kontent, Shaharcha, Shaharcha sahifalari,',
      '  Yotoqxona arizalari (faqat staff), Fayllar, Sozlamalar, Adminlar',
      '',
      '### Arizalar',
      '',
      'Yuborilgan arizalar bazada saqlanadi va admin panelning',
      '**Yotoqxona arizalari** bo\'limida ko\'rinadi. Ularni faqat `staff` roli',
      'ko\'ra oladi — `editor` uchun bu bo\'lim umuman ochilmaydi.',
      'CSV tugmasi orqali Excel uchun yuklab olish mumkin.',
      '',
      '### Universitet saytiga havolalar',
      '',
      'Pastdagi "Universitet sayti / Galereya / Hikoyalar" havolalari',
      'Admin → **Sayt sozlamalari → Universitet sayti manzili** maydoniga',
      'yozilgan manzilga ketadi. Maydon bo\'sh bo\'lsa havolalar ko\'rinmaydi.',
    );
  }

  lines.push(
    '',
    '## Port',
    '',
    `Bu loyiha odatda **${cfg.port}**-portda ishlaydi.`,
    ...(both ? [] : ['Ikkala saytni bitta kompyuterda birga ishga tushirsangiz portlar to\'qnashmaydi.']),
    '',
  );
  fs.writeFileSync(path.join(dest, 'README.md'), lines.join('\n'));
}

/* --------------------------------- run ----------------------------------- */
fs.mkdirSync(OUT, { recursive: true });
console.log(`Chiqish papkasi: ${OUT}\n`);
for (const [name, cfg] of Object.entries(SITES)) build(name, cfg);
console.log('\nTayyor.');
