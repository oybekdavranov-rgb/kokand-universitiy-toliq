'use strict';
const db = require('./index');
const { config } = require('../config');
const log = require('../logger');
const site = require('../site-profile');
const { hashPassword, newSalt } = require('../security/passwords');

async function createUser(email, password, role) {
  const now = Date.now();
  const salt = newSalt();
  await db.run(
    'INSERT INTO users (email, password_hash, salt, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [email.toLowerCase(), hashPassword(password, salt), salt, role, now, now]
  );
}

async function bootstrapUsers() {
  const { c } = (await db.get('SELECT COUNT(*) AS c FROM users')) || { c: 0 };
  if (Number(c) > 0) {
    const staff = await db.get("SELECT COUNT(*) AS c FROM users WHERE role = 'staff'");
    if (Number(staff.c) === 0) {
      await db.run('UPDATE users SET role = ? WHERE id = (SELECT MIN(id) FROM users)', ['staff']);
    }
    return { created: false };
  }
  await createUser(config.DEFAULT_STAFF_EMAIL, config.DEFAULT_STAFF_PASSWORD, 'staff');
  await createUser(config.DEFAULT_EDITOR_EMAIL, config.DEFAULT_EDITOR_PASSWORD, 'editor');
  log.info('Standart adminlar yaratildi (staff + editor)');
  return { created: true };
}

async function seedTable(table, cols, rows) {
  // Bu profilda jadval yaratilmagan bo'lsa — o'tkazib yuboramiz
  if (!site.has(table)) return;
  const { c } = (await db.get(`SELECT COUNT(*) AS c FROM ${table}`)) || { c: 0 };
  if (Number(c) > 0) return;
  const now = Date.now();
  const allCols = [...cols, 'created_at', 'updated_at'];
  const ph = allCols.map(() => '?').join(', ');
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const vals = [...cols.map((col) => (col === 'sort' ? i : r[col] ?? '')), now, now];
    await db.run(`INSERT INTO ${table} (${allCols.join(', ')}) VALUES (${ph})`, vals);
  }
}

async function seedContent() {
  await seedTable('news', ['title', 'date', 'image', 'excerpt', 'body', 'link', 'sort'], [
    { title: 'Umummilliy AI Hackathon Farg‘ona | 2-kun', date: '23-may 2026', image: 'images/copy-of-greenes4-1-e1707301347593-352x228.jpg', excerpt: 'Ishtirokchilar jamiyat va kelajak uchun muhim yo‘nalishlarda AI yechimlari ustida ishlashmoqda.', body: '🏫 2-kun har bir jamoa o‘z loyihalarini mentorlar va ekspertlarga taqdim etishga tayyorlanmoqda.\n\nHackathon davomida talabalar amaliy ko‘nikmalarni egallab, jamoaviy ishlash va innovatsion g‘oyalarni real mahsulotga aylantirishni o‘rganmoqda.', link: 'https://t.me/kuyoshlarittifoqi' },
    { title: 'Kokand University talabalari xalqaro tanlovda g‘olib bo‘ldi', date: '09-iyun 2026', image: 'images/homepage-4-1024x683.jpg', excerpt: 'Talabalar xalqaro ilmiy loyihalar tanlovida yuqori natijalarni qo‘lga kiritdi.', body: 'Kokand University talabalari xalqaro miqyosdagi ilmiy-amaliy loyihalar tanlovida ishtirok etib, bilim va ko‘nikmalarini namoyish qildi.\n\nBu g‘alaba universitetning sifatli kadrlar tayyorlashga qaratilgan siyosatining isbotidir.', link: '' },
    { title: 'Yangi o‘quv yili: qabul jarayoni boshlandi', date: '01-iyul 2026', image: 'images/homepage-3.jpg', excerpt: 'Yangi o‘quv yiliga qabul boshlandi. Yo‘nalishlar va imtiyozlar bilan tanishing.', body: 'Kokand University yangi o‘quv yiliga talabalar qabulini boshladi. Zamonaviy o‘quv dasturlari, amaliyotga yo‘naltirilgan ta’lim va xalqaro hamkorlik imkoniyatlari taklif etiladi.', link: 'https://qabul.kokanduni.uz/' },
    { title: 'Xalqaro hamkorlik: yangi shartnomalar imzolandi', date: '15-iyun 2026', image: 'images/homepage-8.jpg', excerpt: 'Universitet xorijiy oliy ta’lim muassasalari bilan hamkorlik shartnomalarini imzoladi.', body: 'Kokand University xorijiy universitetlar bilan ta’lim va ilmiy tadqiqot sohasidagi hamkorlikni kengaytirmoqda. Shartnomalar talabalar almashinuvi va qo‘shma dasturlarni nazarda tutadi.', link: '' },
  ]);

  await seedTable('achievements', ['name', 'subtitle', 'image', 'description', 'sort'], [
    { name: 'Muhammadali Abbosxonov', subtitle: 'Xalqaro IT olimpiadasi g‘olibi', image: 'images/angus.jpg', description: 'Dasturlash bo‘yicha xalqaro olimpiadada oltin medalni qo‘lga kiritdi.' },
    { name: 'Shahlo Mansurova', subtitle: 'Biznes marafon g‘olibi', image: 'images/rowena.JPG', description: 'Startap loyihasi bilan “Biznes Marafon” tanlovida birinchi o‘rinni egalladi.' },
    { name: 'Behruz Nosirov', subtitle: 'Ilmiy loyihalar tanlovi laureati', image: 'images/lamine.jpg', description: 'Ilmiy-tadqiqot loyihasi bilan respublika tanlovida faxrli o‘rinni egalladi.' },
  ]);

  await seedTable('distinctions', ['title', 'image', 'summary', 'body', 'sort'], [
    { title: 'Yangi boshlanish', image: 'images/homepage-1.jpg', summary: 'Zamonaviy ta’lim va amaliy tajribaning uyg‘unligi.', body: 'Kokand University har bir talaba uchun yangi boshlanish imkoniyatini yaratadi. Zamonaviy ta’lim amaliy tajriba bilan uyg‘unlashtiriladi: real ko‘nikmalar, texnologiya, xalqaro imkoniyatlar va shaxsiy rivojlanish.' },
    { title: 'Amaliyotga yo‘naltirilgan ta’lim', image: 'images/homepage-3.jpg', summary: 'Nazariya va amaliyot birligida bilim.', body: 'Ta’lim jarayoni nazariya va amaliyotni uyg‘unlashtirgan. Talabalar bilimlarini loyihalar va real vaziyatlarda qo‘llaydi, mehnat bozoriga tayyor bo‘ladi.' },
    { title: 'Individual yondashuv', image: 'images/homepage-4.jpg', summary: 'Har bir talaba — alohida e’tiborda.', body: 'Universitet har bir talabaning kuchli tomonlari, maqsadlari va shaxsiy rivojlanishiga e’tibor beradi. Bu samarali o‘qish va ishonch hosil qilishga yordam beradi.' },
    { title: 'Chegarasiz ta’lim', image: 'images/homepage-9-1024x884.webp', summary: 'Onlayn va oflayn imkoniyatlar.', body: 'Talabalar joylashuvidan qat’i nazar istalgan vaqtda bilim olishi mumkin. Raqamli platformalar ta’limni qulay va moslashuvchan qiladi.' },
    { title: 'Hamkorlikda o‘qish', image: 'images/homepage-8.jpg', summary: 'Jamoaviy loyihalar va networking.', body: 'Jamoaviy loyihalar, klublar va tadbirlar orqali talabalar bir-biridan o‘rganadi va professional aloqalar o‘rnatadi.' },
    { title: 'Ekspert yo‘riqnomasi', image: 'images/greene-s-0058-704x456.jpg', summary: 'Tajribali ustozlar va mentorlar.', body: 'Soha mutaxassislari va tajribali o‘qituvchilar talabalarga yo‘l ko‘rsatadi. Mentorlik tizimi har bir talabaning o‘sishini qo‘llab-quvvatlaydi.' },
  ]);

  await seedTable('interests', ['title', 'image', 'body', 'link', 'sort'], [
    { title: 'Yo‘nalishlar', image: 'images/lucia-navarrete-y3tr4-mn6es-unsplash-352x228.jpg', body: 'Kokand University turli ta’lim yo‘nalishlarini taklif etadi: axborot texnologiyalari, iqtisodiyot, biznes boshqaruvi, filologiya va boshqalar.', link: 'https://www.kokanduni.uz/uz' },
    { title: 'Bog‘lanish', image: 'images/aptitude-test-2-352x228.jpg', body: 'Maslahatchilar yo‘nalish tanlash, qabul jarayoni va o‘quv sharoitlari bo‘yicha to‘liq ma’lumot beradi.', link: 'https://www.kokanduni.uz/uz/static/contacts' },
    { title: 'O‘quv muddatlari', image: 'images/spires_rgb_edited-1500x500-1-352x228.jpg', body: 'O‘quv yili semestrlarga bo‘lingan; dars jadvali, imtihon sessiyalari va ta’til muddatlari oldindan e’lon qilinadi.', link: 'https://www.kokanduni.uz/uz' },
  ]);

  await seedTable('stories', ['title', 'date', 'category', 'image', 'excerpt', 'body', 'link', 'sort'], [
    {
      title: 'Kokand University talabasi bo‘lish qanday tuyg‘u?',
      date: '18-iyul 2026', category: 'Talaba hayoti', image: 'images/stories/story-1.jpg',
      excerpt: 'Birinchi kursdan bitiruvgacha — universitetdagi hayot, do‘stlar, ustozlar va o‘zgarishlar haqida talaba hikoyasi.',
      body: 'Universitetga birinchi qadam qo‘yganimda hammasi yangi va biroz qo‘rqinchli tuyulgandi. Ammo bir necha hafta ichida Kokand University menga ikkinchi uyga aylandi.\n\nBu yerda faqat darslar emas, balki klublar, loyihalar va tadbirlar orqali o‘zimni topdim. Ustozlar har birimizni ismimiz bilan taniydi, savolga har doim vaqt topadi.\n\nEng muhimi — bu yerda men mustaqil fikrlashni, jamoada ishlashni va o‘z g‘oyalarimga ishonishni o‘rgandim.',
      link: '',
    },
    {
      title: 'Amaliyotdan ish o‘rniga: bitiruvchi tajribasi',
      date: '12-iyul 2026', category: 'Karyera', image: 'images/stories/story-2.jpg',
      excerpt: 'Universitetdagi amaliyot uni to‘g‘ridan-to‘g‘ri kompaniyaga olib keldi. Karyera yo‘lining boshlanishi haqida hikoya.',
      body: 'Uchinchi kursda amaliyotni jiddiy qabul qildim. Har bir vazifani real ish deb bajardim va bu bekorga ketmadi.\n\nAmaliyot tugagach, kompaniya menga ish taklif qildi. Universitetda olgan amaliy ko‘nikmalarim va mustaqil loyihalarim aynan shu paytda asqotdi.\n\nKokand University talabalarga real muhitda o‘rganish imkonini beradi — bu esa diplomdan ham qimmatroq.',
      link: '',
    },
    {
      title: 'Ilmiy loyiha: g‘oyadan natijagacha',
      date: '05-iyul 2026', category: 'Ilmiy tadqiqot', image: 'images/stories/story-3.jpg',
      excerpt: 'Bir guruh talaba oddiy g‘oyadan boshlab, respublika tanlovida taqdirlangan loyiha yaratdi.',
      body: 'Hammasi darsdan keyingi oddiy suhbatdan boshlandi. Biz jamiyat uchun foydali bo‘ladigan loyiha yaratishni xohladik.\n\nMentorimiz yordamida g‘oyani reja, keyin prototipga aylantirdik. Ko‘p tunlar ishladik, xatolardan o‘rgandik va tark etmadik.\n\nNatijada loyihamiz respublika tanlovida faxrli o‘rinni egalladi. Bu — jamoaviy mehnat va ustozlar qo‘llab-quvvatlashining samarasi.',
      link: '',
    },
    {
      title: 'Xalqaro almashinuv dasturida bir semestr',
      date: '28-iyun 2026', category: 'Xalqaro imkoniyatlar', image: 'images/stories/story-4.jpg',
      excerpt: 'Xorijiy universitetda o‘qish tajribasi dunyoqarashni qanday o‘zgartirdi — talaba o‘z tajribasini bo‘lishadi.',
      body: 'Xalqaro almashinuv dasturi menga boshqa madaniyat, boshqa ta’lim uslubi va yangi do‘stlar berdi.\n\nBoshqa mamlakatda o‘qib, o‘z bilimlarimning kuchli tomonlarini ko‘rdim va yangi ko‘nikmalarni egalladim. Til bilan bir qatorda mustaqillik va moslashuvchanlik o‘rgandim.\n\nKokand University’ning xalqaro hamkorligi tufayli bu imkoniyat menga ochildi.',
      link: '',
    },
    {
      title: 'Kichik guruhlarda o‘qishning afzalligi',
      date: '20-iyun 2026', category: 'Ta’lim', image: 'images/stories/story-5.jpg',
      excerpt: 'Nega kichik guruhlar samaraliroq? Talaba va ustoz nuqtai nazaridan hikoya.',
      body: 'Kichik guruhda har bir talaba e’tibordan chetda qolmaydi. Savol berish oson, muhokamalar jonli va o‘qish shaxsiylashtirilgan.\n\nUstoz har birimizning kuchli va zaif tomonlarimizni biladi, shuning uchun yordam aniq va o‘z vaqtida bo‘ladi.\n\nMen uchun bu — bilimni chuqur o‘zlashtirish va ishonch hosil qilishning eng yaxshi yo‘li bo‘ldi.',
      link: '',
    },
    {
      title: 'Talabalar klublari: darsdan tashqari hayot',
      date: '14-iyun 2026', category: 'Talaba hayoti', image: 'images/stories/story-6.jpg',
      excerpt: 'Debat klubidan IT jamoasigacha — universitetdagi klublar qanday qilib iste’dodni ochadi.',
      body: 'Universitetdagi hayot faqat auditoriya bilan cheklanmaydi. Klublar — bu yangi do‘stlar, yangi ko‘nikmalar va o‘zingni sinab ko‘rish maydoni.\n\nMen debat klubiga qo‘shildim va omma oldida gapirishdan qo‘rqmaydigan bo‘ldim. Do‘stlarim IT va tadbirkorlik klublarida o‘z loyihalarini boshladi.\n\nBu tajribalar kelajakdagi kasbimiz uchun juda muhim.',
      link: '',
    },
    {
      title: 'Ustoz va shogird: mentorlik hikoyasi',
      date: '07-iyun 2026', category: 'Ustozlar', image: 'images/stories/story-7.jpg',
      excerpt: 'Bir ustozning to‘g‘ri vaqtdagi maslahati talabaning yo‘nalishini butunlay o‘zgartirdi.',
      body: 'Men qaysi yo‘nalishni tanlashni bilmay qiynalgan paytimda ustozim menga vaqt ajratdi. U mening qiziqishlarimni tingladi va to‘g‘ri savollarni berdi.\n\nShu suhbatdan keyin o‘zimga to‘g‘ri kelgan sohani tanladim va endi har kuni sevgan ishim bilan shug‘ullanaman.\n\nKokand University’da mentorlik — rasmiyatchilik emas, balki chinakam g‘amxo‘rlik.',
      link: '',
    },
    {
      title: 'Grant sohibi bo‘lgan talabaning yo‘li',
      date: '30-may 2026', category: 'Yutuqlar', image: 'images/stories/story-8.jpg',
      excerpt: 'Mehnat va qat’iyat bilan grantga erishgan talaba o‘z tajribasi va maslahatlari bilan bo‘lishadi.',
      body: 'Grant menga osonlikcha kelmadi. Har kuni maqsad qo‘yib ishladim, darslarni qoldirmadim va qo‘shimcha loyihalarda qatnashdim.\n\nUniversitet iqtidorli talabalarni qo‘llab-quvvatlaydi — bu esa menga ko‘proq harakat qilish uchun kuch berdi.\n\nMaslahatim: maqsadingizni aniq belgilang, muntazam ishlang va imkoniyatlardan foydalaning.',
      link: '',
    },
    {
      title: 'Bitiruv kuni: yangi hayotning ostonasida',
      date: '22-may 2026', category: 'Bitiruvchilar', image: 'images/stories/story-9.jpg',
      excerpt: 'To‘rt yillik mehnat, do‘stlik va o‘sish — bitiruvchi universitetdagi eng yorqin damlarini eslaydi.',
      body: 'Bitiruv kunida orqaga qarab, universitetda o‘tgan yillar ko‘z oldimdan o‘tdi. Birinchi imtihonlar, tungacha davom etgan loyihalar, do‘stlar bilan kulgu.\n\nKokand University menga faqat diplom emas, balki hayotga tayyor shaxsni yasadi.\n\nEndi yangi bosqich boshlanadi, lekin bu yerda olgan bilim va do‘stlik hamisha men bilan qoladi.',
      link: '',
    },
    {
      title: 'Zamonaviy kutubxona va raqamli resurslar',
      date: '15-may 2026', category: 'Ta’lim', image: 'images/stories/story-10.jpg',
      excerpt: 'Universitet kutubxonasi va onlayn platformalari o‘qishni qanday qulay va samarali qiladi.',
      body: 'Zamonaviy kutubxona — bu shunchaki kitoblar javoni emas. Bu yerda raqamli bazalar, tinch o‘qish zonalari va guruh ishlash xonalari bor.\n\nOnlayn platformalar orqali dars materiallariga istalgan joydan kirish mumkin. Bu ayniqsa loyiha va imtihonlarga tayyorlanishda juda qulay.\n\nBilim manbalarining bunday qulayligi o‘qishni sifatli va mustaqil qiladi.',
      link: '',
    },
    {
      title: 'Talabamiz milliy miqyosda eng yuqori natijani qo‘lga kiritdi',
      date: '10-may 2026', category: 'Yutuqlar', image: 'images/stories/story-11.jpg',
      excerpt: 'Kokand University talabasi respublika ko‘lamidagi fan imtihonida eng yuqori ballni to‘pladi.',
      body: 'Universitetimiz talabasi milliy miqyosdagi fan imtihonida eng yuqori natijani qayd etib, mamlakatning eng iqtidorli yoshlari qatoridan joy oldi.\n\nBu muvaffaqiyat ortida qat’iyat, muntazam mehnat va tajribali ustozlarning qo‘llab-quvvatlashi turibdi. Talaba imtihonga oylar davomida rejali tayyorgarlik ko‘rdi.\n\nKokand University har bir talabaning iqtidorini rivojlantirish va yuqori natijalarga erishishi uchun barcha sharoitni yaratadi.',
      link: '',
    },
  ]);

  await seedTable('castle_pages', ['title', 'slug', 'icon', 'image', 'summary', 'body', 'faq', 'sort'], [
    {
      title: 'Joylashuvlar', slug: 'joylashuvlar', icon: 'map-pin', image: 'shaharcha/img/joylar.jpg',
      summary: 'Turar joylarimiz qayerda joylashgan va universitetgacha qancha vaqt ketadi.',
      body: 'Barcha turar joylarimiz Qo‘qon shahrida, universitetga qulay masofada joylashgan. Har bir joyni tanlashda uchta narsaga e’tibor berganmiz: universitetga yaqinlik, xavfsizlik va kundalik hayot qulayligi.\n\n**Kampus hududi** — universitet binolaridan 5 daqiqa piyoda. Eng ommabop variant: darsga kechikmaysiz, kutubxona va oshxona yonginangizda.\n\n**Shahar markazi** — 10–15 daqiqa. Do‘konlar, kafelar va transport shundoq yoningizda. Faol hayot tarzini yoqtiradiganlar uchun.\n\n**Tinch mahallalar** — 15–20 daqiqa. Tinchroq muhit, arzonroq narx, ko‘proq shaxsiy makon.\n\nHar bir joygacha jamoat transporti qatnaydi, velosiped yo‘llari mavjud.',
      faq: 'Universitetga qanday boraman? :: Piyoda (5–20 daqiqa), avtobus yoki velosipedda.\nTransport to‘xtash joyi bormi? :: Ha, ko‘pchilik joylarda velosiped va avtoturargoh bor.\nDo‘kon va oshxona yaqinmi? :: Barcha joylardan 5 daqiqalik masofada do‘konlar mavjud.\nKechqurun xavfsizmi? :: Hududlar yoritilgan va videokuzatuv ostida.',
    },
    {
      title: 'Bizning tariximiz', slug: 'tarix', icon: 'compass', image: 'shaharcha/img/tarix.jpg',
      summary: 'Bir binodan to‘liq talabalar shaharchasigacha — rivojlanish yo‘limiz.',
      body: 'Talabalar shaharchasi bir necha yil ichida kichik yotoqxonadan zamonaviy turar joy tizimiga aylandi.\n\n**Boshlanish** — birinchi yotoqxona binosi ochildi. Maqsad oddiy edi: boshqa shaharlardan kelgan talabalarga arzon va xavfsiz joy berish.\n\n**Kengayish** — talabalar soni ortgani sari yangi binolar qo‘shildi. Studiya xonalar va umumiy kvartiralar paydo bo‘ldi.\n\n**Zamonaviylashtirish** — barcha binolarda internet, o‘quv zonalari va dam olish maydonlari yaratildi. Xavfsizlik tizimi yangilandi.\n\n**Bugun** — 6 dan ortiq turar joy varianti, yuzlab talaba va doimiy rivojlanish. Har yili talabalar fikri asosida sharoitlarni yaxshilab boramiz.',
      faq: 'Necha yildan beri ishlaysiz? :: Bir necha yildan beri; har yili yangi imkoniyatlar qo‘shilmoqda.\nYangi binolar quriladimi? :: Ha, talabalar soni ortishi bilan kengaytirish rejalashtirilgan.\nTalabalar fikri hisobga olinadimi? :: Albatta — har semestr so‘rovnoma o‘tkaziladi.',
    },
    {
      title: 'Xalqaro talabalar', slug: 'xalqaro', icon: 'hands', image: 'shaharcha/img/xalqaro.jpg',
      summary: 'Xorijdan kelayotgan talabalar uchun to‘liq yordam va qulaylik.',
      body: 'Boshqa mamlakatdan kelish katta qadam. Biz bu jarayonni imkon qadar oson qilishga harakat qilamiz.\n\n**Kelishdan oldin** — onlayn ariza va bron. Joyni kelmasdan turib band qilasiz, fotosuratlar va xona tavsifi orqali tanlaysiz.\n\n**Kelganda** — aeroport yoki vokzaldan kutib olish tashkil etiladi. Xonaga joylashish, kalit topshirish va dastlabki ekskursiya.\n\n**Birinchi haftalar** — koordinator hujjatlar, ro‘yxatdan o‘tish, tibbiy sug‘urta va bank kartasi masalalarida yordam beradi.\n\n**Doimiy qo‘llab-quvvatlash** — til qiyinchiliklari, kundalik savollar yoki muammolar bo‘lsa — koordinator doim aloqada.\n\nKichik narsalar ham hisobga olinadi: choyshab va sochiq, oshxona jihozlari, birinchi kunlarda ovqatlanish maslahati.',
      faq: 'Kafil (garantor) kerakmi? :: Xalqaro talabalar uchun moslashuvchan shartlar mavjud.\nKelishdan oldin bron qila olamanmi? :: Ha, onlayn ariza orqali joy band qilinadi.\nAeroportdan kutib olasizmi? :: Ha, oldindan xabar bersangiz — tashkil etiladi.\nTil bilmasam-chi? :: Koordinatorlar yordam beradi; til kurslari ham mavjud.\nHujjatlarda yordam beriladimi? :: Ha, ro‘yxatdan o‘tish va sug‘urta bo‘yicha to‘liq yordam.',
    },
    {
      title: 'Savol-javob', slug: 'savol-javob', icon: 'speech', image: 'shaharcha/img/faq.jpg',
      summary: 'Bron, to‘lov, xona sharoitlari va qoidalar bo‘yicha eng ko‘p beriladigan savollar.',
      body: 'Quyida talabalar va ota-onalar eng ko‘p so‘raydigan savollarga javoblar to‘plangan. Javobini topa olmasangiz — biz bilan bog‘laning.',
      faq: 'Qanday bron qilaman? :: Turar joyni tanlaysiz, ariza qoldirasiz, koordinator siz bilan bog‘lanadi va shartnoma tuziladi.\nTo‘lov qanday amalga oshiriladi? :: Shartnomada ko‘rsatilgan tartibda; bo‘lib to‘lash imkoniyati bor.\nDepozit kerakmi? :: Ba’zi variantlarda kafolat to‘lovi bo‘ladi, u chiqishda qaytariladi.\nShartnomani bekor qilsam-chi? :: Bekor qilish shartlari shartnomada aniq yozilgan.\nXonada nima bor? :: Karavot, shkaf, ish stoli, stul va internet. Ba’zilarida shaxsiy hammom.\nChoyshab va idish-tovoq beriladimi? :: Ko‘p variantlarda asosiy jihozlar beriladi; aniqlashtirib olasiz.\nMehmon chaqirsam bo‘ladimi? :: Ha, belgilangan tartib va vaqt doirasida.\nKommunal to‘lovlar alohidami? :: Ko‘pchilik variantlarda narxga kiritilgan.\nInternet tezligi qanday? :: Onlayn dars va videoqo‘ng‘iroq uchun yetarli.\nKir yuvish qanday? :: Har bir binoda kir yuvish xonasi mavjud.\nUy hayvoni mumkinmi? :: Umumiy turar joylarda ruxsat etilmaydi.\nChekish mumkinmi? :: Binolar ichida chekish taqiqlanadi; maxsus joylar ajratilgan.',
    },
    {
      title: 'Xona turlari', slug: 'xona-turlari', icon: 'bed', image: 'shaharcha/img/xona.jpg',
      summary: 'Standart, komfort va studiya — har bir xona turi va uning jihozlari.',
      body: 'Turar joylarimizda uch xil asosiy xona turi mavjud. Har biri turli byudjet va ehtiyojga mo‘ljallangan.\n\n**Standart xona** — 2–3 kishilik, umumiy hammom va oshxona. Eng qulay narx. Har bir talabaga karavot, shkaf, ish stoli va stul beriladi.\n\n**Komfort xona** — 1–2 kishilik, xonada yuvinish joyi. Kengroq maydon, kattaroq deraza va shaxsiy javon.\n\n**Studiya** — bir kishilik mustaqil xona: shaxsiy hammom, mini-oshxona, ish zonasi va dam olish burchagi. Eng yuqori qulaylik.\n\nBarcha xonalarda: isitish, tez internet, yorug‘lik va tabiiy shamollatish. Xonani ko‘rish uchun oldindan tashrif buyurishingiz mumkin.',
      faq: 'Xonani oldin ko‘rsam bo‘ladimi? :: Ha, oldindan kelishilgan vaqtda ko‘rishga olib boramiz.\nXonani almashtirish mumkinmi? :: Bo‘sh joy bo‘lsa, semestr boshida imkoniyat bor.\nMebel qo‘shsam bo‘ladimi? :: Kichik shaxsiy narsalar mumkin; katta mebel uchun ruxsat kerak.\nXonani kim bilan bo‘lishaman? :: Imkon qadar bir yo‘nalish yoki kurs talabalari bilan.\nXonada muzlatgich bormi? :: Studiyalarda bor; boshqalarida umumiy oshxonada.',
    },
    {
      title: 'Bog‘lanish', slug: 'bogʻlanish', icon: 'phone', image: 'shaharcha/img/aloqa.jpg',
      summary: 'Telefon, email, manzil va ish vaqti — biz bilan qanday bog‘lanish mumkin.',
      body: 'Savollaringiz bo‘lsa yoki joy bron qilmoqchi bo‘lsangiz — bir necha yo‘l bilan bog‘lanishingiz mumkin.\n\n**Telefon** — ish kunlari eng tez javob. Koordinator darhol yordam beradi.\n\n**Email** — batafsil savollar va hujjatlar uchun qulay. Odatda bir ish kuni ichida javob beramiz.\n\n**Telegram** — tezkor savollar uchun. Rasm va hujjat yuborish oson.\n\n**Bevosita tashrif** — universitet qabulxonasiga kelib, turar joy bo‘yicha maslahat olishingiz mumkin. Oldindan xabar bersangiz, xonalarni ham ko‘rsatamiz.\n\nOta-onalar uchun ham alohida maslahat xizmati mavjud.',
      faq: 'Ish vaqti qanday? :: Dushanba–shanba, ish kunlari; aniq vaqt telefon orqali.\nDam olish kunlari javob berasizmi? :: Telegram orqali cheklangan tarzda.\nOta-onam qo‘ng‘iroq qilsa bo‘ladimi? :: Ha, albatta — ular uchun ham maslahat beramiz.\nXonani ko‘rishga qanday boraman? :: Oldindan vaqt belgilanadi, koordinator kutib oladi.',
    },
    {
      title: 'Do‘stingizni taklif qiling', slug: 'dost-taklif', icon: 'hands', image: 'shaharcha/img/dost.jpg',
      summary: 'Do‘stingiz ham joylashsa — ikkingiz uchun ham imtiyoz.',
      body: 'Do‘stingizni talabalar shaharchasiga taklif qilsangiz, ikkingiz ham imtiyozga ega bo‘lasiz.\n\n**Qanday ishlaydi:** do‘stingizga o‘z ismingizni ko‘rsatishni aytasiz. U shartnoma tuzgach, ikkingizga ham imtiyoz qo‘llanadi.\n\n**Nima olasiz:** to‘lovdan chegirma yoki qo‘shimcha xizmat (bu davrga qarab belgilanadi).\n\n**Nechta do‘st taklif qilish mumkin?** Cheklov yo‘q — har bir yangi joylashgan do‘st uchun imtiyoz beriladi.\n\nBu nafaqat tejamkorlik, balki yoningizda tanish odam bo‘lishi ham — moslashish ancha oson kechadi.',
      faq: 'Imtiyoz qancha? :: Davriy aksiyaga qarab; aniq shartlarni koordinatordan bilib olasiz.\nDo‘stim boshqa turar joy tanlasa-chi? :: Muhim emas — shaharchamizning istalgan variantida amal qiladi.\nQachon qo‘llanadi? :: Do‘stingiz shartnoma tuzib, joylashgandan so‘ng.\nO‘zim yangi talaba bo‘lsam ham mumkinmi? :: Ha, birgalikda ariza topshirsangiz ham amal qiladi.',
    },
    {
      title: 'Talaba portali', slug: 'portal', icon: 'lock', image: 'shaharcha/img/oquv.jpg',
      summary: 'To‘lov, xizmat so‘rovi va e’lonlar — hammasi bitta shaxsiy kabinetda.',
      body: 'Joylashgan talabalar uchun shaxsiy portal mavjud. U kundalik masalalarni onlayn hal qilish imkonini beradi.\n\n**To‘lovlar** — to‘lov tarixini ko‘rasiz, keyingi to‘lov sanasini bilasiz va onlayn to‘lash mumkin.\n\n**Xizmat so‘rovi** — biror narsa buzilsa (kran, chiroq, eshik) portal orqali so‘rov qoldirasiz, texnik xizmat keladi.\n\n**E’lonlar** — turar joy bo‘yicha muhim xabarlar, tadbirlar va eslatmalar shu yerda.\n\n**Hujjatlar** — shartnoma va boshqa hujjatlaringizning nusxasi doim qo‘l ostida.\n\nPortalga kirish ma’lumotlari joylashgandan so‘ng beriladi.',
      faq: 'Portalga qanday kiraman? :: Joylashgach login va parol beriladi.\nParolni yo‘qotsam-chi? :: Koordinatorga murojaat qilasiz, tiklanadi.\nTelefondan kirsam bo‘ladimi? :: Ha, portal mobil qurilmalarga moslashgan.\nXizmat so‘rovi qancha vaqtda bajariladi? :: Shoshilinch masalalar shu kuni; qolganlari navbat bilan.',
    },
    {
      title: 'Yozgi turar joy', slug: 'yozgi', icon: 'compass', image: 'shaharcha/img/yozgi.jpg',
      summary: 'Yozgi ta\u2019tilda qisqa muddatga joy \u2014 kurs, amaliyot yoki loyiha uchun.',
      body: 'Yoz oylarida qisqa muddatli turar joy taklif etamiz. Bu yozgi kurslarda o\u2018qiyotgan, amaliyot o\u2018tayotgan yoki loyiha ustida ishlayotgan talabalar uchun qulay.\n\n**Muddat** \u2014 bir haftadan uch oygacha. O\u2018zingizga kerakli kunlarni tanlaysiz.\n\n**Narx** \u2014 o\u2018quv yili davomidagi narxdan qulayroq, chunki muddat qisqa va talab kamroq.\n\n**Xonalar** \u2014 to\u2018liq jihozlangan: choyshab, sochiq, oshxona jihozlari. Faqat jomadoningiz bilan kelasiz.\n\n**Kimlar uchun** \u2014 yozgi kurs talabalari, amaliyotchilar, ilmiy loyiha ustida ishlayotganlar va boshqa shahardan kelgan mehmon talabalar.\n\nJoylar cheklangan, shuning uchun oldindan bron qilish tavsiya etiladi.',
      faq: 'Eng qisqa muddat qancha? :: Bir hafta.\nNarx qanday hisoblanadi? :: Haftalik yoki oylik \u2014 muddatga qarab.\nJihozlar beriladimi? :: Ha, choyshab, sochiq va oshxona jihozlari kiritilgan.\nYozda ham xavfsizlik ishlaydimi? :: Albatta, 24/7 nazorat yil bo\u2018yi ishlaydi.\nQachon bron qilish kerak? :: Iloji boricha erta \u2014 yozgi joylar tez tugaydi.',
    },
    {
      title: 'Xona jihozlari va narxlar', slug: 'jihozlar', icon: 'bed', image: 'shaharcha/img/jihoz.jpg',
      summary: 'Har bir xona darajasida nima bor va to\u2018lov qanday hisoblanadi.',
      body: 'Xonalar uchta darajaga bo\u2018linadi. Har bir darajada jihozlar to\u2018plami va narx farq qiladi.\n\n**Bronza** \u2014 asosiy to\u2018plam: karavot, matras, shkaf, ish stoli, stul, javon, isitish va internet. Hammom va oshxona umumiy.\n\n**Kumush** \u2014 bronza + xonada yuvinish joyi, kattaroq ish stoli, qo\u2018shimcha javonlar va yumshoq kursi.\n\n**Oltin** \u2014 to\u2018liq mustaqillik: shaxsiy hammom, mini-oshxona (muzlatgich, plita, mikroto\u2018lqinli), keng ish zonasi va dam olish burchagi.\n\n**To\u2018lov nima o\u2018z ichiga oladi:** xona narxi, kommunal xizmatlar (suv, elektr, isitish), internet, umumiy joylar tozalash va xavfsizlik.\n\n**Muddat tanlovi** \u2014 semestrlik yoki to\u2018liq o\u2018quv yili. Uzoq muddat tanlaganlarga qulayroq narx qo\u2018llanadi.',
      faq: 'Qaysi daraja eng ommabop? :: Kumush \u2014 narx va qulaylik muvozanati yaxshi.\nDarajani keyin oshirsam bo\u2018ladimi? :: Bo\u2018sh joy bo\u2018lsa, semestr boshida mumkin.\nKommunal to\u2018lov alohidami? :: Yo\u2018q, narxga kiritilgan.\nBo\u2018lib to\u2018lash mumkinmi? :: Ha, shartnomada belgilangan grafik bo\u2018yicha.\nUzoq muddatga chegirma bormi? :: Ha, to\u2018liq o\u2018quv yiliga shartnoma qulayroq.\nKafolat to\u2018lovi qaytariladimi? :: Ha, shartnoma tugagach, zarar bo\u2018lmasa to\u2018liq qaytariladi.',
    },
    {
      title: 'Blog va maslahatlar', slug: 'blog', icon: 'speech', image: 'shaharcha/img/blog.jpg',
      summary: 'Talabalik hayoti, tejamkorlik va moslashish bo‘yicha foydali maqolalar.',
      body: 'Blogimizda talabalar uchun amaliy maslahatlar to‘planadi — ko‘chib o‘tishdan imtihon davrigacha.\n\n**Ko‘chib o‘tish** — nima olib kelish kerak, nimani joyida sotib olish arzon, birinchi hafta rejasi.\n\n**Byudjet** — oylik xarajatlarni rejalashtirish, tejamkor xarid, o‘zi pishirishning foydasi.\n\n**Moslashish** — yangi shaharda do‘st topish, sog‘inchni engish, kun tartibini shakllantirish.\n\n**O‘qish va dam** — imtihonga tayyorlanish usullari, tanaffuslar ahamiyati, uyqu tartibi.\n\n**Xavfsizlik** — kundalik ehtiyot choralari, muhim raqamlar, favqulodda holatlarda nima qilish.\n\nYangi maqolalar muntazam qo‘shiladi.',
      faq: 'Maqolalar qanchalik tez yangilanadi? :: Muntazam — har oy yangi mavzular qo‘shiladi.\nO‘zim maqola yozsam bo‘ladimi? :: Ha, talabalar tajribasi juda qadrli — koordinatorga yozing.\nMavzu taklif qilsam bo‘ladimi? :: Albatta, qiziqtirgan mavzuni ayting.',
    },
  ]);

  await seedTable('residences', ['name', 'city', 'image', 'summary', 'description', 'amenities', 'price', 'link', 'sort'], [
    {
      name: 'Markaziy talabalar shaharchasi', city: 'Qo‘qon — markaz',
      image: 'shaharcha/img/tj-1.jpg', price: 'Oyiga — qulay narx',
      summary: 'Universitetga piyoda 5 daqiqa. Eng ommabop va qulay variant.',
      description: 'Markaziy talabalar shaharchasi universitetning asosiy binosidan atigi 5 daqiqalik masofada joylashgan. Bu yerda 2 va 3 kishilik xonalar, umumiy oshxonalar va tinch o‘quv zonalari mavjud.\n\nHar bir qavatda kir yuvish xonasi, dam olish burchagi va tez internet bor. Kirish kartalar orqali nazorat qilinadi, hudud 24/7 kuzatuv ostida.',
      amenities: 'Tez Wi-Fi\nUmumiy oshxona\nKir yuvish xonasi\nO‘quv zonasi\n24/7 xavfsizlik\nVelosiped turargohi',
      link: '',
    },
    {
      name: 'Studiya turar joy majmuasi', city: 'Qo‘qon — universitet yaqinida',
      image: 'shaharcha/img/tj-2.jpg', price: 'Premium daraja',
      summary: 'Mustaqil studiya xonalar: shaxsiy hammom va mini-oshxona.',
      description: 'Mustaqillikni qadrlaydigan talabalar uchun to‘liq jihozlangan studiya xonalar. Har bir studiyada shaxsiy hammom, mini-oshxona, keng ish stoli va katta deraza bor.\n\nMajmuada umumiy sport zali, kinozal va tom-terrassa mavjud. Bu — o‘qish va dam olish uchun ideal muvozanat.',
      amenities: 'Shaxsiy hammom\nMini-oshxona\nSport zali\nKinozal\nTom-terrassa\nTez Wi-Fi',
      link: '',
    },
    {
      name: 'Umumiy kvartiralar (shared flat)', city: 'Qo‘qon — shahar markazi',
      image: 'shaharcha/img/tj-3.jpg', price: 'Tejamkor variant',
      summary: '3–5 talaba uchun: shaxsiy yotoqxona + umumiy zal.',
      description: 'Har bir talabaga shaxsiy yotoqxona, umumiy oshxona va mehmonxona. Xarajatlar bo‘lishiladi, shuning uchun narx ancha qulay bo‘ladi.\n\nHamxonalar bilan birga yashash mustaqillikka o‘rgatadi va umrbod do‘stlik boshlanadigan joy bo‘ladi.',
      amenities: 'Shaxsiy yotoqxona\nUmumiy oshxona va zal\nKir yuvish mashinasi\nIsh stoli\nTez Wi-Fi\nAvtoturargoh',
      link: '',
    },
    {
      name: 'Xalqaro talabalar uyi', city: 'Qo‘qon — kampus hududi',
      image: 'shaharcha/img/tj-4.jpg', price: 'Xizmatlar narxga kiritilgan',
      summary: 'Xorijdan kelgan talabalar uchun to‘liq xizmatli turar joy.',
      description: 'Xalqaro talabalar uchun maxsus tashkil etilgan turar joy: kelishdan boshlab moslashishgacha to‘liq yordam.\n\nXonalar to‘liq jihozlangan, kommunal xizmatlar narxga kiritilgan. Doimiy koordinator hujjatlar, tibbiy sug‘urta va kundalik masalalarda yordam beradi.',
      amenities: 'To‘liq jihozlangan xona\nKommunal xizmatlar narxda\nKoordinator yordami\nUmumiy oshxona\nTez Wi-Fi\n24/7 xavfsizlik',
      link: '',
    },
    {
      name: 'Oilaviy mehmondorchilik', city: 'Qo‘qon — turli mahallalar',
      image: 'shaharcha/img/tj-5.jpg', price: 'Ovqat bilan yoki ovqatsiz',
      summary: 'Mahalliy oila bag‘rida: uy sharoiti va uy ovqati.',
      description: 'Tekshirilgan mahalliy oilalar bag‘rida yashash imkoniyati. Bu variant ayniqsa birinchi kurs va xorijlik talabalar uchun moslashishni osonlashtiradi.\n\nUy sharoiti, uy ovqati va kundalik jonli muloqot — til va madaniyatni tez o‘zlashtirishning eng yaxshi yo‘li.',
      amenities: 'Uy ovqati (ixtiyoriy)\nAlohida xona\nKir yuvish\nOilaviy muhit\nWi-Fi\nTekshirilgan oilalar',
      link: '',
    },
    {
      name: 'Qisqa muddatli turar joy', city: 'Qo‘qon — markaz',
      image: 'shaharcha/img/tj-6.jpg', price: 'Kunlik / haftalik',
      summary: 'Imtihon, kurs yoki qisqa tashrif uchun bir necha kun/hafta.',
      description: 'Qabul imtihonlari, qisqa kurslar yoki tashrif uchun kelgan talabalar va ota-onalar uchun qisqa muddatli joy.\n\nBron qilish oddiy, xonalar to‘liq jihozlangan, minimal muddat — bir necha kun.',
      amenities: 'Kunlik bron\nTo‘liq jihozlangan\nToza choyshab va sochiq\nWi-Fi\nMarkazda joylashuv\n24/7 qabul',
      link: '',
    },
  ]);

  await seedTable('gallery', ['title', 'category', 'image', 'description', 'video', 'sort'], [
    {
      title: 'Bosh oʻquv binosi', category: 'Binolar', image: 'images/gallery/bino-1.jpg', video: '',
      description: 'Kokand University bosh oʻquv binosi — universitetning yuragi. Bu yerda zamonaviy auditoriyalar, mʼaʼruza zallari va professor-oʻqituvchilar kafedralari joylashgan.\n\nBino arxitekturasi anʼanaviy va zamonaviy uslublarni uygʻunlashtirgan boʻlib, talabalar uchun qulay va ilhomlantiruvchi muhit yaratadi.',
    },
    {
      title: 'Markaziy hovli va maydon', category: 'Binolar', image: 'images/gallery/bino-2.jpg', video: '',
      description: 'Universitet markaziy hovlisi — talabalar tanaffus paytida dam oladigan, uchrashuvlar va tadbirlar oʻtkaziladigan joy.\n\nYashil maydon, oʻrindiqlar va yoʻlaklar bilan bezatilgan bu hudud kampus hayotining markazidir.',
    },
    {
      title: 'Zamonaviy fasad', category: 'Binolar', image: 'images/gallery/bino-3.jpg', video: '',
      description: 'Universitet binolarining tashqi koʻrinishi — zamonaviy mʼeʼmorchilik yechimi. Katta oynalar tabiy yorugʻlikni oʻtkazadi va energiya tejamkorligini tʼaʼminlaydi.',
    },
    {
      title: 'Maʼmuriy bino', category: 'Binolar', image: 'images/gallery/bino-4.jpg', video: '',
      description: 'Maʼmuriy bino — qabul komissiyasi, dekanat va boshqaruv boʻlimlari joylashgan bino. Talabalar bu yerda barcha hujjat va tashkiliy masalalar boʻyicha yordam oladi.',
    },
    {
      title: 'Kutubxona binosi', category: 'Binolar', image: 'images/gallery/bino-5.jpg', video: '',
      description: 'Zamonaviy kutubxona — minglab kitoblar, raqamli resurslar va tinch oʻqish zonalari. Talabalar bu yerda mustaqil ishlash va ilmiy izlanishlar olib borish imkoniyatiga ega.',
    },
    {
      title: 'Sport majmuasi', category: 'Binolar', image: 'images/gallery/bino-6.jpg', video: '',
      description: 'Universitet sport majmuasi — zamonaviy trenajyor zallari, oʻyin maydonchalari va sport toʻgaraklari. Talabalar salomatligi va faol hayot tarzi bu yerda qoʻllab-quvvatlanadi.',
    },
    {
      title: 'Talabalar turar joyi', category: 'Binolar', image: 'images/gallery/bino-7.jpg', video: '',
      description: 'Qulay va xavfsiz talabalar turar joyi. Har bir xonada zarur sharoitlar yaratilgan boʻlib, boshqa shaharlardan kelgan talabalar uchun ikkinchi uy vazifasini oʻtaydi.',
    },
    {
      title: 'Ilmiy-tadqiqot markazi', category: 'Binolar', image: 'images/gallery/bino-8.webp', video: '',
      description: 'Ilmiy-tadqiqot markazi — laboratoriyalar va innovatsion loyihalar makoni. Talabalar va olimlar bu yerda zamonaviy ilmiy izlanishlar olib boradi.',
    },
    {
      title: 'Konferensiya zali', category: 'Binolar', image: 'images/gallery/bino-9.webp', video: '',
      description: 'Katta konferensiya zali — ilmiy anjumanlar, seminarlar va tantanali tadbirlar oʻtkaziladigan zamonaviy zal. Yuqori sifatli akustika va texnik jihozlar bilan tʼaʼminlangan.',
    },
    {
      title: 'Kampusning umumiy koʻrinishi', category: 'Binolar', image: 'images/gallery/bino-10.jpg', video: '',
      description: 'Kokand University kampusi — barcha oʻquv, ilmiy va turar joy binolarini oʻz ichiga olgan yagona hudud. Yashil zonalar va zamonaviy infratuzilma bilan uygʻunlashgan.',
    },
    {
      title: 'Zamonaviy auditoriya', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-1.jpg', video: '',
      description: 'Auditoriyalar zamonaviy jihozlar — proyektorlar, interaktiv doskalar va qulay oʻrindiqlar bilan tʼaʼminlangan. Har bir dars samarali va qiziqarli oʻtishi uchun barcha sharoit yaratilgan.',
    },
    {
      title: 'Kutubxona ichki koʻrinishi', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-2.jpg', video: '',
      description: 'Kutubxona ichki qismi — keng va yorugʻ oʻqish zallari. Talabalar bu yerda kitoblar, jurnallar va elektron manbalardan foydalanib, bilim olishadi.',
    },
    {
      title: 'Kompyuter laboratoriyasi', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-3.png', video: '',
      description: 'Zamonaviy kompyuter laboratoriyasi — yuqori tezlikdagi internet va soʻnggi dasturiy tʼaʼminot bilan jihozlangan. IT yoʻnalishidagi talabalar amaliy koʻnikmalarni bu yerda egallaydi.',
    },
    {
      title: 'Amaliy mashgʻulot xonasi', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-4.jpg', video: '',
      description: 'Amaliy mashgʻulotlar va imtihonlar oʻtkaziladigan xona. Kichik guruhlarda ishlash uchun qulay muhit, bu yerda talabalar nazariyani amaliyot bilan bogʻlaydi.',
    },
    {
      title: 'Talabalar dam olish zonasi', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-5.jpg', video: '',
      description: 'Talabalar tanaffus paytida dam oladigan, doʻstlari bilan suhbatlashadigan qulay zona. Kampus hayotining ijtimoiy markazlaridan biri.',
    },
    {
      title: 'Guruhli ishlash maydoni', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-6.png', video: '',
      description: 'Loyihalar ustida jamoaviy ishlash uchun moʻljallangan maydon. Talabalar bu yerda gʻoyalarni muhokama qiladi, birgalikda taqdimotlar tayyorlaydi va bir-biridan oʻrganadi.',
    },
    {
      title: 'Universitet yotoqxonasi', category: 'Turar joy', image: 'images/turar-joy/tj-1.jpg', video: '',
      description: 'Universitet yotoqxonasi — eng qulay narxdagi va kampusga eng yaqin variant. Xonalar 2–4 kishilik boʻlib, har birida oʻquv joyi, shkaf va internet mavjud.\n\nUmumiy oshxona, kir yuvish xonasi va dam olish zonasi barcha talabalar ixtiyorida. 24/7 xavfsizlik nazorati ishlaydi.',
    },
    {
      title: 'Zamonaviy studiya xonalar', category: 'Turar joy', image: 'images/turar-joy/tj-2.jpg', video: '',
      description: 'Hamkor turar joy majmualarida mustaqil studiya xonalar taklif etiladi. Har bir studiyada shaxsiy hammom, mini-oshxona va ish stoli bor.\n\nMustaqillikni qadrlaydigan va tinch muhitda oʻqishni istagan talabalar uchun ideal variant.',
    },
    {
      title: 'Umumiy kvartira (shared flat)', category: 'Turar joy', image: 'images/turar-joy/tj-3.jpg', video: '',
      description: 'Bir necha talaba birgalikda yashaydigan kvartira: shaxsiy yotoqxona + umumiy oshxona va mehmonxona.\n\nBu variant hamxonalar bilan doʻstlashish, xarajatlarni boʻlishish va mustaqil hayotga oʻrganish imkonini beradi.',
    },
    {
      title: 'Umumiy dam olish zonasi', category: 'Turar joy', image: 'images/turar-joy/tj-4.jpg', video: '',
      description: 'Turar joy majmualarida talabalar uchun umumiy dam olish zonalari mavjud: yumshoq divanlar, televizor, stol oʻyinlari va kichik kutubxona.\n\nBu yerda talabalar tanaffus qiladi, doʻstlashadi va birgalikda tadbirlar oʻtkazadi.',
    },
    {
      title: 'Oilaviy mehmondorchilik', category: 'Turar joy', image: 'images/turar-joy/tj-5.jpg', video: '',
      description: 'Mahalliy oila bagʻrida yashash — uy sharoiti, uy ovqati va kundalik til muhiti. Ayniqsa birinchi kurs talabalari uchun moslashishni osonlashtiradi.\n\nBarcha oilalar universitet tomonidan tekshiriladi va tavsiya etiladi.',
    },
    {
      title: 'Zamonaviy o‘quv zonasi', category: 'Turar joy', image: 'images/gallery/tj-g7.jpg', video: '',
      description: 'Turar joy ichidagi maxsus o‘quv zonasi: keng stollar, yaxshi yorug‘lik va tinch muhit.\n\nImtihon davrida qo‘shimcha joylar ochiladi, shuning uchun har doim bo‘sh stol topiladi.',
    },
    {
      title: 'Umumiy dam olish xonasi', category: 'Turar joy', image: 'images/gallery/tj-g8.jpg', video: '',
      description: 'Talabalar birga vaqt o‘tkazadigan keng xona: yumshoq divanlar, televizor va stol o‘yinlari.\n\nBu yerda kino kechalari, bayramlar va norasmiy uchrashuvlar o‘tkaziladi.',
    },
    {
      title: 'Turar joy majmuasi tashqi ko‘rinishi', category: 'Turar joy', image: 'images/gallery/tj-g9.jpg', video: '',
      description: 'Turar joy majmuasining tashqi ko‘rinishi — zamonaviy meʼmorchilik va yashil hudud.\n\nBinolar atrofida yoritilgan yo‘laklar, velosiped turargohi va dam olish maydonchalari joylashgan.',
    },
    {
      title: 'Kechki kampus manzarasi', category: 'Turar joy', image: 'images/gallery/tj-g10.jpg', video: '',
      description: 'Kechki payt kampus va turar joy hududi — yoritilgan, xavfsiz va tinch.\n\nKech qaytsangiz ham yo‘llar yorug‘ va videokuzatuv ostida bo‘ladi.',
    },
    {
      title: 'Oʻquv va ish burchagi', category: 'Turar joy', image: 'images/turar-joy/tj-6.jpg', video: '',
      description: 'Har bir turar joyda tinch oʻqish uchun maxsus joy ajratilgan: yaxshi yorugʻlik, qulay stol va tez internet.\n\nImtihon davrida qoʻshimcha oʻquv xonalari ham ochiladi.',
    },
  ]);

  await seedTable('programmes', ['key', 'title', 'subtitle', 'image', 'intro', 'highlights', 'faq', 'link', 'sort'], [
    {
      key: 'bakalavr',
      title: 'Bakalavriat — to‘liq ta’lim dasturi',
      subtitle: 'Xalqaro standartlardagi 4 yillik bakalavriat',
      image: 'images/programmes/prog-bakalavr.jpg',
      intro: 'Kokand University bakalavriat dasturi zamonaviy o‘quv rejasi, amaliyotga yo‘naltirilgan ta’lim va individual yondashuvni birlashtiradi. Har bir talaba nazariy bilim bilan bir qatorda real loyihalarda ishlash tajribasini oladi va kelajakdagi kasbiga to‘liq tayyorlanadi.',
      highlights: 'Xalqaro ta’lim standartlariga muvofiq o‘quv reja\nHar bir talabaga biriktirilgan shaxsiy tyutor (mentor)\nAmaliyot va real loyihalar ustida ishlash\nZamonaviy laboratoriya va raqamli resurslar\nXorijiy universitetlar bilan almashinuv imkoniyati\nDiplom bilan birga amaliy ko‘nikmalar',
      faq: 'Qabul qanday tashkil etilgan? :: Qabul test va suhbat asosida o‘tkaziladi. Batafsil ma’lumot qabul komissiyasidan olinadi.\nGrant va imtiyozlar bormi? :: Ha, iqtidorli talabalar uchun grant va imtiyozli to‘lov shakllari mavjud.\nTa’lim tili qaysi? :: O‘zbek, rus va ingliz tillarida yo‘nalishlar mavjud.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'tezlashtirilgan',
      title: 'Tezlashtirilgan dastur',
      subtitle: 'Jadal sur’atda — qisqartirilgan muddatda bilim',
      image: 'images/programmes/prog-tezlashtirilgan.jpg',
      intro: 'Tezlashtirilgan dastur — vaqtini samarali rejalashtirmoqchi bo‘lgan, motivatsiyasi yuqori talabalar uchun. Intensiv o‘quv jadvali va kichik guruhlar orqali qisqaroq muddatda chuqur bilim va amaliy ko‘nikmalarni egallash imkonini beradi.',
      highlights: 'Intensiv va zich o‘quv jadvali\nKichik guruhlar — ko‘proq e’tibor\nAmaliyotga yo‘naltirilgan mashg‘ulotlar\nMoslashuvchan dars vaqtlari\nTez natijaga erishish imkoniyati',
      faq: 'Kimlar uchun mos? :: Motivatsiyasi yuqori, mustaqil o‘qishga tayyor talabalar uchun.\nMuddati qancha? :: Standart dasturga nisbatan qisqartirilgan muddatda tashkil etiladi.\nSifat pasaymaydimi? :: Yo‘q — hajmi bir xil, faqat jadvali intensivroq.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'qayta',
      title: 'Malaka oshirish va qayta tayyorlash',
      subtitle: 'Bilimingizni yangilang, natijangizni oshiring',
      image: 'images/programmes/prog-qayta.jpg',
      intro: 'Ushbu dastur allaqachon ta’lim olganlar yoki natijasini yaxshilamoqchi bo‘lganlar uchun mo‘ljallangan. Tajribali o‘qituvchilar rahbarligida zaif tomonlar aniqlanadi va maqsadli tayyorgarlik orqali yuqori natijaga erishiladi.',
      highlights: 'Individual tayyorgarlik rejasi\nZaif mavzular bo‘yicha maqsadli mashg‘ulotlar\nTajribali o‘qituvchilar va mentorlar\nSinov imtihonlari va tahlil\nMoslashuvchan jadval',
      faq: 'Kim qatnasha oladi? :: Natijasini yaxshilamoqchi yoki bilimini yangilamoqchi bo‘lgan har bir kishi.\nQancha davom etadi? :: Tayyorgarlik darajasiga qarab individual belgilanadi.\nSertifikat beriladimi? :: Ha, dasturni tugatganlarga tegishli hujjat beriladi.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'tayyorlov',
      title: 'Tayyorlov bo‘limi',
      subtitle: 'Universitetga ishonchli qadam',
      image: 'images/programmes/prog-tayyorlov.jpg',
      intro: 'Tayyorlov bo‘limi abituriyentlarni universitet ta’limiga tayyorlaydi: asosiy fanlar bo‘yicha bilimni mustahkamlaydi, akademik ko‘nikmalar va til tayyorgarligini beradi. Bu — kelajakdagi muvaffaqiyatli o‘qish uchun mustahkam poydevor.',
      highlights: 'Asosiy fanlar bo‘yicha chuqur tayyorgarlik\nAkademik yozish va prezentatsiya ko‘nikmalari\nChet tili (ingliz) tayyorgarligi\nUniversitet muhitiga moslashish\nQabul imtihonlariga yo‘naltirilgan mashg‘ulotlar',
      faq: 'Kimlar uchun? :: Universitetga kirishga tayyorlanayotgan abituriyentlar uchun.\nQaysi fanlar o‘qitiladi? :: Matematika, ingliz tili, ona tili va tanlagan yo‘nalish fanlari.\nQabul talabi bormi? :: Kirish suhbati asosida guruhlar shakllantiriladi.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'gcse-qayta',
      title: 'Qayta topshirish dasturi (Retake)',
      subtitle: 'Ikkinchi imkoniyat — yuqoriroq natija',
      image: 'images/programmes/prog-gcse-qayta.jpg',
      intro: 'Qayta topshirish dasturi natijangizdan qoniqmagan yoki maqsadli ballga yetmagan talabalar uchun. Biz avval nima kamchilik bo‘lganini tahlil qilamiz, so‘ng aniq va real reja tuzamiz.\n\nKichik guruhlar va shaxsiy mentor yordamida qisqa muddatda sezilarli o‘sishga erishiladi.',
      highlights: 'Boshlang‘ich daraja tahlili va individual reja\nZaif mavzularga maqsadli mashg‘ulotlar\nMuntazam sinov imtihonlari va tahlil\nKichik guruhlar — ko‘proq e’tibor\nShaxsiy mentor qo‘llab-quvvatlashi\nImtihon texnikasi va vaqtni boshqarish\nUniversitetga ariza bo‘yicha maslahat',
      faq: 'Bu dastur menga mosmi? :: Agar natijangizni oshirmoqchi bo‘lsangiz va ishlashga tayyor bo‘lsangiz — ha.\nQancha davom etadi? :: Odatda bir semestr; tayyorgarlik darajasiga qarab qisqaroq ham bo‘lishi mumkin.\nQancha ball oshirish mumkin? :: Bu mehnatga bog‘liq, lekin ko‘p talabalar bir-ikki daraja o‘sadi.\nTo‘lov qanday? :: Dastur muddati va fanlar soniga qarab; bo‘lib to‘lash mumkin.\nQanday boshlayman? :: Maslahat uchun ariza qoldirasiz, so‘ng dastlabki suhbat bo‘ladi.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'takrorlash',
      title: 'Imtihonga tayyorlov (takrorlash) kurslari',
      subtitle: 'Imtihon oldidan bilimni mustahkamlang',
      image: 'images/programmes/prog-takrorlash.jpg',
      intro: 'Takrorlash kurslari imtihonlardan oldin bilimni tizimlashtirish va mustahkamlash uchun. Intensiv mashg‘ulotlar, sinov testlari va ekspert maslahatlari orqali talabalar imtihonga ishonch bilan tayyorlanadi.',
      highlights: 'Intensiv takrorlash mashg‘ulotlari\nMavzular bo‘yicha tizimli tahlil\nSinov imtihonlari va natija tahlili\nImtihon strategiyasi va vaqtni boshqarish\nKichik guruhlarda ishlash',
      faq: 'Qachon boshlanadi? :: Imtihon mavsumidan oldin maxsus jadval bo‘yicha.\nKimlar qatnasha oladi? :: Imtihonga tayyorlanayotgan barcha talabalar.\nQancha davom etadi? :: Qisqa muddatli intensiv format.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'gap-yil',
      title: 'Gap Year — maqsadli oraliq yil',
      subtitle: 'Bir yilni kelajagingiz uchun sarmoyaga aylantiring',
      image: 'images/programmes/prog-gapyear.jpg',
      intro: 'Gap Year dasturi talabalarga o‘qish oralig‘idagi bir yilni maqsadli — til o‘rganish, amaliyot, loyihalar va shaxsiy rivojlanish uchun samarali sarflash imkonini beradi. Bu — universitet yoki karyeraga yanada tayyor holda qadam qo‘yish.',
      highlights: 'Chet tilini chuqur o‘rganish\nAmaliyot va volontyorlik imkoniyatlari\nShaxsiy loyiha ustida ishlash\nKaryera yo‘nalishini aniqlash\nMentor qo‘llab-quvvatlashi',
      faq: 'Kimlar uchun mos? :: O‘qish oralig‘ida vaqtini foydali sarflamoqchi bo‘lganlar uchun.\nDavomiyligi qancha? :: Odatda bir o‘quv yili.\nKeyin nima bo‘ladi? :: Talaba universitet yoki kasbiy yo‘lga tayyor holda qaytadi.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'shaxsiy',
      title: 'Individual repetitorlik (Tuition)',
      subtitle: 'Bir ustoz — bir talaba, faqat siz uchun',
      image: 'images/programmes/prog-shaxsiy.jpg',
      intro: 'Individual repetitorlik — bu sizning ehtiyojingizga to‘liq moslashtirilgan ta’lim. Bir ustoz faqat siz bilan ishlaydi: zaif mavzularingizni aniqlaydi, shaxsiy reja tuzadi va har bir darsda natijangizni kuzatib boradi.\n\nDarslar universitetda yoki onlayn tarzda, sizga qulay vaqtda o‘tkaziladi.',
      highlights: 'Baholaringizni sezilarli oshirish\nIstalgan fan bo‘yicha dars\nUniversitetga kirishga tayyorgarlik\nIstalgan joydan onlayn qatnashish\nTekshirilgan va tajribali ustozlar\nQo‘llab-quvvatlovchi, bosimsiz muhit\nMoslashuvchan jadval\nHar bir darsdan keyin fikr-mulohaza',
      faq: 'Qaysi fanlar bo‘yicha dars bor? :: Deyarli barcha maktab va universitet fanlari bo‘yicha ustoz topiladi.\nDarslar qayerda o‘tadi? :: Universitetda yoki onlayn — o‘zingiz tanlaysiz.\nBir dars qancha davom etadi? :: Odatda 60–90 daqiqa; jadval siz bilan kelishiladi.\nUstozni almashtira olamanmi? :: Ha, mos kelmasa boshqa ustoz taklif qilinadi.\nNarxi qancha? :: Fan va darslar soniga bog‘liq — maslahatchidan bilib olasiz.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'qanday-ariza',
      title: 'Qanday ariza topshirish',
      subtitle: 'Qabul jarayoni — bosqichma-bosqich',
      image: 'images/programmes/prog-ariza.jpg',
      intro: 'Kokand Universityga hujjat topshirish oddiy va tushunarli. Quyidagi bosqichlar orqali arizangizni topshirasiz va qabul komissiyasi siz bilan bog‘lanadi. Har bir bosqichda maslahatchilar yordam beradi.',
      highlights: 'Onlayn ariza to‘ldirish\nKerakli hujjatlarni yuklash\nKirish testi yoki suhbat\nNatijani kutish va tasdiqlash\nShartnoma va ro‘yxatdan o‘tish',
      faq: 'Qanday hujjatlar kerak? :: Pasport, ma’lumot to‘g‘risidagi hujjat va rasm. To‘liq ro‘yxat qabul sahifasida.\nQachon topshirish mumkin? :: Qabul mavsumi davomida. Muddatlar rasmiy saytda e’lon qilinadi.\nOnlayn topshirish bormi? :: Ha, arizani onlayn topshirish mumkin.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'kochirish',
      title: 'Boshqa muassasadan o‘tish (transfer)',
      subtitle: 'O‘qishingizni Kokand Universityda davom ettiring',
      image: 'images/programmes/prog-kochirish.jpg',
      intro: 'Boshqa oliy ta’lim muassasasida o‘qiyotgan talabalar Kokand Universityga o‘tish (transfer) imkoniyatiga ega. Kreditlar tan olinadi va o‘qish uzluksiz davom etadi. Maslahatchilar jarayonni to‘liq hamrohlik qiladi.',
      highlights: 'Oldingi kreditlarni tan olish\nMos kursga joylashtirish\nHujjatlarni rasmiylashtirishda yordam\nUzluksiz o‘quv jarayoni\nIndividual maslahat',
      faq: 'Kreditlarim tan olinadimi? :: Ha, mos fanlar bo‘yicha kreditlar tan olinadi.\nQaysi kursga o‘taman? :: Oldingi o‘qish natijalariga qarab belgilanadi.\nJarayon qancha davom etadi? :: Hujjatlar to‘liq bo‘lsa, qisqa muddatda hal qilinadi.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'tolov',
      title: 'To‘lov va narxlar',
      subtitle: 'Shaffof to‘lov shartlari',
      image: 'images/programmes/prog-tolov.jpg',
      intro: 'Kokand University o‘qish to‘lovi shaffof va moslashuvchan. Turli yo‘nalishlar bo‘yicha to‘lov miqdori, bo‘lib-bo‘lib to‘lash va imtiyozli shartlar mavjud. Aniq narxlar qabul komissiyasidan olinadi.',
      highlights: 'Yo‘nalishlar bo‘yicha aniq narxlar\nBo‘lib-bo‘lib to‘lash imkoniyati\nGrant va chegirmalar\nOnlayn to‘lov tizimi\nMoliyaviy maslahat',
      faq: 'To‘lovni bo‘lib to‘lasa bo‘ladimi? :: Ha, bo‘lib-bo‘lib to‘lash shartlari mavjud.\nChegirmalar bormi? :: Iqtidorli talabalar uchun grant va chegirmalar mavjud.\nNarxlarni qayerdan bilaman? :: Qabul komissiyasi yoki rasmiy sayt orqali.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'grant',
      title: 'Grant va stipendiyalar',
      subtitle: 'Iqtidor va mehnat qadrlanadi',
      image: 'images/programmes/prog-grant.jpg',
      intro: 'Kokand University iqtidorli va faol talabalar uchun grant va stipendiyalar taqdim etadi. Akademik yutuqlar, ijtimoiy faollik va tanlovdagi g‘alabalar imtiyozli ta’lim imkoniyatini beradi.',
      highlights: 'Akademik yutuqlar uchun grant\nTanlov va olimpiada g‘oliblariga imtiyoz\nIjtimoiy faollik uchun stipendiya\nQisman va to‘liq chegirmalar\nHar yili qayta ko‘rib chiqiladi',
      faq: 'Kim grant ola oladi? :: Yuqori natija va faollik ko‘rsatgan talabalar.\nGrant qanday beriladi? :: Ariza va natijalar asosida komissiya qaror qiladi.\nHar yili yangilanadimi? :: Ha, natijaga qarab qayta ko‘rib chiqiladi.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'imtihonlar',
      title: 'Imtihonlar va testlar',
      subtitle: 'Rasmiy imtihon markazi — shaffof baholash',
      image: 'images/programmes/prog-imtihon.jpg',
      intro: 'Universitet rasmiy imtihon markazi sifatida ishlaydi: qabul testlari, oraliq va yakuniy imtihonlar, shuningdek sinov (trial) imtihonlari shu yerda o‘tkaziladi.\n\nButun jarayon — arizadan natijagacha — shaffof, nazorat ostida va belgilangan qoidalar asosida amalga oshiriladi.',
      highlights: 'Rasmiy imtihon markazi va nazorat\nQabul, oraliq va yakuniy imtihonlar\nSinov (trial) imtihonlari — real sharoitda mashq\nFan amaliyotlari va laboratoriya sinovlari\nImtihon markazi bilan oldindan tanishtirish\nOnlayn kuzatuv (proctoring) xizmati\nNatijalar e’lon qilinadigan aniq sanalar\nApellyatsiya va qayta ko‘rib chiqish tartibi',
      faq: 'Imtihonga qanday ariza topshiraman? :: Ariza formasi to‘ldiriladi va belgilangan muddatda topshiriladi.\nSinov imtihonlari bormi? :: Ha, real sharoitga o‘xshash trial imtihonlar o‘tkaziladi.\nImtihon markazini oldindan ko‘rsam bo‘ladimi? :: Ha, tanishtiruv tashkil etiladi — bu hayajonni kamaytiradi.\nNatijalar qachon e’lon qilinadi? :: Har bir sessiya uchun aniq sana oldindan e’lon qilinadi.\nNatijaga rozi bo‘lmasam? :: Apellyatsiya va qayta ko‘rib chiqish tartibi mavjud.\nOnlayn imtihon topshirish mumkinmi? :: Ayrim imtihonlar uchun kuzatuv (proctoring) bilan mumkin.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'imtihon-tolov',
      title: 'Imtihon to‘lovi va ariza',
      subtitle: 'Ariza va to‘lov tartibi',
      image: 'images/programmes/prog-imtihon-tolov.jpg',
      intro: 'Ba’zi sertifikatlangan imtihonlar uchun ariza va to‘lov talab qilinadi. Bu yerda ariza berish tartibi, to‘lov miqdori va muddatlari bilan tanishasiz. Barcha jarayon onlayn amalga oshiriladi.',
      highlights: 'Onlayn ariza va to‘lov\nAniq to‘lov miqdorlari\nMuddatlar oldindan e’lon qilinadi\nTasdiqlash va chek olish\nMaslahat xizmati',
      faq: 'Qanday to‘lanadi? :: Onlayn to‘lov tizimi orqali.\nMuddati qachon? :: Har imtihon uchun alohida e’lon qilinadi.\nAriza qanday beriladi? :: Shaxsiy kabinet orqali onlayn.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'muddatlar',
      title: 'Ro‘yxatdan o‘tish muddatlari',
      subtitle: 'Muhim sanalarni o‘tkazib yubormang',
      image: 'images/programmes/prog-muddatlar.jpg',
      intro: 'Imtihonlarga ro‘yxatdan o‘tishning aniq muddatlari mavjud. Ushbu bo‘limda muhim sanalar — ariza boshlanishi, yakuni va imtihon kunlari — jamlangan. Muddatlarni kuzatib boring va o‘z vaqtida ro‘yxatdan o‘ting.',
      highlights: 'Ariza boshlanish va yakun sanalari\nImtihon kunlari jadvali\nKech ro‘yxatdan o‘tish shartlari\nEslatma va bildirishnomalar\nRasmiy taqvim',
      faq: 'Muddatlarni qayerdan bilaman? :: Rasmiy sayt va shaxsiy kabinet orqali.\nKech qolsam-chi? :: Ba’zi hollarda kech ro‘yxatdan o‘tish mumkin (qo‘shimcha shart bilan).\nEslatma keladimi? :: Ha, tizim orqali bildirishnoma yuboriladi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'sinov',
      title: 'Sinov imtihonlari',
      subtitle: 'Haqiqiy imtihonga tayyorgarlik',
      image: 'images/programmes/prog-sinov.jpg',
      intro: 'Sinov imtihonlari talabalarga haqiqiy imtihon sharoitida o‘zini sinab ko‘rish imkonini beradi. Natijalar tahlil qilinib, zaif tomonlar aniqlanadi va yakuniy imtihonga ishonch bilan tayyorlaniladi.',
      highlights: 'Haqiqiy imtihon sharoiti\nBatafsil natija tahlili\nZaif tomonlarni aniqlash\nO‘qituvchi izohlari\nIshonchni oshirish',
      faq: 'Sinov imtihoni majburiymi? :: Yo‘q, lekin tayyorgarlik uchun juda foydali.\nNatija hisobga olinadimi? :: Faqat tayyorgarlik uchun, yakuniy bahoga ta’sir qilmaydi.\nNecha marta topshirish mumkin? :: Bir necha marta — tayyorgarlik davomida.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'amaliyot',
      title: 'Fan amaliy mashg‘ulotlari',
      subtitle: 'Nazariyani amaliyotda mustahkamlash',
      image: 'images/programmes/prog-amaliyot.jpg',
      intro: 'Tabiiy fanlar bo‘yicha amaliy (laboratoriya) mashg‘ulotlari talabalarning nazariy bilimini real tajribalar bilan mustahkamlaydi. Zamonaviy laboratoriyalarda o‘tkaziladigan amaliyotlar bilim va ko‘nikmani chuqurlashtiradi.',
      highlights: 'Zamonaviy laboratoriyalar\nReal tajriba va o‘lchovlar\nXavfsizlik qoidalari bo‘yicha tayyorgarlik\nGuruh va individual ishlash\nAmaliy ko‘nikma sertifikati',
      faq: 'Qaysi fanlar bo‘yicha? :: Fizika, kimyo, biologiya va boshqa tabiiy fanlar.\nLaboratoriya bormi? :: Ha, zamonaviy jihozlangan laboratoriyalar mavjud.\nSertifikat beriladimi? :: Amaliyotni tugatganlarga tegishli hujjat beriladi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'gcse-amaliyot',
      title: 'GCSE fan amaliy mashg‘ulotlari',
      subtitle: 'Boshlang‘ich bosqichda amaliy ko‘nikma',
      image: 'images/programmes/prog-gcse-amaliyot.jpg',
      intro: 'Boshlang‘ich bosqich talabalari uchun tabiiy fanlar bo‘yicha amaliy mashg‘ulotlar. Talabalar laboratoriya ishlarini bajarish, kuzatish va xulosa chiqarish ko‘nikmalarini erta bosqichdan egallaydi.',
      highlights: 'Boshlang‘ich bosqichga mos amaliyotlar\nXavfsiz laboratoriya muhiti\nKuzatish va tahlil ko‘nikmasi\nQiziqarli tajribalar\nO‘qituvchi nazorati',
      faq: 'Kim uchun? :: Boshlang‘ich va o‘rta bosqich talabalari uchun.\nXavfsizmi? :: Ha, barcha mashg‘ulotlar xavfsizlik qoidalari asosida.\nQaysi fanlar? :: Fizika, kimyo, biologiya asoslari.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'natijalar-xizmat',
      title: 'Natijalar va natijadan keyingi xizmatlar',
      subtitle: 'Natijadan keyin ham yoningizdamiz',
      image: 'images/programmes/prog-natijalar.jpg',
      intro: 'Imtihon natijalari e’lon qilingandan so‘ng ham talabalar qo‘llab-quvvatlanadi: natijani qayta ko‘rib chiqish (apellyatsiya), maslahat va keyingi qadamlar bo‘yicha yo‘naltirish. Har bir talaba o‘z natijasidan maksimal foyda oladi.',
      highlights: 'Natijalarni oshkora e’lon qilish\nApellyatsiya (qayta ko‘rib chiqish)\nMaslahat va yo‘naltirish\nKeyingi bosqich bo‘yicha rejalashtirish\nHujjatlarni rasmiylashtirish',
      faq: 'Natijaga rozi bo‘lmasam? :: Apellyatsiya orqali qayta ko‘rib chiqishni so‘rashingiz mumkin.\nMaslahat beriladimi? :: Ha, keyingi qadamlar bo‘yicha maslahat xizmati mavjud.\nHujjat olamanmi? :: Ha, rasmiy natija hujjati beriladi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'oquv-muddat',
      title: 'O‘quv muddatlari va taqvim',
      subtitle: 'Semestrlar, imtihonlar va ta’til',
      image: 'images/programmes/prog-muddat.jpg',
      intro: 'O‘quv yili semestrlarga bo‘lingan bo‘lib, dars boshlanishi, imtihon sessiyalari va ta’til muddatlari oldindan e’lon qilinadi. Talabalar o‘z vaqtini samarali rejalashtirish imkoniyatiga ega.',
      highlights: 'Semestr boshlanish va yakun sanalari\nImtihon sessiyalari jadvali\nTa’til muddatlari\nBayram va dam olish kunlari\nRasmiy o‘quv taqvimi',
      faq: 'Semestr qachon boshlanadi? :: Rasmiy taqvim bo‘yicha, odatda kuz va bahor semestrlari.\nTa’til qachon? :: Semestrlar orasida va yozgi ta’til belgilanadi.\nTaqvimni qayerdan olaman? :: Rasmiy sayt va shaxsiy kabinet orqali.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'akademik',
      title: 'Akademik qo‘llab-quvvatlash',
      subtitle: 'Har bir talaba yolg‘iz emas',
      image: 'images/programmes/prog-akademik.jpg',
      intro: 'Kokand University talabalarga o‘qishda har tomonlama yordam beradi: shaxsiy tyutor, konsultatsiyalar, qo‘shimcha mashg‘ulotlar va o‘quv resurslari. Har bir talaba o‘z salohiyatini to‘liq ochishi uchun sharoit yaratilgan.',
      highlights: 'Shaxsiy tyutor (mentor)\nQo‘shimcha konsultatsiyalar\nO‘quv resurslari va kutubxona\nPsixologik qo‘llab-quvvatlash\nKaryera markazi yordami',
      faq: 'Tyutor qanday tayinlanadi? :: Har bir talabaga o‘qish boshida biriktiriladi.\nQo‘shimcha darslar bepulmi? :: Asosiy konsultatsiyalar o‘quv jarayoniga kiradi.\nKutubxona bormi? :: Ha, boy elektron va bosma resurslar mavjud.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'turar-joy',
      title: 'Talabalar turar joyi',
      subtitle: 'Qulay, xavfsiz va universitetga yaqin',
      image: 'images/programmes/prog-turarjoy.jpg',
      intro: 'Boshqa shaharlardan kelgan talabalar uchun bir necha xil turar joy imkoniyati mavjud: universitet yotoqxonasi, hamkor turar joy majmualari va oilaviy mehmondorchilik. Har bir variant qulaylik darajasi va narxi bo‘yicha farq qiladi — o‘zingizga mosini tanlaysiz.\n\nBarcha turar joylar universitetga yaqin joylashgan, xavfsizlik nazorati va internet bilan ta’minlangan.',
      highlights: 'Universitet yotoqxonasi — eng qulay narx, kampus ichida\nHamkor turar joy majmualari — zamonaviy studiya va umumiy kvartiralar\nOilaviy mehmondorchilik — til muhiti va uy sharoiti\nBarcha xonalarda internet va o‘quv joyi\n24/7 xavfsizlik va nazorat\nUniversitetga piyoda yoki qisqa yo‘l\nKir yuvish, oshxona va dam olish zonalari\nTalabalar hamjamiyati va tadbirlar',
      faq: 'Qanday turar joy variantlari bor? :: Uchta asosiy variant: universitet yotoqxonasi, hamkor turar joy majmualari (studiya yoki umumiy kvartira) va oilaviy mehmondorchilik.\nKim birinchi navbatda joy oladi? :: Boshqa hududlardan kelgan va uzoq masofadan qatnaydigan talabalar.\nNarxi qancha? :: Variant va xona turiga qarab farq qiladi. Aniq narxlar qabul komissiyasidan olinadi.\nOvqatlanish qanday tashkil etilgan? :: Yotoqxonada umumiy oshxona bor; kampus yaqinida oshxona va do‘konlar mavjud.\nQachon ariza topshirish kerak? :: Qabul jarayoni bilan bir vaqtda — joylar cheklangan.\nMehmon chaqirsam bo‘ladimi? :: Ha, belgilangan tartib va vaqt doirasida.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'fikrlar',
      title: 'Talabalar fikri',
      subtitle: 'Ular biz haqimizda nima deydi',
      image: 'images/programmes/prog-fikrlar.jpg',
      intro: 'Talabalarimiz va bitiruvchilarimizning fikri — biz uchun eng qimmatli baho. Ular Kokand Universityda o‘tkazgan yillari, olgan bilim va tajribalari haqida ochiq gapiradi.',
      highlights: 'Talabalarning haqiqiy fikrlari\nBitiruvchilar muvaffaqiyati\nO‘qish tajribasi\nUstozlar haqida fikr\nUniversitet hayoti taassurotlari',
      faq: 'Fikrlar haqiqiymi? :: Ha, real talabalar va bitiruvchilardan.\nMen ham fikr qoldirsam bo‘ladimi? :: Albatta — biz fikrlaringizni qadrlaymiz.\nBitiruvchilar qayerda ishlaydi? :: Turli soha va tashkilotlarda muvaffaqiyatli faoliyat yuritadi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'onlayn',
      title: 'Onlayn ta’lim',
      subtitle: 'Bilim — istalgan joyda, istalgan vaqtda',
      image: 'images/programmes/prog-onlayn.jpg',
      intro: 'Kokand University zamonaviy onlayn ta’lim imkoniyatlarini taklif etadi. Raqamli platformalar, video darslar va interaktiv resurslar orqali talabalar joylashuvidan qat’i nazar sifatli bilim oladi.',
      highlights: 'Zamonaviy onlayn platforma\nVideo darslar va interaktiv resurslar\nMoslashuvchan o‘qish jadvali\nOnlayn maslahat va qo‘llab-quvvatlash\nRaqamli kutubxona',
      faq: 'Onlayn diplom beriladimi? :: Dastur turiga qarab tegishli hujjat beriladi.\nQanday qatnashaman? :: Ro‘yxatdan o‘tib, platformaga kirasiz.\nTexnik yordam bormi? :: Ha, onlayn qo‘llab-quvvatlash xizmati mavjud.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'vakansiya',
      title: 'Bo‘sh ish o‘rinlari (vakansiyalar)',
      subtitle: 'Bizning jamoaga qo‘shiling',
      image: 'images/programmes/prog-vakansiya.jpg',
      intro: 'Kokand University iqtidorli va tashabbuskor mutaxassislarni o‘z jamoasiga taklif etadi. O‘qituvchilar, ma’muriy xodimlar va turli soha mutaxassislari uchun bo‘sh ish o‘rinlari muntazam e’lon qilinadi.',
      highlights: 'Zamonaviy va do‘stona ish muhiti\nKasbiy o‘sish imkoniyatlari\nRaqobatbardosh ish haqi\nMalaka oshirish va treninglar\nBarqaror va ishonchli tashkilot',
      faq: 'Qanday ariza topshiraman? :: CV va hujjatlarni belgilangan tartibda topshirasiz.\nQaysi lavozimlar bor? :: O‘qituvchilik, ma’muriy va texnik yo‘nalishlar bo‘yicha.\nTajriba talab qilinadimi? :: Lavozimga qarab turlicha — batafsil e’lonда ko‘rsatiladi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'tutor-tarmoq',
      title: 'Ustozlar jamoasiga qo‘shiling',
      subtitle: 'Bilimingizni ulashing, kelajakni tarbiyalang',
      image: 'images/programmes/prog-tutor-tarmoq.jpg',
      intro: 'O‘z sohangizning mutaxassisimisiz va bilimingizni ulashishni istaysizmi? Kokand University professional o‘qituvchilar va mentorlar tarmog‘iga qo‘shilishni taklif etadi. Birga kelajak avlodni tarbiyalaymiz.',
      highlights: 'Professional o‘qituvchilar jamoasi\nMoslashuvchan hamkorlik formati\nMalaka va tajriba almashinuvi\nZamonaviy metodikalar\nMa’naviy va moddiy rag‘bat',
      faq: 'Kim qo‘shilishi mumkin? :: O‘z sohasida tajribaga ega mutaxassislar.\nTo‘liq stavka shartmi? :: Yo‘q, moslashuvchan formatlar mavjud.\nQanday boshlanadi? :: Ariza va suhbatdan so‘ng hamkorlik boshlanadi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'kollej',
      title: 'Universitetimiz haqida',
      subtitle: 'An’ana va zamonaviylik uyg‘unligi',
      image: 'images/programmes/prog-kollej.jpg',
      intro: 'Kokand University — xalqaro ta’lim standartlariga asoslangan, amaliyotga yo‘naltirilgan zamonaviy universitet. Bizning maqsadimiz — mustaqil fikrlaydigan, raqobatbardosh va yuksak ma’naviyatli mutaxassislarni tayyorlash.',
      highlights: 'Xalqaro ta’lim standartlari\nAmaliyotga yo‘naltirilgan ta’lim\nZamonaviy infratuzilma\nXalqaro hamkorlik\nMalakali professor-o‘qituvchilar',
      faq: 'Universitet qachon tashkil etilgan? :: Kokand University zamonaviy talablarga mos ravishda faoliyat yuritadi.\nQaysi yo‘nalishlar bor? :: IT, iqtisodiyot, biznes, filologiya va boshqalar.\nXalqaro diplom beriladimi? :: Xalqaro standartlarga muvofiq ta’lim beriladi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'metod',
      title: 'O‘qitish metodikasi',
      subtitle: 'Har bir talabaga individual yondashuv',
      image: 'images/programmes/prog-metod.jpg',
      intro: 'Kokand University o‘qitishning zamonaviy va samarali metodikasidan foydalanadi. Nazariya amaliyot bilan uyg‘unlashtiriladi, har bir talabaga individual e’tibor beriladi va mustaqil fikrlash rag‘batlantiriladi.',
      highlights: 'Individual (tьютorial) yondashuv\nNazariya va amaliyot uyg‘unligi\nInteraktiv va zamonaviy darslar\nMustaqil fikrlashni rivojlantirish\nLoyihaviy va jamoaviy ishlash',
      faq: 'Metodika nimasi bilan farq qiladi? :: Har bir talabaga e’tibor va amaliy yondashuv bilan.\nGuruhlar katta bo‘ladimi? :: Kichik guruhlar orqali sifat ta’minlanadi.\nAmaliyot bormi? :: Ha, o‘quv jarayoni amaliyot bilan uyg‘un.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'ustozlar',
      title: 'Bizning ustozlarimiz',
      subtitle: 'Tajriba, bilim va g‘amxo‘rlik',
      image: 'images/programmes/prog-ustozlar.jpg',
      intro: 'Kokand University professor-o‘qituvchilari — o‘z sohasining yetuk mutaxassislari. Ular nafaqat bilim beradi, balki har bir talabaning shaxsiy va kasbiy rivojlanishida yo‘l ko‘rsatuvchi mentor ham bo‘ladi.',
      highlights: 'Yuqori malakali mutaxassislar\nAmaliy tajribaga ega o‘qituvchilar\nMentorlik va yo‘naltirish\nXalqaro tajriba\nTalabaga g‘amxo‘rlik',
      faq: 'O‘qituvchilar kim? :: Soha mutaxassislari va tajribali pedagoglar.\nMentor biriktiriladimi? :: Ha, har talabaga shaxsiy tyutor.\nXalqaro o‘qituvchilar bormi? :: Xalqaro hamkorlik doirasida jalb qilinadi.',
      link: 'https://www.kokanduni.uz/uz/static/employes/structure/32',
    },
    {
      key: 'natija-yonalish',
      title: 'Natijalar va bitiruvchilar yo‘nalishi',
      subtitle: 'Bilim — muvaffaqiyatli kelajak sari',
      image: 'images/programmes/prog-natija-yonalish.jpg',
      intro: 'Kokand University bitiruvchilari mehnat bozorida talab qilinadi va turli sohalarda muvaffaqiyatli faoliyat yuritadi. Bizning natijalarimiz — talabalarimizning yutuqlari va ularning yorqin kelajagida aks etadi.',
      highlights: 'Yuqori bandlik ko‘rsatkichi\nTanlov va olimpiada g‘alabalari\nXalqaro dasturlarda ishtirok\nMuvaffaqiyatli bitiruvchilar\nKaryera markazi qo‘llab-quvvatlashi',
      faq: 'Bitiruvchilar ishga joylashadimi? :: Ko‘pchilik bitiruvchilar o‘z sohasida ishga joylashadi.\nKaryera yordami bormi? :: Ha, karyera markazi yo‘naltiradi.\nXalqaro imkoniyat bormi? :: Ha, xalqaro dastur va almashinuvlar mavjud.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'sixth-form',
      title: 'Akademik litsey (Sixth Form)',
      subtitle: 'Universitetga mustahkam poydevor',
      image: 'images/programmes/prog-sixthform.jpg',
      intro: 'Akademik litsey — o‘quvchilarni universitet ta’limiga tayyorlovchi bosqich. Chuqurlashtirilgan fan dasturlari, akademik yozuv va tanqidiy fikrlash ko‘nikmalari orqali o‘quvchilar oliy ta’limga ishonch bilan qadam qo‘yadi.\n\nKichik guruhlar va shaxsiy mentor tizimi har bir o‘quvchining sur’atiga moslashadi.',
      highlights: 'Chuqurlashtirilgan fan dasturlari\nUniversitet muhitiga erta moslashish\nAkademik yozuv va tanqidiy fikrlash\nKichik guruhlar (odatda 4–8 kishi)\nHar bir o‘quvchiga shaxsiy mentor\nQabul imtihonlariga maqsadli tayyorgarlik\nTil tayyorgarligi va xalqaro imkoniyatlar\nUniversitet tanlash bo‘yicha maslahat',
      faq: 'Kimlar o‘qiy oladi? :: Universitetga tayyorlanayotgan 10–11-sinf o‘quvchilari va bitiruvchilar.\nQaysi fanlar chuqur o‘rganiladi? :: Tanlangan yo‘nalishga mos asosiy fanlar (aniq, tabiiy yoki ijtimoiy).\nGuruhlar qanchalik kichik? :: Odatda 4–8 o‘quvchi — har kimga e’tibor yetadi.\nUniversitetga o‘tish osonmi? :: Litsey bitiruvchilari universitet talablariga tayyor holda o‘tadi.\nDars jadvali qanday? :: Kunduzgi, to‘liq o‘quv haftasi; qo‘shimcha konsultatsiyalar bilan.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'kontakt',
      title: 'Biz bilan bog‘lanish',
      subtitle: 'Savollaringiz bormi? Biz yordamga tayyormiz',
      image: 'images/programmes/prog-kontakt.jpg',
      intro: 'Kokand University jamoasi sizning savollaringizga javob berishga har doim tayyor. Qabul, o‘quv dasturlari yoki boshqa masalalar bo‘yicha biz bilan bemalol bog‘laning.',
      highlights: 'Manzil: Farg‘ona viloyati, Qo‘qon shahri\nTelefon: qabul komissiyasi raqami\nEmail: rasmiy elektron pochta\nIsh vaqti: dushanba–shanba\nIjtimoiy tarmoqlar: Telegram, Instagram',
      faq: 'Qanday bog‘lansam bo‘ladi? :: Telefon, email yoki ijtimoiy tarmoqlar orqali.\nQabul bo‘yicha kimga murojaat qilaman? :: Qabul komissiyasiga.\nUniversitetga borsam bo‘ladimi? :: Ha, bevosita tashrif buyurishingiz mumkin.',
      link: 'https://www.kokanduni.uz/uz/static/contacts',
    },
    {
      key: 'yordam',
      title: 'Yordam markazi — talaba va o‘qituvchilar uchun',
      subtitle: 'Har qanday savolda yoningizdamiz',
      image: 'images/programmes/prog-yordam.jpg',
      intro: 'Yordam markazi talabalar va o‘qituvchilarga o‘quv jarayoni, texnik masalalar va tashkiliy savollarda yordam beradi. Maqsadimiz — har bir murojaatga tez va aniq javob berish.',
      highlights: 'O‘quv platformasi bo‘yicha texnik yordam\nDars jadvali va imtihonlar bo‘yicha ma’lumot\nHujjatlar va ariza masalalarida ko‘maklashish\nO‘qituvchilar uchun uslubiy qo‘llab-quvvatlash\nTez va sifatli javob',
      faq: 'Yordamga qanday murojaat qilaman? :: Telegram, email yoki qabulxona orqali.\nTexnik muammoda kim yordam beradi? :: IT qo‘llab-quvvatlash xizmati.\nJavob qancha vaqtda keladi? :: Odatda ish kuni davomida.',
      link: 'https://www.kokanduni.uz/uz',
    },
  ]);

  const defaults = {
    stories_url: '/stories.html',
    our_tutors_url: 'https://website-checker-tool--davronovo425.replit.app/',
    results_title: 'Natijaga erishgan yoshlarimiz',
    results_intro: 'Universitetimiz talabalarining tanlov va olimpiadalardagi yutuqlari.',
    distinctions_title: 'Kokand University nimasi bilan ajralib turadi?',
    interests_title: 'Sizni qiziqtirishi mumkin',
    news_title: 'Yangiliklar',
    gallery_title: 'Kokand University galereyasi',
    gallery_intro: 'Universitet binolari, zamonaviy auditoriyalar va kampus hayoti — bir joyda.',
    gallery_video_url: '',
    castle_title: 'Kokand University talabalar shaharchasi',
    castle_intro: 'Uyingizdan uzoqda — yangi uyingiz. Universitetga yaqin, xavfsiz va qulay turar joy variantlari.',
    castle_phone: '+998 (00) 000-00-00',
    castle_email: 'turarjoy@kokanduni.uz',
    // Shaharcha alohida sayt bo'lganda footer havolalari shu manzilga ketadi.
    // Bo'sh bo'lsa — havolalar umuman ko'rsatilmaydi.
    university_url: '',
  };
  for (const [k, v] of Object.entries(defaults)) {
    const exists = await db.get('SELECT 1 AS x FROM settings WHERE key = ?', [k]);
    if (!exists) await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', [k, v]);
  }
}

async function cleanupSessions() {
  await db.run('DELETE FROM sessions WHERE expires_at < ?', [Date.now()]);
}

module.exports = { bootstrapUsers, seedContent, cleanupSessions };
