# 🚀 Deploy yo'riqnomasi — Railway va Replit

Loyiha ikki bazada ishlaydi: **SQLite** (oddiy) va **PostgreSQL** (production).
Quyida ikkala platforma uchun eng oson yo'l.

---

## 🟣 REPLIT (eng oson — 3 daqiqa)

Replit diski **doimiy**, shuning uchun SQLite bilan ham ma'lumot saqlanib qoladi.

### 1-yo'l: ZIP yuklash
1. [replit.com](https://replit.com) → **Create Repl** → yuqoridan **Import** → **Upload a folder / .zip**.
2. Men bergan **`kokand-university-cms.zip`** ni yuklang.
3. Repl ochilgach yuqoridagi katta yashil **▶ Run** tugmasini bosing.
4. O'ng tomonda Webview'da sayt ochiladi. Tayyor! ✅

> `.replit` fayli allaqachon sozlangan (`node server.js`, Node 22, `ALLOW_SQLITE=true`).
> `npm install` **shart emas** — SQLite ichki (`node:sqlite`).

### 2-yo'l: GitHub'dan import
1. Kodni o'z GitHub repongizga yuklang.
2. Replit → Create Repl → **Import from GitHub** → repo linkini kiriting → Run.

### Admin panel
- `https://<repl-nomi>.<username>.repl.co/admin/login`
- Staff: `staff@kokandu.uz` / `Staff2026!` · Editor: `admin@kokandu.uz` / `Admin2026!`
- Birinchi kirgach **Mening hisobim**dan parolni almashtiring.

### Replit'da xavfsiz production
1. Chapdagi **🔒 Secrets** (Tools → Secrets) ga kiring va qo'shing:
   - `NODE_ENV` = `production`
   - `DEFAULT_STAFF_PASSWORD` = `<kuchli-parol>`
   - `DEFAULT_EDITOR_PASSWORD` = `<kuchli-parol>`
2. (Ixtiyoriy, tavsiya) **Tools → PostgreSQL** bazasini qo'shing — `DATABASE_URL`
   avtomatik qo'shiladi va ilova Postgres'ga o'tadi (backup uchun ishonchliroq).
3. **Deploy** tugmasi orqali doimiy domenga chiqaring.
   > Eslatma: Replit "Autoscale/Cloud Run" deploy'i ephemeral — u yerda SQLite'ni
   > yo'qotmaslik uchun **PostgreSQL** ulang yoki **Reserved VM** deploy tanlang.

---

## 🚂 RAILWAY (production, PostgreSQL bilan)

Railway konteyneri **ephemeral** — shuning uchun **PostgreSQL + Volume** kerak.

### Qadamlar
1. Kodni GitHub repongizga yuklang (yoki Railway CLI: `npm i -g @railway/cli` → `railway up`).
2. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → repongizni tanlang.
3. **New → Database → PostgreSQL** qo'shing. `DATABASE_URL` avtomatik **Variables**ga tushadi.
4. **New → Volume** → Web service'ga ulang → **Mount path: `/data`**.
5. Web service → **Variables** ga qo'shing:
   ```
   NODE_ENV=production
   UPLOAD_DIR=/data/uploads
   DEFAULT_STAFF_EMAIL=staff@sizning-domen.uz
   DEFAULT_STAFF_PASSWORD=<kuchli-parol>
   DEFAULT_EDITOR_EMAIL=admin@sizning-domen.uz
   DEFAULT_EDITOR_PASSWORD=<kuchli-parol>
   ```
6. **Settings → Healthcheck Path**: `/api/health` (`railway.json`da ham bor).
7. **Deploy**. Birinchi ishga tushishda sxema + standart kontent avtomatik yaratiladi.
8. **Settings → Networking → Generate Domain** → saytingiz tayyor.
9. `<domen>/admin/login` → kiring → parolni almashtiring.

> ⚠️ Agar `DATABASE_URL` va parollar o'rnatilmasa, server **ataylab ishga tushmaydi**
> (secrets guard xatolikni logда ko'rsatadi). Bu — ma'lumot yo'qolishining oldini oladi.

### Railway CLI (GitHubsiz)
```bash
npm i -g @railway/cli
railway login
railway init
railway add --database postgres     # DATABASE_URL beradi
railway up                          # kodni yuklaydi
railway variables set NODE_ENV=production DEFAULT_STAFF_PASSWORD=... DEFAULT_EDITOR_PASSWORD=...
```

---

## ✅ Qaysi birini tanlash?

| | Replit | Railway |
|---|--------|---------|
| Osonlik | ⭐⭐⭐ (ZIP yuklab Run) | ⭐⭐ (Postgres sozlash) |
| Bepul | Bor (cheklangan) | $5 kredit/oy |
| Baza | SQLite (doimiy disk) | PostgreSQL (managed backup) |
| Real foydalanuvchi uchun | Reserved VM / Postgres bilan | ✅ Eng mos |

**Tavsiya:** tez sinash uchun **Replit**, doimiy "real users" sayti uchun **Railway + PostgreSQL**.
