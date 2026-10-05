# PostgreSQL — endi native (migratsiya shart emas)

Avvalgi versiyada SQLite chaqiriqlarini qo'lda `pg`ga o'tkazish kerak edi.
**Endi kerak emas** — ilova baza abstraksiyasi (`src/db/`) orqali ikkala bazani
ham qo'llab-quvvatlaydi:

| Holat | Baza | Adapter |
|-------|------|---------|
| `DATABASE_URL` yo'q | SQLite (`data/app.db`) | `src/db/sqlite.js` |
| `DATABASE_URL` bor | PostgreSQL | `src/db/postgres.js` |

Kod bir xil `?` placeholder'lar bilan yozilgan; Postgres adapteri ularni
avtomatik `$1..$n`ga aylantiradi va `INSERT`larga `RETURNING id` qo'shadi.
Sxema `src/db/schema.js`dan har ikki dialekt uchun generatsiya qilinadi.

## Ishlatish
```bash
# Development (SQLite) — hech narsa kerak emas
npm start

# Production (PostgreSQL)
export DATABASE_URL=postgres://user:pass@host:5432/db
npm install     # pg o'rnatiladi (package.json'da dependency)
npm start       # sxema + seed avtomatik
```

To'liq deploy yo'riqnomasi: **`PRODUCTION.md`**.
