# Railway'ga joylash — Kokand University

Bu loyiha Railway uchun tayyor sozlangan. Quyidagi qadamlarni ketma-ket
bajarsangiz sayt ishlaydi. Taxminan 10 daqiqa vaqt oladi.

---

## 0. Nega PostgreSQL kerak

Railway konteyneri **vaqtinchalik** — har safar yangi versiya chiqarilganda
diskdagi hamma narsa o'chib, noldan yaratiladi. Ya'ni SQLite (`data/app.db`)
ishlatilsa, siz kiritgan barcha kontent va arizalar deployda yo'qoladi.

Shuning uchun loyiha `DATABASE_URL` berilmasa production rejimida **ataylab
ishga tushmaydi** — ma'lumot yo'qolishining oldini olish uchun. Bu xato emas.

---

## 1. Loyihani Railway'ga yuklash

Ikki yo'ldan biri:

**A) GitHub orqali (tavsiya etiladi)**
1. Bu papkani GitHub'da yangi repository qilib joylang.
2. Railway → **New Project** → **Deploy from GitHub repo** → shu repo'ni tanlang.

**B) Railway CLI orqali**
```
npm i -g @railway/cli
railway login
railway init
railway up
```

---

## 2. PostgreSQL qo'shish

Railway loyihangiz ichida: **+ New** → **Database** → **Add PostgreSQL**.

Baza yaratilgach, jadvallar **avtomatik** quriladi — qo'lda migratsiya
qilish shart emas. Birinchi ishga tushishda boshlang'ich kontent ham
o'zi to'ldiriladi.

---

## 3. O'zgaruvchilar (Variables)

Sayt servisini oching → **Variables** → quyidagilarni qo'shing:

| Nomi | Qiymati | Izoh |
|---|---|---|
| `NODE_ENV` | `production` | Majburiy |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Shu ko'rinishda yozing — Railway o'zi ulaydi |
| `DEFAULT_STAFF_PASSWORD` | *kuchli parol* | Majburiy — bosh admin paroli |
| `DEFAULT_EDITOR_PASSWORD` | *kuchli parol* | Majburiy — muharrir paroli |
| `DEFAULT_STAFF_EMAIL` | `staff@kokandu.uz` | Xohlasangiz o'zgartiring |
| `DEFAULT_EDITOR_EMAIL` | `admin@kokandu.uz` | Xohlasangiz o'zgartiring |
| `UPLOAD_DIR` | `/data/uploads` | 5-qadamdagi Volume uchun |
| `TRANSLATE_PROVIDER` | `google` | Avto-tarjima uchun (pastga qarang) — ixtiyoriy |
| `GOOGLE_TRANSLATE_KEY` | *API kaliti* | `TRANSLATE_PROVIDER=google` bo'lsa shart |

`PORT` ni **qo'lda yozmang** — Railway o'zi beradi.

### Avto-tarjima (o'zbekcha matn → EN/RU)

Admin panelda matn **o'zbek tilida** kiritilganda u avtomatik ravishda
ingliz va rus tillariga tarjima qilinadi; tashrifchi tilni almashtirsa,
tarjima qilingan matnni ko'radi. Buni `TRANSLATE_PROVIDER` boshqaradi:

| Qiymat | Ma'nosi |
|---|---|
| `google` | Google Cloud Translation v2 — ishonchli, pullik. `GOOGLE_TRANSLATE_KEY` shart. **Production uchun tavsiya etiladi.** |
| `gtx` | Bepul endpoint — kalit kerak emas, lekin ko'p so'rovda Google bloklashi mumkin. Kichik saytlar uchun. |
| `mock` | Faqat test uchun (`[EN] matn` ko'rinishida). |
| `none` | Avto-tarjima o'chiq. |

Hech narsa yozilmasa: `GOOGLE_TRANSLATE_KEY` bo'lsa `google`, aks holda `gtx`.

**Google kalitini olish:** Google Cloud Console → *Cloud Translation API* ni
yoqing → *Credentials* → *API key* yarating → uni `GOOGLE_TRANSLATE_KEY` ga
yozing. Kalitni faqat Translation API bilan cheklab qo'yish tavsiya etiladi.

Mavjud (eski) kontentni ham tarjima qilish uchun admin panelda
**Sozlamalar → "Barcha matnni qayta tarjima qil"** tugmasini bosing
(yoki `POST /api/admin/retranslate`). Yangi kiritilgan matn o'zi tarjima qilinadi.

`SITE_PROFILE` ham yozish shart emas: u `railway.json` ichida `university`
qilib qat'iy belgilangan.

### Parollar haqida

Default parol bilan production'da ishga tushirishga ruxsat berilmaydi —
server o'zini to'xtatadi va nima yetishmayotganini logda yozadi.
Parolni tasodifiy generatsiya qilish uchun:
```
node -e "console.log(require('crypto').randomBytes(18).toString('base64url'))"
```

---

## 4. Domen

**Settings** → **Networking** → **Generate Domain**. Bepul
`...up.railway.app` manzili beriladi. O'z domeningizni ulash uchun
shu yerda **Custom Domain** bo'limidan foydalaning.

---

## 5. Volume — yuklangan rasm/videolar uchun

Admin paneldan yuklaydigan fayllar ham vaqtinchalik diskda turadi va
deployda o'chadi. Buning oldini olish uchun:

1. Servis → **Settings** → **Volumes** → **Add Volume**
2. Mount path: `/data`
3. Variables'ga `UPLOAD_DIR=/data/uploads` (3-qadamda qo'shgan bo'lsangiz — tayyor)

Agar Volume qo'shmasangiz, server ishga tushganda logda ogohlantirish
chiqadi. Sayt baribir ishlaydi, lekin yuklangan fayllar saqlanmaydi.

---

## 6. Tekshirish

- `https://<domeningiz>/api/health` → `{"status":"healthy"}` qaytarishi kerak
- `https://<domeningiz>/` → sayt ochilishi kerak
- `https://<domeningiz>/admin` → admin panel

Birinchi kirishda 3-qadamda yozgan email/parol bilan kiring, so'ng
**Mening hisobim** bo'limidan parolni o'zgartiring.

---

## Nima allaqachon sozlangan

- `railway.json` — build (NIXPACKS), start buyrug'i, healthcheck `/api/health`,
  xatolikda avtomatik qayta ishga tushirish (5 marta)
- PostgreSQL adapteri va SSL (Railway self-signed sertifikati bilan ishlaydi)
- Jadvallar va boshlang'ich kontent — birinchi ishga tushishda avtomatik
- `TRUST_PROXY_HOPS` — Railway aniqlansa avtomatik `1` bo'ladi, shunda
  rate-limit har bir foydalanuvchi bo'yicha hisoblanadi (proxy IP bo'yicha emas)
- Cookie'lar production'da `Secure` + `HttpOnly` + `SameSite=Lax`
- `.gitignore` / `.dockerignore` — `node_modules`, `data/`, `.env` yuklanmaydi

## Tez-tez uchraydigan xatolar

**"DATABASE_URL o'rnatilmagan" deb to'xtab qoladi**
→ PostgreSQL qo'shilmagan yoki `DATABASE_URL` o'zgaruvchisi yozilmagan (2 va 3-qadam).

**"DEFAULT_STAFF_PASSWORD o'rnatilmagan"**
→ 3-qadamdagi parol o'zgaruvchilarini qo'shing.

**Deploy o'tdi, lekin healthcheck qizil**
→ Logni oching (Deployments → View Logs). Odatda yuqoridagi ikki sababdan biri.

**Yuklagan rasmlarim yo'qoldi**
→ 5-qadam (Volume) bajarilmagan.


**Eslatma:** bu alohida loyiha. Ikkinchi saytni ham Railway'ga
qo'ymoqchi bo'lsangiz — u uchun **alohida servis** va **alohida
PostgreSQL** yarating. Ikkalasi bir bazani baham ko'rmasligi kerak.

Universitet sayti ishga tushgach, Admin → **Kontent → cms-0398**
elementidan menyudagi "Shaharcha" havolasini shaharcha saytining
Railway domeniga o'zgartiring.
