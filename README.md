# Kokand University

Bu — mustaqil ishlaydigan alohida loyiha. Ikkinchi sayt bilan hech qanday
umumiy bazasi yoki fayli yo'q: alohida ishga tushadi, alohida admin paneli bor.

## Ishga tushirish

1. Node.js 22 yoki undan yangisi o'rnatilgan bo'lsin (https://nodejs.org).
2. Windows: `ISHGA-TUSHIRISH.bat` faylini ikki marta bosing.
   Mac/Linux: terminalda `./ishga-tushirish.sh`.
3. Brauzerda oching: http://localhost:3000
4. Admin panel: http://localhost:3000/admin

`npm install` SHART EMAS — baza (SQLite) Node.js ichida keladi.

## Login va parol

Birinchi ishga tushirishda parol berilmagan bo'lsa, konsolga tasodifiy parol
chiqadi — uni saqlab qo'ying. O'zingiz belgilamoqchi bo'lsangiz, `.env.example`
faylini `.env` deb nusxalang va parollarni yozing.

| Rol | Email | Nima qila oladi |
|---|---|---|
| staff | staff@kokandu.uz | Hammasi: sozlamalar, adminlar, rasm/video |
| editor | admin@kokandu.uz | Faqat matn, rasm va havolalarni tahrirlash |

## Ma'lumotlar qayerda saqlanadi

Barcha kontent `data/app.db` faylida (SQLite). **Zaxira nusxa olayotganda
`data/` papkasini butunlay nusxalang** — `app.db-wal` va `app.db-shm` fayllari
ham kerak.

Railway'da esa PostgreSQL ishlatiladi — bu loyiha shunga tayyor sozlangan.
Qadamma-qadam yo'riqnoma: **`RAILWAY.md`**.

## Bu loyihada nima bor

- Bosh sahifa (`/`) — universitet sayti
- Galereya (`/galereya.html`) — binolar, ichki ko'rinish, video fon
- Hikoyalar (`/stories.html`) va Yangiliklar (`/news.html`)
- Admin bo'limlari: Kontent, Yangiliklar, Natijalar, Ajralib turish,
  Qiziqishlar, Hikoyalar, Galereya, Dasturlar, Fayllar, Sozlamalar, Adminlar

### Muhim: "Shaharcha" menyu havolasi

Yuqoridagi menyudagi **Shaharcha** havolasi hozir `/shaharcha.html` ga
ishora qiladi — u sahifa endi ikkinchi loyihada. Admin panelda
**Kontent → cms-0398** elementini ochib, havolani shaharcha saytining
haqiqiy manziliga (masalan `https://shaharcha.kokanduni.uz`) o'zgartiring.

## Port

Bu loyiha odatda **3000**-portda ishlaydi.
Ikkala saytni bitta kompyuterda birga ishga tushirsangiz portlar to'qnashmaydi.
