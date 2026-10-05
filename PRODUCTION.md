# Production deploy — Railway / VPS

Ilova **kod o'zgarishisiz** ikki bazada ishlaydi:
- **SQLite** (dev) — `DATABASE_URL` yo'q bo'lsa avtomatik.
- **PostgreSQL** (production) — `DATABASE_URL` o'rnatilsa avtomatik (`src/db/postgres.js` adapteri).

Sxema ikkala dialekt uchun `src/db/schema.js`dan bir manbadan yaratiladi (idempotent).

---

## Arxitektura

```
Railway Project
├── Web (Node 22, server.js)  ──DATABASE_URL──▶  PostgreSQL (managed, auto-backup)
│         │                     ── Volume ──────▶  /data/uploads (yuklamalar)
│         └── Healthcheck: /api/health
└── Variables: NODE_ENV, DATABASE_URL, UPLOAD_DIR, DEFAULT_STAFF_*, DEFAULT_EDITOR_*
```

## Railway qadamlari

1. **GitHub repo'ni ulang** (New → Deploy from GitHub).
2. **New → Database → PostgreSQL** — `DATABASE_URL` avtomatik Variables'ga qo'shiladi.
3. **Volume** yarating → Mount path: `/data`.
4. **Variables** (Web service):
   ```
   NODE_ENV=production
   UPLOAD_DIR=/data/uploads
   DEFAULT_STAFF_EMAIL=staff@sizning-domen.uz
   DEFAULT_STAFF_PASSWORD=<kuchli-parol>
   DEFAULT_EDITOR_EMAIL=admin@sizning-domen.uz
   DEFAULT_EDITOR_PASSWORD=<kuchli-parol>
   ```
   > ⚠️ Default parollar o'rnatilmasa production'da server **ataylab ishga tushmaydi** (secrets guard — `src/config.js`).
5. **Healthcheck path**: `/api/health` (railway.json'da ham bor).
6. Deploy. Birinchi start: sxema migratsiya + standart kontent seed avtomatik.
7. Kirgach admin panel → **Mening hisobim**dan parolni yana almashtiring.

## Docker (VPS)

```bash
docker build -t kokand-cms .
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgres://user:pass@db:5432/kokand \
  -e DEFAULT_STAFF_PASSWORD=... -e DEFAULT_EDITOR_PASSWORD=... \
  -v /srv/kokand-uploads:/data/uploads \
  kokand-cms
```
Old tomonda **Nginx + HTTPS** (Let's Encrypt) tavsiya etiladi. HTTPS ortida `Secure` cookie va HSTS avtomatik yoqiladi (`NODE_ENV=production`).

## Lokal test (Postgres bilan)

```bash
docker run -d -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=kokand -p 5432:5432 postgres:16
export DATABASE_URL=postgres://postgres:dev@localhost:5432/kokand PGSSL=disable
npm install && npm start
```

## Zaxira (backup)
- **Baza:** Railway PostgreSQL avtomatik backup qiladi; VPS'da `pg_dump` cron.
- **Yuklamalar:** `/data/uploads` Volume/diskini zaxiralang (yoki S3/R2'ga o'ting).

## Masshtablash
- Postgres pool (`PG_POOL_MAX`) sozlanadi; bir nechta Web instance ishlatish mumkin.
- Ko'p-instansli deployда rate-limit'ni Redis'ga o'tkazing (`src/security/rateLimit.js`).
- Yuklamalarni S3/R2'ga o'tkazsangiz Web butunlay stateless bo'ladi.
