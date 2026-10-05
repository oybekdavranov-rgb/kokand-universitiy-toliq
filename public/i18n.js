(function () {
  'use strict';

  var DEFAULT_LANGUAGE = 'uz';
  var SUPPORTED_LANGUAGES = { uz: 'UZ', en: 'EN', ru: 'RU' };
  var LANGUAGE_NAMES = { uz: 'O‘zbek', en: 'English', ru: 'Русский' };
  var TRANSLATIONS = {
  "KU Yoshlar Ittifoqi": {
    "uz": "KU Yoshlar Ittifoqi",
    "en": "KU Youth Union",
    "ru": "Молодежный союз KU"
  },
  "Hush Kelibsiz": {
    "uz": "Xush kelibsiz",
    "en": "Welcome",
    "ru": "Добро пожаловать"
  },
  "Welcome To": {
    "uz": "Xush kelibsiz",
    "en": "Welcome To",
    "ru": "Добро пожаловать в"
  },
  "Discover KU": {
    "uz": "KU haqida bilib oling",
    "en": "Discover KU",
    "ru": "Узнать о KU"
  },
  "Watch our Video": {
    "uz": "Videoni tomosha qiling",
    "en": "Watch our Video",
    "ru": "Посмотреть видео"
  },
  "close": {
    "uz": "yopish",
    "en": "close",
    "ru": "закрыть"
  },
  "Search": {
    "uz": "Qidirish",
    "en": "Search",
    "ru": "Поиск"
  },
  "Our Tutors": {
    "uz": "Tutorlarimiz",
    "en": "Our Tutors",
    "ru": "Наши тьюторы"
  },
  "Results": {
    "uz": "Natijalar",
    "en": "Results",
    "ru": "Результаты"
  },
  "Stories": {
    "uz": "Hikoyalar",
    "en": "Stories",
    "ru": "Истории"
  },
  "Login": {
    "uz": "Kirish",
    "en": "Login",
    "ru": "Войти"
  },
  "Staff Login": {
    "uz": "Xodimlar uchun kirish",
    "en": "Staff Login",
    "ru": "Вход для сотрудников"
  },
  "Programmes": {
    "uz": "Dasturlar",
    "en": "Programmes",
    "ru": "Программы"
  },
  "Akademik litsey": {
    "uz": "Akademik litsey",
    "en": "Akademik litsey",
    "ru": "Akademik litsey"
  },
  "Online Sixth Form": {
    "uz": "Onlayn Sixth Form",
    "en": "Online Sixth Form",
    "ru": "Онлайн Sixth Form"
  },
  "A Level Two Year": {
    "uz": "A Level — 2 yillik",
    "en": "A Level Two Year",
    "ru": "A Level — 2 года"
  },
  "A Level Fast Track": {
    "uz": "A Level tezlashtirilgan",
    "en": "A Level Fast Track",
    "ru": "A Level ускоренный курс"
  },
  "A Level Retakes": {
    "uz": "A Level qayta topshirish",
    "en": "A Level Retakes",
    "ru": "Пересдача A Level"
  },
  "GCSE Two Year": {
    "uz": "GCSE — 2 yillik",
    "en": "GCSE Two Year",
    "ru": "GCSE — 2 года"
  },
  "GCSE Fast Track": {
    "uz": "GCSE tezlashtirilgan",
    "en": "GCSE Fast Track",
    "ru": "GCSE ускоренный курс"
  },
  "GCSE Retake": {
    "uz": "GCSE qayta topshirish",
    "en": "GCSE Retake",
    "ru": "Пересдача GCSE"
  },
  "Revision Courses": {
    "uz": "Takrorlash kurslari",
    "en": "Revision Courses",
    "ru": "Курсы повторения"
  },
  "Gap Year Programme": {
    "uz": "Gap Year dasturi",
    "en": "Gap Year Programme",
    "ru": "Программа Gap Year"
  },
  "Private Tuition": {
    "uz": "Individual ta’lim",
    "en": "Private Tuition",
    "ru": "Индивидуальное обучение"
  },
  "Admissions": {
    "uz": "Qabul",
    "en": "Admissions",
    "ru": "Прием"
  },
  "How to Apply": {
    "uz": "Qanday topshiriladi",
    "en": "How to Apply",
    "ru": "Как подать заявку"
  },
  "How to Transfer to Greene’s": {
    "uz": "Universitetga qanday o‘tish mumkin",
    "en": "How to Transfer to Greene’s",
    "ru": "Как перевестись в Greene’s"
  },
  "Application & Fees": {
    "uz": "Ariza va to‘lovlar",
    "en": "Application & Fees",
    "ru": "Заявка и оплата"
  },
  "Scholarships at Greene’s": {
    "uz": "Universitet stipendiyalari",
    "en": "Scholarships at Greene’s",
    "ru": "Стипендии Greene’s"
  },
  "Examinations": {
    "uz": "Imtihonlar",
    "en": "Examinations",
    "ru": "Экзамены"
  },
  "Examinations at Greene’s": {
    "uz": "Universitetdagi imtihonlar",
    "en": "Examinations at Greene’s",
    "ru": "Экзамены в Greene’s"
  },
  "Application and Fees": {
    "uz": "Ariza va to‘lovlar",
    "en": "Application and Fees",
    "ru": "Заявка и оплата"
  },
  "Registration Deadlines": {
    "uz": "Ro‘yxatdan o‘tish muddatlari",
    "en": "Registration Deadlines",
    "ru": "Сроки регистрации"
  },
  "Trial Examinations": {
    "uz": "Sinov imtihonlari",
    "en": "Trial Examinations",
    "ru": "Пробные экзамены"
  },
  "A Level Science Practicals": {
    "uz": "A Level fan amaliyotlari",
    "en": "A Level Science Practicals",
    "ru": "Практические занятия A Level"
  },
  "GCSE Science Practicals": {
    "uz": "GCSE fan amaliyotlari",
    "en": "GCSE Science Practicals",
    "ru": "Практические занятия GCSE"
  },
  "Results and Post-Results": {
    "uz": "Natijalar va natijadan keyingi jarayonlar",
    "en": "Results and Post-Results",
    "ru": "Результаты и последующие процедуры"
  },
  "Student Life": {
    "uz": "Talabalar hayoti",
    "en": "Student Life",
    "ru": "Студенческая жизнь"
  },
  "Term Dates": {
    "uz": "O‘quv davri sanalari",
    "en": "Term Dates",
    "ru": "Даты семестров"
  },
  "Academic Support": {
    "uz": "Akademik qo‘llab-quvvatlash",
    "en": "Academic Support",
    "ru": "Академическая поддержка"
  },
  "Student Accommodation": {
    "uz": "Talabalar turar joyi",
    "en": "Student Accommodation",
    "ru": "Проживание студентов"
  },
  "Testimonials": {
    "uz": "Fikrlar",
    "en": "Testimonials",
    "ru": "Отзывы"
  },
  "About Greene’s": {
    "uz": "Universitet haqida",
    "en": "About the University",
    "ru": "Об университете"
  },
  "Kokand University": {
    "uz": "Kokand University",
    "en": "Kokand University",
    "ru": "Kokand University"
  },
  "The Tutorial Method of Learning": {
    "uz": "Tutorial ta’lim uslubi",
    "en": "The Tutorial Method of Learning",
    "ru": "Тьюторский метод обучения"
  },
  "Results & Destinations": {
    "uz": "Natijalar va yo‘nalishlar",
    "en": "Results & Destinations",
    "ru": "Результаты и направления"
  },
  "Kokand University Onlayn": {
    "uz": "Kokand University Onlayn",
    "en": "Kokand University Onlayn",
    "ru": "Kokand University Onlayn"
  },
  "Vacancies at Greene’s": {
    "uz": "Universitetdagi vakansiyalar",
    "en": "Vacancies at Greene’s",
    "ru": "Вакансии Greene’s"
  },
  "Join our Professional Network of Tutors": {
    "uz": "Professional tutorlar tarmog‘imizga qo‘shiling",
    "en": "Join our Professional Network of Tutors",
    "ru": "Присоединяйтесь к профессиональной сети тьюторов"
  },
  "Contact Us": {
    "uz": "Biz bilan bog‘laning",
    "en": "Contact Us",
    "ru": "Связаться с нами"
  },
  "Members": {
    "uz": "A’zolar",
    "en": "Members",
    "ru": "Участники"
  },
  "Grid": {
    "uz": "Jadval",
    "en": "Grid",
    "ru": "Сетка"
  },
  "Discover Greene’s": {
    "uz": "Universitetni kashf eting",
    "en": "Discover Kokand University",
    "ru": "Узнать об университете"
  },
  "Sixth Form College": {
    "uz": "Akademik litsey",
    "en": "Sixth Form College",
    "ru": "Sixth Form колледж"
  },
  "Tuition": {
    "uz": "Individual repetitorlik",
    "en": "Tuition",
    "ru": "Обучение"
  },
  "A level retakes": {
    "uz": "Qayta topshirish",
    "en": "A level retakes",
    "ru": "Пересдача A level"
  },
  "Examinations & Tests": {
    "uz": "Imtihonlar va testlar",
    "en": "Examinations & Tests",
    "ru": "Экзамены и тесты"
  },
  "WELCOME TO": {
    "uz": "XUSH KELIBSIZ",
    "en": "WELCOME TO",
    "ru": "ДОБРО ПОЖАЛОВАТЬ В"
  },
  "Kokand University oldest tutorial college": {
    "uz": "Qo‘qon universiteti — zamonaviy tutorial ta’lim maskani",
    "en": "Kokand University — a modern tutorial college",
    "ru": "Кокандский университет — современный учебный центр"
  },
  "DESIGN YOUR EDUCATION. TRANSFORM YOUR FUTURE.": {
    "uz": "TA’LIMINGIZNI TANLANG. KELAJAGINGIZNI O‘ZGARTIRING.",
    "en": "DESIGN YOUR EDUCATION. TRANSFORM YOUR FUTURE.",
    "ru": "СОЗДАЙТЕ СВОЕ ОБРАЗОВАНИЕ. ИЗМЕНИТЕ БУДУЩЕЕ."
  },
  "Bugungi kunda O'zbekiston jadal rivojlanish bosqichiga qadam qo'ymoqda. Iqtisodiyot, ta'lim va innovatsiya sohalaridagi tub islohotlar yangi avlod mutaxassislariga bo'lgan ehtiyojni yanada oshirmoqda.": {
    "uz": "Bugungi kunda O‘zbekiston jadal rivojlanish bosqichiga qadam qo‘ymoqda. Iqtisodiyot, ta’lim va innovatsiya sohalaridagi tub islohotlar yangi avlod mutaxassislariga bo‘lgan ehtiyojni yanada oshirmoqda.",
    "en": "Today, Uzbekistan is entering a stage of rapid development. Deep reforms in the economy, education and innovation are increasing the need for a new generation of specialists.",
    "ru": "Сегодня Узбекистан вступает в этап стремительного развития. Глубокие реформы в экономике, образовании и инновациях повышают потребность в специалистах нового поколения."
  },
  "Aynan shunday sharoitda bizning universitetimiz zamon talablariga mos, raqobatbardosh va amaliy bilimga ega kadrlarni tayyorlashni o'z oldiga maqsad qilib qo'ygan.": {
    "uz": "Aynan shunday sharoitda bizning universitetimiz zamon talablariga mos, raqobatbardosh va amaliy bilimga ega kadrlarni tayyorlashni o‘z oldiga maqsad qilib qo‘ygan.",
    "en": "In these conditions, our university aims to train competitive specialists with practical knowledge who meet the demands of the time.",
    "ru": "В этих условиях наш университет ставит перед собой цель готовить конкурентоспособных специалистов с практическими знаниями, отвечающих требованиям времени."
  },
  "Biz ta'limda nazariya va amaliyotni uyg'unlashtirgan holda, talabalarimizga nafaqat bilim, balki real hayotda muvaffaqiyatga erishish uchun zarur bo'lgan ko'nikmalarni ham beramiz. Xalqaro tajriba, zamonaviy o'quv dasturlari, innovatsion yondashuvlar va professional muhit — bularning barchasi talabaning shaxs sifatida shakllanishiga xizmat qiladi.": {
    "uz": "Biz ta’limda nazariya va amaliyotni uyg‘unlashtirgan holda, talabalarimizga nafaqat bilim, balki real hayotda muvaffaqiyatga erishish uchun zarur bo‘lgan ko‘nikmalarni ham beramiz. Xalqaro tajriba, zamonaviy o‘quv dasturlari, innovatsion yondashuvlar va professional muhit — bularning barchasi talabaning shaxs sifatida shakllanishiga xizmat qiladi.",
    "en": "By combining theory and practice in education, we give our students not only knowledge, but also the skills they need to succeed in real life. International experience, modern curricula, innovative approaches and a professional environment all support each student’s personal development.",
    "ru": "Сочетая теорию и практику в образовании, мы даем студентам не только знания, но и навыки, необходимые для успеха в реальной жизни. Международный опыт, современные учебные программы, инновационные подходы и профессиональная среда способствуют развитию личности студента."
  },
  ", at any time, regardless of their location.": {
    "uz": ", istalgan vaqtda va joylashuvidan qat’i nazar.",
    "en": ", at any time, regardless of their location.",
    "ru": ", в любое время, независимо от местоположения."
  },
  "Bu yerda har bir talaba o'z salohiyatini kashf etishi, orzularini aniq maqsadlarga aylantirishi mumkin.": {
    "uz": "Bu yerda har bir talaba o‘z salohiyatini kashf etishi, orzularini aniq maqsadlarga aylantirishi mumkin.",
    "en": "Here, every student can discover their potential and turn their dreams into clear goals.",
    "ru": "Здесь каждый студент может раскрыть свой потенциал и превратить мечты в конкретные цели."
  },
  ". Biz bilan birga bilim oling, rivojlaning va kelajagingizni bugundan yarating. Sizning muvaffaqiyatingiz — bizning asosiy qadriyatimiz.": {
    "uz": ". Biz bilan birga bilim oling, rivojlaning va kelajagingizni bugundan yarating. Sizning muvaffaqiyatingiz — bizning asosiy qadriyatimiz.",
    "en": ". Learn with us, grow with us and start building your future today. Your success is our core value.",
    "ru": ". Учитесь вместе с нами, развивайтесь и создавайте свое будущее уже сегодня. Ваш успех — наша главная ценность."
  },
  "Get in touch to find out more.": {
    "uz": "Batafsil ma’lumot olish uchun bog‘laning.",
    "en": "Get in touch to find out more.",
    "ru": "Свяжитесь с нами, чтобы узнать больше."
  },
  "Meet Our team Yunusov Abdulhamid Jamoa Sardori": {
    "uz": "Jamoamiz bilan tanishing: Yunusov Abdulhamid — jamoa sardori",
    "en": "Meet our team: Yunusov Abdulhamid, team leader",
    "ru": "Познакомьтесь с нашей командой: Юнусов Абдулхамид, капитан команды"
  },
  "Greene’s Sixth Form": {
    "uz": "Akademik litsey",
    "en": "Sixth Form",
    "ru": "Академический лицей"
  },
  "Greene’s Tutorial College": {
    "uz": "Kokand University",
    "en": "Kokand University",
    "ru": "Kokand University"
  },
  "Greene’s Online": {
    "uz": "Kokand University Onlayn",
    "en": "Kokand University Online",
    "ru": "Kokand University Онлайн"
  },
  "Greene’s Team": {
    "uz": "Universitet jamoasi",
    "en": "Greene’s Team",
    "ru": "Команда Greene’s"
  },
  "What does Kokand University do?": {
    "uz": "Kokand University nimasi bilan ajralib turadi?",
    "en": "What does Kokand University do?",
    "ru": "Чем выделяется Kokand University?"
  },
  "stand out?": {
    "uz": "ajralib turadi?",
    "en": "stand out?",
    "ru": "выделяется?"
  },
  "Times change: values endure.": {
    "uz": "Zamon o‘zgaradi, qadriyatlar saqlanadi.",
    "en": "Times change: values endure.",
    "ru": "Времена меняются, ценности остаются."
  },
  "Fresh start?": {
    "uz": "Yangi boshlanishmi?",
    "en": "Fresh start?",
    "ru": "Новое начало?"
  },
  "Subject spotlight: A level Further Mathematics": {
    "uz": "Yo‘nalish diqqat markazida: A level Further Mathematics",
    "en": "Subject spotlight: A level Further Mathematics",
    "ru": "В фокусе предмет: A level Further Mathematics"
  },
  "Individualised Education": {
    "uz": "Individual ta’lim",
    "en": "Individualised Education",
    "ru": "Индивидуализированное образование"
  },
  "Learning without Boundaries": {
    "uz": "Chegarasiz ta’lim",
    "en": "Learning without Boundaries",
    "ru": "Обучение без границ"
  },
  "Collaborative Learning": {
    "uz": "Hamkorlikda ta’lim",
    "en": "Collaborative Learning",
    "ru": "Совместное обучение"
  },
  "Expert Guidance": {
    "uz": "Mutaxassislar yo‘l-yo‘rig‘i",
    "en": "Expert Guidance",
    "ru": "Экспертное сопровождение"
  },
  "“ Kokand University represents a fresh start because it combines modern education with practical experience. Unlike many traditional universities, Kokand University focuses on real-world skills, technology, international opportunities, and personal development. I believe this environment will help me grow academically and professionally while preparing me for a global career.”": {
    "uz": "“Kokand University zamonaviy ta’limni amaliy tajriba bilan uyg‘unlashtirgani uchun men uchun yangi boshlanishdir. Ko‘plab an’anaviy universitetlardan farqli ravishda, Kokand University real ko‘nikmalar, texnologiyalar, xalqaro imkoniyatlar va shaxsiy rivojlanishga e’tibor qaratadi. Bu muhit meni akademik va kasbiy jihatdan rivojlantirib, global karyeraga tayyorlaydi.”",
    "en": "“Kokand University represents a fresh start because it combines modern education with practical experience. Unlike many traditional universities, Kokand University focuses on real-world skills, technology, international opportunities, and personal development. I believe this environment will help me grow academically and professionally while preparing me for a global career.”",
    "ru": "«Kokand University — это новое начало, потому что он объединяет современное образование с практическим опытом. В отличие от многих традиционных университетов, Kokand University делает акцент на реальных навыках, технологиях, международных возможностях и личном развитии. Я верю, что эта среда поможет мне расти академически и профессионально, готовя меня к глобальной карьере»."
  },
  "Learn more about A level retakes at Greene's": {
    "uz": "Universitetda qayta topshirish haqida batafsil",
    "en": "Learn more about A level retakes at Greene's",
    "ru": "Подробнее о пересдаче A level в Greene’s"
  },
  "“I chose A-Level Further Mathematics because it develops advanced problem-solving, logical thinking, and analytical skills. What makes this subject special is that it goes beyond standard mathematics and challenges students to think deeper and apply concepts in complex situations. It also prepares students for fields like engineering, computer science, economics, and technology.”": {
    "uz": "“Men A-Level Further Mathematicsni tanladim, chunki u murakkab muammolarni hal qilish, mantiqiy fikrlash va tahliliy ko‘nikmalarni rivojlantiradi. Bu fan standart matematikadan kengroq fikrlashga undaydi va bilimlarni murakkab vaziyatlarda qo‘llashga o‘rgatadi. Shuningdek, u muhandislik, kompyuter fanlari, iqtisodiyot va texnologiya kabi sohalarga tayyorlaydi.”",
    "en": "“I chose A-Level Further Mathematics because it develops advanced problem-solving, logical thinking, and analytical skills. What makes this subject special is that it goes beyond standard mathematics and challenges students to think deeper and apply concepts in complex situations. It also prepares students for fields like engineering, computer science, economics, and technology.”",
    "ru": "«Я выбрал A-Level Further Mathematics, потому что он развивает сложное решение задач, логическое мышление и аналитические навыки. Этот предмет выходит за рамки стандартной математики, заставляет мыслить глубже и применять понятия в сложных ситуациях. Он также готовит к инженерии, информатике, экономике и технологиям»."
  },
  "Read more about the A level in Further Mathematics here.": {
    "uz": "A level Further Mathematics haqida batafsil shu yerda o‘qing.",
    "en": "Read more about the A level in Further Mathematics here.",
    "ru": "Подробнее об A level Further Mathematics читайте здесь."
  },
  "“What makes Kokand University stand out is its individualized education approach. The university pays attention to each student’s strengths, goals, and personal development instead of using only a one-size-fits-all system. This allows students to learn more effectively, build confidence, and prepare for their future careers in a supportive environment.”": {
    "uz": "“Kokand Universityni ajratib turadigan jihat — individual ta’lim yondashuvidir. Universitet yagona qolipdagi tizim o‘rniga har bir talabaning kuchli tomonlari, maqsadlari va shaxsiy rivojlanishiga e’tibor qaratadi. Bu talabaga samaraliroq o‘qish, o‘ziga ishonchni oshirish va kelajak karyerasiga tayyorlanish imkonini beradi.”",
    "en": "“What makes Kokand University stand out is its individualized education approach. The university pays attention to each student’s strengths, goals, and personal development instead of using only a one-size-fits-all system. This allows students to learn more effectively, build confidence, and prepare for their future careers in a supportive environment.”",
    "ru": "«Kokand University выделяется индивидуальным подходом к образованию. Университет уделяет внимание сильным сторонам, целям и личному развитию каждого студента, а не использует одинаковую систему для всех. Это помогает учиться эффективнее, укреплять уверенность и готовиться к будущей карьере в поддерживающей среде»."
  },
  "The Tutorial College": {
    "uz": "Tutorial kolleji",
    "en": "The Tutorial College",
    "ru": "Тьюторский колледж"
  },
  "“Learning without Boundaries means having access to education beyond traditional limits. Kokand University stands out by encouraging students to explore global opportunities, modern technologies, practical experiences, and international perspectives. It creates an environment where students can continuously learn, grow, and connect with the world.”": {
    "uz": "“Chegarasiz ta’lim — an’anaviy chegaralardan tashqarida bilim olish imkoniyatidir. Kokand University talabalarni global imkoniyatlar, zamonaviy texnologiyalar, amaliy tajribalar va xalqaro qarashlarni o‘rganishga undashi bilan ajralib turadi. Bu muhit talabalar doimiy o‘qishi, rivojlanishi va dunyo bilan bog‘lanishi uchun sharoit yaratadi.”",
    "en": "“Learning without Boundaries means having access to education beyond traditional limits. Kokand University stands out by encouraging students to explore global opportunities, modern technologies, practical experiences, and international perspectives. It creates an environment where students can continuously learn, grow, and connect with the world.”",
    "ru": "«Обучение без границ означает доступ к образованию за пределами традиционных ограничений. Kokand University выделяется тем, что побуждает студентов изучать глобальные возможности, современные технологии, практический опыт и международные взгляды. Университет создает среду для постоянного обучения, роста и связи с миром»."
  },
  ", a custom-built online platform, where they can upload their work and review their assessments. Students receive live feedback and can track their progress independently in their own time. Study is in person or online, so geography will not limit academic development.": {
    "uz": ", maxsus yaratilgan onlayn platforma bo‘lib, unda talabalar ishlarini yuklashlari va baholash natijalarini ko‘rishlari mumkin. Talabalar jonli fikr-mulohaza oladi va o‘z vaqtida mustaqil ravishda rivojlanishini kuzatib boradi. O‘qish kampusda yoki onlayn shaklda bo‘lishi mumkin, shuning uchun masofa akademik rivojlanishni cheklamaydi.",
    "en": ", a custom-built online platform, where they can upload their work and review their assessments. Students receive live feedback and can track their progress independently in their own time. Study is in person or online, so geography will not limit academic development.",
    "ru": ", специально созданная онлайн-платформа, где студенты могут загружать работы и просматривать результаты оценивания. Студенты получают обратную связь в реальном времени и самостоятельно отслеживают прогресс. Обучение возможно очно или онлайн, поэтому география не ограничивает академическое развитие."
  },
  "Learning can take place in our campus in Oxford, UK, or online from anywhere in the world. You can also make use of our campuses in Estoril and Lisbon, Portugal as online study spaces.": {
    "uz": "Ta’lim Buyuk Britaniyaning Oksford shahridagi kampusda yoki dunyoning istalgan nuqtasidan onlayn shaklda olib borilishi mumkin. Shuningdek, Portugaliyaning Estoril va Lissabon shaharlaridagi kampuslardan onlayn o‘qish maydoni sifatida foydalanish mumkin.",
    "en": "Learning can take place in our campus in Oxford, UK, or online from anywhere in the world. You can also make use of our campuses in Estoril and Lisbon, Portugal as online study spaces.",
    "ru": "Обучение может проходить в нашем кампусе в Оксфорде, Великобритания, или онлайн из любой точки мира. Также можно использовать кампусы в Эшториле и Лиссабоне, Португалия, как пространства для онлайн-обучения."
  },
  "Kokand University Haqida koproq bilib oling": {
    "uz": "Kokand University haqida ko‘proq bilib oling",
    "en": "Learn more about Kokand University",
    "ru": "Узнайте больше о Kokand University"
  },
  "“Collaborative learning at Kokand University helps students develop teamwork, communication, and problem-solving skills by working together on projects and discussions. This approach creates a supportive academic environment where students learn not only from teachers, but also from each other.”": {
    "uz": "“Kokand Universitydagi hamkorlikda o‘qish talabalarni loyihalar va muhokamalarda birga ishlash orqali jamoaviy ish, muloqot va muammolarni hal qilish ko‘nikmalarini rivojlantiradi. Bu yondashuv talabalar nafaqat o‘qituvchilardan, balki bir-biridan ham o‘rganadigan qo‘llab-quvvatlovchi akademik muhit yaratadi.”",
    "en": "“Collaborative learning at Kokand University helps students develop teamwork, communication, and problem-solving skills by working together on projects and discussions. This approach creates a supportive academic environment where students learn not only from teachers, but also from each other.”",
    "ru": "«Совместное обучение в Kokand University помогает студентам развивать командную работу, коммуникацию и навыки решения проблем через проекты и обсуждения. Такой подход создает поддерживающую академическую среду, где студенты учатся не только у преподавателей, но и друг у друга»."
  },
  "Read more about the tutorial method": {
    "uz": "Tutorial metod haqida batafsil o‘qing",
    "en": "Read more about the tutorial method",
    "ru": "Подробнее о тьюторском методе"
  },
  "“Kokand University stands out through expert guidance by providing students with support from qualified instructors and mentors who help them both academically and professionally. This guidance helps students build confidence, improve their skills, and prepare for future career opportunities.”": {
    "uz": "“Kokand University malakali o‘qituvchilar va mentorlar ko‘magi orqali talabalarni akademik hamda kasbiy jihatdan qo‘llab-quvvatlashi bilan ajralib turadi. Bu yo‘l-yo‘riq talabalarga ishonchni oshirish, ko‘nikmalarni rivojlantirish va kelajak karyera imkoniyatlariga tayyorlanishga yordam beradi.”",
    "en": "“Kokand University stands out through expert guidance by providing students with support from qualified instructors and mentors who help them both academically and professionally. This guidance helps students build confidence, improve their skills, and prepare for future career opportunities.”",
    "ru": "«Kokand University выделяется экспертным сопровождением: квалифицированные преподаватели и наставники поддерживают студентов в учебном и профессиональном развитии. Такая помощь укрепляет уверенность, развивает навыки и готовит к будущим карьерным возможностям»."
  },
  "OUR DIRECTOR": {
    "uz": "RAHBARIYAT",
    "en": "OUR DIRECTOR",
    "ru": "РУКОВОДСТВО"
  },
  "Your Goals - Our Expertise": {
    "uz": "Sizning maqsadlaringiz — bizning tajribamiz",
    "en": "Your Goals - Our Expertise",
    "ru": "Ваши цели — наша экспертиза"
  },
  "Direktor": {
    "uz": "Direktor",
    "en": "Director",
    "ru": "Директор"
  },
  "Xalqaro ta’lim standartlari asosida yuksak ma’naviy-axloqiy fazilatli, mustaqil fikrlashga qodir bo‘lgan, bozor sharoitida ishni tashkil etishning usullarini egallagan yuqori ma’lumotli malakali kadrlar tayyorlash; Universitet tarkibiy tuzilmasidagi barcha bo‘linmalar vakolatlarini belgilab berish, faoliyatlarini rejalashtirish, muvofiqlashtirish, boshqarish, marketing xizmatini rivojlantirib, ta’lim yo‘nalishi va ixtisosliklarga talab va ehtiyojni o‘rganish; Bitiruvchilarni amalda ishga joylashishi tahlili, mutaxassislarni maqsadli tayyorlash borasida hamkorlik shartnomalari tuzishni tashkil etish; Xorijiy hamkorlar bilan ilmiy-ijodiy aloqalarni rivojlantirish, investitsiya va grantlar jalb etilishini ta’minlash, qo‘shma korxonalar tashkil etish faoliyatini amalga oshirish.": {
    "uz": "Xalqaro ta’lim standartlari asosida yuksak ma’naviy-axloqiy fazilatli, mustaqil fikrlashga qodir bo‘lgan, bozor sharoitida ishni tashkil etishning usullarini egallagan yuqori ma’lumotli malakali kadrlar tayyorlash; universitet tarkibiy tuzilmasidagi bo‘linmalar vakolatlarini belgilash, faoliyatini rejalashtirish, muvofiqlashtirish va boshqarish; marketing xizmatini rivojlantirish, ta’lim yo‘nalishlari va ixtisosliklarga talabni o‘rganish; bitiruvchilar bandligini tahlil qilish, maqsadli kadrlar tayyorlash bo‘yicha hamkorlik shartnomalarini tashkil etish; xorijiy hamkorlar bilan ilmiy-ijodiy aloqalarni rivojlantirish, investitsiya va grantlar jalb qilish hamda qo‘shma loyihalarni amalga oshirish.",
    "en": "Training highly educated and qualified specialists based on international education standards, with strong moral qualities, independent thinking and the ability to organize work in market conditions; defining the powers of university divisions, planning, coordinating and managing their activities; developing marketing services and studying demand for educational fields and specialties; analyzing graduate employment and organizing cooperation agreements for targeted specialist training; developing scientific and creative relations with foreign partners, attracting investments and grants, and implementing joint projects.",
    "ru": "Подготовка высокообразованных квалифицированных кадров на основе международных стандартов образования, обладающих высокими духовно-нравственными качествами, самостоятельным мышлением и навыками организации работы в рыночных условиях; определение полномочий подразделений университета, планирование, координация и управление их деятельностью; развитие маркетинговой службы и изучение спроса на направления и специальности; анализ трудоустройства выпускников и организация договоров о целевой подготовке специалистов; развитие научно-творческих связей с зарубежными партнерами, привлечение инвестиций и грантов, реализация совместных проектов."
  },
  "Ma'naviy-marifiy va yoshlar bilan ishlash boʻyicha prorektor": {
    "uz": "Ma’naviy-ma’rifiy ishlar va yoshlar bilan ishlash bo‘yicha prorektor",
    "en": "Vice-Rector for Spiritual, Educational and Youth Affairs",
    "ru": "Проректор по духовно-просветительской работе и работе с молодежью"
  },
  "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari va farmoyishlari, Oliy Majlis va Vazirlar Mahkamasining ta’lim va kadrlar tayyorlash sohasidagi qarorlarini amalga oshirish; ma’naviy-ma’rifiy va tarbiya ishlarni tashkil etish; ta’lim qonunchiligining mohiyatini tushuntirish va vazifalarni amalga oshirish.": {
    "uz": "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari va farmoyishlari, Oliy Majlis va Vazirlar Mahkamasining ta’lim va kadrlar tayyorlash sohasidagi qarorlarini amalga oshirish; ma’naviy-ma’rifiy va tarbiya ishlarini tashkil etish; ta’lim qonunchiligining mohiyatini tushuntirish va vazifalarni bajarish.",
    "en": "Implementing the laws of the Republic of Uzbekistan, presidential decrees and orders, and decisions of the Oliy Majlis and the Cabinet of Ministers in education and personnel training; organizing spiritual, educational and upbringing work; explaining the essence of education legislation and fulfilling related tasks.",
    "ru": "Реализация законов Республики Узбекистан, указов и распоряжений Президента, решений Олий Мажлиса и Кабинета Министров в сфере образования и подготовки кадров; организация духовно-просветительской и воспитательной работы; разъяснение сути законодательства об образовании и выполнение соответствующих задач."
  },
  "Rektor yordamchisi": {
    "uz": "Rektor yordamchisi",
    "en": "Assistant to the Rector",
    "ru": "Помощник ректора"
  },
  "Oliy va o‘rta maxsus ta’lim vazirligi va universitet rahbariyati tomonidan zamonaviy talablarga muvofiq belgilanadigan axborot siyosatini shakllantirish va amalga oshirishda ishtirok etadi. Keng jamoatchilikni universitetning faoliyati to‘g‘risida xolisona, sifatli va tezkor xabardor qiladi.": {
    "uz": "Oliy va o‘rta maxsus ta’lim vazirligi hamda universitet rahbariyati tomonidan zamonaviy talablarga muvofiq belgilanadigan axborot siyosatini shakllantirish va amalga oshirishda ishtirok etadi. Keng jamoatchilikni universitet faoliyati to‘g‘risida xolis, sifatli va tezkor xabardor qiladi.",
    "en": "Participates in forming and implementing the information policy defined by the Ministry of Higher and Secondary Specialized Education and the university administration in line with modern requirements. Provides the public with objective, high-quality and timely information about the university’s activities.",
    "ru": "Участвует в формировании и реализации информационной политики, определяемой Министерством высшего и среднего специального образования и руководством университета в соответствии с современными требованиями. Оперативно, качественно и объективно информирует общественность о деятельности университета."
  },
  "Akademik ishlar bo‘yicha prorektori": {
    "uz": "Akademik ishlar bo‘yicha prorektor",
    "en": "Vice-Rector for Academic Affairs",
    "ru": "Проректор по академическим вопросам"
  },
  "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari, Oliy Majlis va Vazirlar Mahkamasining ta’lim va kadrlar tayyorlash sohasidagi qarorlarini amalga oshirishni tashkil etish, davlat ta’lim standartlari asosida o‘quv va o‘quv uslubiy ishlarni tashkil etish hamda malakali kadrlar tayyorlashni ta’minlash, mutasaddi yuqori tashkilotlarning buyruqlari, farmoyishlari va ko‘rsatmalari, o‘quv jarayoniga oid masalalar bo‘yicha Universitet kengashi qarorlari va rektor buyruqlarining bajarilishini ta’minlash, o‘quv jarayonida o‘qitishning ilg‘or shakllarini, shu jumladan masofadan turib o‘qitish, yangi pedagogik va axborot-kommunikatsiya texnologiyalarini joriy etish va ulardan foydalanishni tashkil etish va boshqalardan iborat.": {
    "uz": "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari, Oliy Majlis va Vazirlar Mahkamasining ta’lim va kadrlar tayyorlash sohasidagi qarorlarini amalga oshirishni tashkil etish; davlat ta’lim standartlari asosida o‘quv va o‘quv-uslubiy ishlarni yo‘lga qo‘yish hamda malakali kadrlar tayyorlashni ta’minlash; yuqori tashkilotlar buyruqlari, farmoyishlari, ko‘rsatmalari, Universitet kengashi qarorlari va rektor buyruqlari bajarilishini ta’minlash; o‘quv jarayoniga ilg‘or ta’lim shakllari, masofaviy ta’lim, yangi pedagogik va axborot-kommunikatsiya texnologiyalarini joriy etishdan iborat.",
    "en": "Organizing the implementation of laws of the Republic of Uzbekistan, presidential decrees and decisions of the Oliy Majlis and the Cabinet of Ministers in education and personnel training; organizing educational and methodological work based on state education standards and ensuring the training of qualified personnel; ensuring the fulfillment of orders and instructions of higher organizations, decisions of the University Council and orders of the rector; introducing advanced forms of teaching, including distance learning, new pedagogical and information-communication technologies into the educational process.",
    "ru": "Организация реализации законов Республики Узбекистан, указов Президента, решений Олий Мажлиса и Кабинета Министров в сфере образования и подготовки кадров; организация учебной и учебно-методической работы на основе государственных образовательных стандартов и обеспечение подготовки квалифицированных кадров; обеспечение исполнения приказов и указаний вышестоящих организаций, решений Совета университета и приказов ректора; внедрение передовых форм обучения, включая дистанционное обучение, новые педагогические и информационно-коммуникационные технологии."
  },
  "Rektorning talabalar orasida ma’naviy muhit barqarorligini ta’minlashga mas’ul maslahatchisi": {
    "uz": "Rektorning talabalar orasida ma’naviy muhit barqarorligini ta’minlashga mas’ul maslahatchisi",
    "en": "Rector’s adviser responsible for maintaining a stable spiritual environment among students",
    "ru": "Советник ректора, ответственный за стабильную духовную среду среди студентов"
  },
  "Talaba-yoshlar o‘rtasida ijtimoiy-ma’naviy muhit barqarorligini ta’minlash, ularni turli illatlar ta’siridan asrash ishlarini tashkil qiladi. Oʻquv jarayonini takomillashtirish, universitet yoshlari o‘rtasida sog‘lom muhit ustuvorligiga erishish borasida takliflar kiritadi va amalga oshirilishida bosh-qosh bo‘ladi.": {
    "uz": "Talaba-yoshlar o‘rtasida ijtimoiy-ma’naviy muhit barqarorligini ta’minlash, ularni turli illatlar ta’siridan asrash ishlarini tashkil qiladi. O‘quv jarayonini takomillashtirish va universitet yoshlari o‘rtasida sog‘lom muhit ustuvorligiga erishish bo‘yicha takliflar kiritadi hamda ularning amalga oshirilishida bosh-qosh bo‘ladi.",
    "en": "Organizes work to ensure a stable social and spiritual environment among students and protect them from harmful influences. Makes proposals to improve the educational process and strengthen a healthy environment among university youth, and supports their implementation.",
    "ru": "Организует работу по обеспечению стабильной социально-духовной среды среди студентов и защите их от вредных влияний. Вносит предложения по совершенствованию учебного процесса и укреплению здоровой среды среди молодежи университета, а также содействует их реализации."
  },
  "Qo'qon universiteti boshlang‘ich tashkilot yetakchisi": {
    "uz": "Qo‘qon universiteti boshlang‘ich tashkilot yetakchisi",
    "en": "Leader of Kokand University’s primary youth organization",
    "ru": "Лидер первичной организации Кокандского университета"
  },
  "“Qo‘qon universiteti boshlang‘ich tashkilot yetakchisi — talabalarning ijtimoiy faolligini oshirish, yoshlarni birlashtirish va universitet hayotida ularning tashabbuslarini qo‘llab-quvvatlashga xizmat qiluvchi mas’ul hamda yetakchi lavozim egasi.”": {
    "uz": "“Qo‘qon universiteti boshlang‘ich tashkilot yetakchisi — talabalarning ijtimoiy faolligini oshirish, yoshlarni birlashtirish va universitet hayotida ularning tashabbuslarini qo‘llab-quvvatlashga xizmat qiluvchi mas’ul hamda yetakchi lavozim egasi.”",
    "en": "“The leader of Kokand University’s primary organization is a responsible leadership role that helps increase students’ social activity, unite young people and support their initiatives in university life.”",
    "ru": "«Лидер первичной организации Кокандского университета — ответственная руководящая должность, направленная на повышение социальной активности студентов, объединение молодежи и поддержку их инициатив в жизни университета»."
  },
  "Ilmiy ishlar va innovatsiyalar boʻyicha prorektor": {
    "uz": "Ilmiy ishlar va innovatsiyalar bo‘yicha prorektor",
    "en": "Vice-Rector for Research and Innovation",
    "ru": "Проректор по научной работе и инновациям"
  },
  "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari va farmoyishlari, Oliy Majlis va Vazirlar Mahkamasining ilm-fan, innovatsion faoliyat, taʼlim hamda kadrlar tayyorlash sohasidagi qarorlarini amalga oshirishni tashkil etish; ilmiy tadqiqot faoliyatini muvofiqlashtirish; professor-o‘qituvchilarning ilmiy ishlarini nazorat qilish; xalqaro va respublika miqyosidagi ilmiy konferensiyalarni tashkil etish; ilmiy tadqiqot ishlari natijalarini amaliyotga joriy etish va boshqalar.": {
    "uz": "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari va farmoyishlari, Oliy Majlis va Vazirlar Mahkamasining ilm-fan, innovatsion faoliyat, ta’lim hamda kadrlar tayyorlash sohasidagi qarorlarini amalga oshirishni tashkil etish; ilmiy tadqiqot faoliyatini muvofiqlashtirish; professor-o‘qituvchilarning ilmiy ishlarini nazorat qilish; xalqaro va respublika miqyosidagi ilmiy konferensiyalarni tashkil etish; ilmiy tadqiqot ishlari natijalarini amaliyotga joriy etish va boshqalar.",
    "en": "Organizing the implementation of laws of the Republic of Uzbekistan, presidential decrees and decisions in science, innovation, education and personnel training; coordinating research activities; supervising the scientific work of faculty members; organizing international and national scientific conferences; applying research results in practice, and more.",
    "ru": "Организация реализации законов Республики Узбекистан, указов и распоряжений Президента, решений в сфере науки, инновационной деятельности, образования и подготовки кадров; координация научно-исследовательской деятельности; контроль научной работы профессорско-преподавательского состава; организация международных и республиканских научных конференций; внедрение результатов исследований в практику и другое."
  },
  "Learn more about our tutors": {
    "uz": "Tutorlarimiz haqida batafsil",
    "en": "Learn more about our tutors",
    "ru": "Подробнее о наших тьюторах"
  },
  "Personal Tutors": {
    "uz": "Shaxsiy tutorlar",
    "en": "Personal Tutors",
    "ru": "Персональные тьюторы"
  },
  "Your education - our expertise": {
    "uz": "Sizning ta’limingiz — bizning tajribamiz",
    "en": "Your education - our expertise",
    "ru": "Ваше образование — наша экспертиза"
  },
  "What is a Personal Tutor?": {
    "uz": "Shaxsiy tutor kim?",
    "en": "What is a Personal Tutor?",
    "ru": "Что такое персональный тьютор?"
  },
  "Kokand universitetidagi tutorim bilan haftalik uchrashuvlarim mustaqil o‘qishning erkinligi va mas’uliyatini yaxshiroq tushunishga yordam beradi. Men o‘qish jarayonimni o‘zim boshqaraman, lekin bu intizom va javobgarlikni talab qiladi. Tutorim esa menga yo‘nalish berib, maqsadlarimga erishishda qo‘llab-quvvatlaydi. Bu jarayon menga mustaqil fikrlash va o‘z ustimda ishlash ko‘nikmasini rivojlantiradi.": {
    "uz": "Kokand universitetidagi tutorim bilan haftalik uchrashuvlarim mustaqil o‘qishning erkinligi va mas’uliyatini yaxshiroq tushunishga yordam beradi. Men o‘qish jarayonimni o‘zim boshqaraman, lekin bu intizom va javobgarlikni talab qiladi. Tutorim esa menga yo‘nalish berib, maqsadlarimga erishishda qo‘llab-quvvatlaydi. Bu jarayon menga mustaqil fikrlash va o‘z ustimda ishlash ko‘nikmasini rivojlantiradi.",
    "en": "Weekly meetings with my tutor at Kokand University help me better understand the freedom and responsibility of independent study. I manage my own learning process, but it requires discipline and accountability. My tutor guides me and supports me in reaching my goals. This process develops my independent thinking and self-improvement skills.",
    "ru": "Еженедельные встречи с моим тьютором в Kokand University помогают мне лучше понять свободу и ответственность самостоятельного обучения. Я сам управляю своим учебным процессом, но это требует дисциплины и ответственности. Тьютор направляет меня и поддерживает в достижении целей. Этот процесс развивает самостоятельное мышление и навыки работы над собой."
  },
  "Learn more about our Personal Tutors and the wider academic support options available to students at Kokand university": {
    "uz": "Kokand University talabalari uchun shaxsiy tutorlar va akademik qo‘llab-quvvatlash imkoniyatlari haqida batafsil bilib oling",
    "en": "Learn more about our Personal Tutors and the wider academic support options available to students at Kokand university",
    "ru": "Узнайте больше о персональных тьюторах и возможностях академической поддержки для студентов Kokand University"
  },
  "IN UNCERTAIN TIMES, QUALITY COUNTS": {
    "uz": "NOANIQ DAVRDA SIFAT MUHIM",
    "en": "IN UNCERTAIN TIMES, QUALITY COUNTS",
    "ru": "В НЕОПРЕДЕЛЕННЫЕ ВРЕМЕНА КАЧЕСТВО ВАЖНО"
  },
  "Umummilliy AI Hackathon Farg‘ona | 2-kun 🏫 Farg‘ona shahrida bo'lib o'tayotgan Umummilliy AI Hackathonda Qo'qon universiteti talabalari ham faol ishtirok etib, o‘z innovatsion g‘oyalari va texnologik loyihalari bilan qatnashmoqdalar. 🏫 2-kun har bir jamoa o'z loyihalarini mentorlar va ekspertlarga taqdim etish uchun tayyorgarlik jarayonlarini olib bormoqda. Ishtirokchilar jamiyat va kelajak uchun muhim bo‘lgan yo‘nalishlarda AI asosidagi yechimlar ustida ishlashmoqda. Loyiha mavzulari: - Ta'lim sohasida AI platforma - Kasallikni erta aniqlash - Ta'lim jarayonlarida inklyuziv ta'limga muhtoz bo'lgan shaxslar uchun mobil dasturiy ta'minot 🎁 Eng yaxshi loyihalar qimmatbaho sovrinlar va maxsus nominatsiyalar bilan taqdirlanadi. Hackathon 23-may kuniga qadar davom etadi.": {
    "uz": "Umummilliy AI Hackathon Farg‘ona | 2-kun 🏫 Farg‘ona shahrida bo‘lib o‘tayotgan Umummilliy AI Hackathonda Qo‘qon universiteti talabalari ham faol ishtirok etib, o‘z innovatsion g‘oyalari va texnologik loyihalari bilan qatnashmoqdalar. 2-kun har bir jamoa o‘z loyihalarini mentorlar va ekspertlarga taqdim etishga tayyorgarlik ko‘rmoqda. Ishtirokchilar jamiyat va kelajak uchun muhim yo‘nalishlarda AI asosidagi yechimlar ustida ishlashmoqda. Loyiha mavzulari: ta’lim sohasida AI platforma, kasallikni erta aniqlash, inklyuziv ta’limga muhtoj shaxslar uchun mobil dasturiy ta’minot. Eng yaxshi loyihalar qimmatbaho sovrinlar va maxsus nominatsiyalar bilan taqdirlanadi. Hackathon 23-may kuniga qadar davom etadi.",
    "en": "National AI Hackathon Fergana | Day 2 🏫 Kokand University students are actively participating in the National AI Hackathon taking place in Fergana, presenting innovative ideas and technological projects. On day 2, each team is preparing to present its project to mentors and experts. Participants are working on AI-based solutions in areas important for society and the future. Project topics include: an AI platform for education, early disease detection, and mobile software for people who need inclusive education. The best projects will receive valuable prizes and special nominations. The hackathon continues until May 23.",
    "ru": "Национальный AI Hackathon Фергана | 2-й день 🏫 Студенты Кокандского университета активно участвуют в Национальном AI Hackathon в Фергане, представляя инновационные идеи и технологические проекты. Во второй день команды готовятся представить свои проекты наставникам и экспертам. Участники работают над AI-решениями в направлениях, важных для общества и будущего: AI-платформа для образования, раннее выявление заболеваний и мобильное приложение для людей, нуждающихся в инклюзивном образовании. Лучшие проекты будут отмечены ценными призами и специальными номинациями. Хакатон продолжается до 23 мая."
  },
  "Partnerships": {
    "uz": "Hamkorliklar",
    "en": "Partnerships",
    "ru": "Партнерства"
  },
  "Learning without boundaries.": {
    "uz": "Chegarasiz ta’lim.",
    "en": "Learning without boundaries.",
    "ru": "Обучение без границ."
  },
  "“Learning without boundaries” means gaining knowledge freely, without limits of place, time, or method. It encourages students to explore beyond the classroom, take responsibility for their own learning, and use different resources to grow independently. It is about curiosity, flexibility, and continuous self-development.": {
    "uz": "“Chegarasiz ta’lim” — joy, vaqt yoki uslub bilan cheklanmasdan erkin bilim olish demakdir. Bu talabalarning auditoriyadan tashqarida izlanishi, o‘z ta’limi uchun mas’uliyat olishi va turli resurslardan foydalanib mustaqil rivojlanishini rag‘batlantiradi. Bu qiziqish, moslashuvchanlik va uzluksiz o‘zini rivojlantirish haqidadir.",
    "en": "“Learning without boundaries” means gaining knowledge freely, without limits of place, time, or method. It encourages students to explore beyond the classroom, take responsibility for their own learning, and use different resources to grow independently. It is about curiosity, flexibility, and continuous self-development.",
    "ru": "«Обучение без границ» означает свободное получение знаний без ограничений места, времени или метода. Оно побуждает студентов выходить за рамки аудитории, брать ответственность за собственное обучение и использовать разные ресурсы для самостоятельного развития. Это про любознательность, гибкость и постоянное саморазвитие."
  },
  "Our students": {
    "uz": "Talabalarimiz",
    "en": "Our students",
    "ru": "Наши студенты"
  },
  "Trying to fit in? One size doesn’t fit all.": {
    "uz": "Moslashishga urinayapsizmi? Hamma uchun bitta qolip to‘g‘ri kelmaydi.",
    "en": "Trying to fit in? One size doesn’t fit all.",
    "ru": "Пытаетесь вписаться? Один подход не подходит всем."
  },
  "Arthur, one of the students at Greene’s, shares his plans and future aspirations.": {
    "uz": "Universitet talabalaridan biri o‘z rejalari va kelajakdagi orzulari bilan bo‘lishadi.",
    "en": "Arthur, one of the students at Greene’s, shares his plans and future aspirations.",
    "ru": "Артур, один из студентов Greene’s, делится своими планами и стремлениями на будущее."
  },
  "Lucia tells us about her experiences at Greene’s and how Greene’s help her achieving her academic and personal goals.": {
    "uz": "Talaba o‘z tajribasi va universitet unga akademik hamda shaxsiy maqsadlariga erishishda qanday yordam bergani haqida so‘zlab beradi.",
    "en": "Lucia tells us about her experiences at Greene’s and how Greene’s help her achieving her academic and personal goals.",
    "ru": "Лючия рассказывает о своем опыте в Greene’s и о том, как Greene’s помогает ей достигать академических и личных целей."
  },
  "What's On": {
    "uz": "Yangiliklar",
    "en": "What's On",
    "ru": "Афиша и новости"
  },
  "23-may 2026": {
    "uz": "23-may 2026",
    "en": "May 23, 2026",
    "ru": "23 мая 2026"
  },
  "Umummilliy AI Hackathon Farg‘ona | 2-kun": {
    "uz": "Umummilliy AI Hackathon Farg‘ona | 2-kun",
    "en": "National AI Hackathon Fergana | Day 2",
    "ru": "Национальный AI Hackathon Фергана | 2-й день"
  },
  "Is Taking a Gap Year a Good Idea?": {
    "uz": "Gap Year olish yaxshi fikrmi?",
    "en": "Is Taking a Gap Year a Good Idea?",
    "ru": "Gap Year — хорошая идея?"
  },
  "The Top 5 A level Retake FAQS": {
    "uz": "A level qayta topshirish bo‘yicha 5 ta asosiy savol",
    "en": "The Top 5 A level Retake FAQS",
    "ru": "Топ-5 вопросов о пересдаче A level"
  },
  "See all news": {
    "uz": "Barcha yangiliklar",
    "en": "See all news",
    "ru": "Все новости"
  },
  "You might be interested in": {
    "uz": "Sizni qiziqtirishi mumkin",
    "en": "You might be interested in",
    "ru": "Вас может заинтересовать"
  },
  "Courses": {
    "uz": "Kurslar",
    "en": "Courses",
    "ru": "Курсы"
  },
  "Close": {
    "uz": "Yopish",
    "en": "Close",
    "ru": "Закрыть"
  },
  "PROGRAMMER DAVRONOV OYBEK NORIDDIN OG'LI": {
    "uz": "DASTURCHI DAVRONOV OYBEK NORIDDIN O‘G‘LI",
    "en": "PROGRAMMER DAVRONOV OYBEK NORIDDIN OG'LI",
    "ru": "ПРОГРАММИСТ ДАВРОНОВ ОЙБЕК НОРИДДИН УГЛИ"
  },
  "KU Prospectus": {
    "uz": "KU prospekti",
    "en": "KU Prospectus",
    "ru": "Проспект KU"
  },
  "Create your personal prospectus by selecting your interests.": {
    "uz": "Qiziqishlaringizni tanlab, shaxsiy prospektingizni yarating.",
    "en": "Create your personal prospectus by selecting your interests.",
    "ru": "Создайте персональный проспект, выбрав свои интересы."
  },
  "The Story of KU": {
    "uz": "KU tarixi",
    "en": "The Story of KU",
    "ru": "История KU"
  },
  "Retaking A levels": {
    "uz": "A levels qayta topshirish",
    "en": "Retaking A levels",
    "ru": "Пересдача A levels"
  },
  "Academic Support Programme": {
    "uz": "Akademik qo‘llab-quvvatlash dasturi",
    "en": "Academic Support Programme",
    "ru": "Программа академической поддержки"
  },
  "University Preparation": {
    "uz": "Universitetga tayyorgarlik",
    "en": "University Preparation",
    "ru": "Подготовка к университету"
  },
  "University Applications": {
    "uz": "Universitetga arizalar",
    "en": "University Applications",
    "ru": "Поступление в университет"
  },
  "Interview preparation programme": {
    "uz": "Suhbatga tayyorgarlik dasturi",
    "en": "Interview preparation programme",
    "ru": "Программа подготовки к интервью"
  },
  "Going to the U.S.": {
    "uz": "AQSHga yo‘l",
    "en": "Going to the U.S.",
    "ru": "Поступление в США"
  },
  "Aptitude tests": {
    "uz": "Qobiliyat testlari",
    "en": "Aptitude tests",
    "ru": "Тесты способностей"
  },
  "Short Courses": {
    "uz": "Qisqa kurslar",
    "en": "Short Courses",
    "ru": "Краткосрочные курсы"
  },
  "Exams centre": {
    "uz": "Imtihon markazi",
    "en": "Exams centre",
    "ru": "Экзаменационный центр"
  },
  "Science practicals": {
    "uz": "Fan amaliyotlari",
    "en": "Science practicals",
    "ru": "Практические занятия по наукам"
  },
  "Online Tuition": {
    "uz": "Onlayn ta’lim",
    "en": "Online Tuition",
    "ru": "Онлайн-обучение"
  },
  "Athletes at KU": {
    "uz": "KU sportchilari",
    "en": "Athletes at KU",
    "ru": "Спортсмены KU"
  },
  "International students": {
    "uz": "Xalqaro talabalar",
    "en": "International students",
    "ru": "Иностранные студенты"
  },
  "Educational agents": {
    "uz": "Ta’lim agentlari",
    "en": "Educational agents",
    "ru": "Образовательные агенты"
  },
  "This link will take you to KU International": {
    "uz": "Bu havola sizni KU International sahifasiga olib boradi",
    "en": "This link will take you to KU International",
    "ru": "Эта ссылка перенаправит вас на KU International"
  },
  "Proceed": {
    "uz": "Davom etish",
    "en": "Proceed",
    "ru": "Продолжить"
  },
  "Download Form": {
    "uz": "Formani yuklab olish",
    "en": "Download Form",
    "ru": "Скачать форму"
  },
  "Name": {
    "uz": "Ism",
    "en": "Name",
    "ru": "Имя"
  },
  "E-mail": {
    "uz": "E-mail",
    "en": "E-mail",
    "ru": "Эл. почта"
  },
  "This field is hidden when viewing the form": {
    "uz": "Forma ko‘rilganda bu maydon yashiriladi",
    "en": "This field is hidden when viewing the form",
    "ru": "Это поле скрыто при просмотре формы"
  },
  "Redirect URL": {
    "uz": "Yo‘naltirish URL manzili",
    "en": "Redirect URL",
    "ru": "URL перенаправления"
  },
  "(Required)": {
    "uz": "(Majburiy)",
    "en": "(Required)",
    "ru": "(Обязательно)"
  },
  "CAPTCHA": {
    "uz": "CAPTCHA",
    "en": "CAPTCHA",
    "ru": "CAPTCHA"
  },
  "We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking “Accept”, you consent to the use of ALL the cookies. However you may visit Cookie Settings to provide a controlled consent.": {
    "uz": "Saytimizda sizning afzalliklaringizni eslab qolish va tajribangizni yaxshilash uchun cookie-fayllardan foydalanamiz. “Qabul qilish” tugmasini bosish orqali barcha cookie-fayllardan foydalanishga rozilik bildirasiz. Biroq cookie sozlamalariga kirib, rozilikni boshqarishingiz mumkin.",
    "en": "We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking “Accept”, you consent to the use of ALL the cookies. However you may visit Cookie Settings to provide a controlled consent.",
    "ru": "Мы используем cookie-файлы, чтобы запоминать ваши предпочтения и улучшать опыт посещения сайта. Нажимая «Принять», вы соглашаетесь на использование всех cookie. Вы также можете открыть настройки cookie и управлять согласием."
  },
  "Read More": {
    "uz": "Batafsil",
    "en": "Read More",
    "ru": "Подробнее"
  },
  "Cookie settings": {
    "uz": "Cookie sozlamalari",
    "en": "Cookie settings",
    "ru": "Настройки cookie"
  },
  "ACCEPT": {
    "uz": "QABUL QILISH",
    "en": "ACCEPT",
    "ru": "ПРИНЯТЬ"
  },
  "Manage consent": {
    "uz": "Rozilikni boshqarish",
    "en": "Manage consent",
    "ru": "Управление согласием"
  },
  "Privacy Overview": {
    "uz": "Maxfiylik haqida umumiy ma’lumot",
    "en": "Privacy Overview",
    "ru": "Обзор конфиденциальности"
  },
  "This website uses cookies to improve your experience while you navigate through the website. Out of these cookies, the cookies that are categorized as necessary are stored on your browser as they are essential for the working of basic functionalities of the website. We also use third-party cookies that help us analyze and understand how you use this website. These cookies will be stored in your browser only with your consent. You also have the option to opt-out of these cookies. But opting out of some of these cookies may have an effect on your browsing experience.": {
    "uz": "Ushbu sayt ko‘rish tajribangizni yaxshilash uchun cookie-fayllardan foydalanadi. Zarur cookie-fayllar brauzeringizda saqlanadi, chunki ular saytning asosiy funksiyalari ishlashi uchun kerak. Shuningdek, saytimizdan qanday foydalanishingizni tahlil qilishga yordam beradigan uchinchi tomon cookie-fayllaridan ham foydalanamiz. Bu cookie-fayllar faqat roziligingiz bilan brauzeringizda saqlanadi. Siz ulardan voz kechishingiz mumkin, ammo ayrim cookie-fayllarni o‘chirish sayt tajribasiga ta’sir qilishi mumkin.",
    "en": "This website uses cookies to improve your experience while you navigate through the website. Out of these cookies, the cookies that are categorized as necessary are stored on your browser as they are essential for the working of basic functionalities of the website. We also use third-party cookies that help us analyze and understand how you use this website. These cookies will be stored in your browser only with your consent. You also have the option to opt-out of these cookies. But opting out of some of these cookies may have an effect on your browsing experience.",
    "ru": "Этот сайт использует cookie-файлы, чтобы улучшить ваш опыт просмотра. Необходимые cookie сохраняются в браузере, так как они нужны для работы базовых функций сайта. Мы также используем сторонние cookie, которые помогают анализировать и понимать, как вы пользуетесь сайтом. Эти cookie будут сохранены в браузере только с вашего согласия. Вы можете отказаться от них, но отключение некоторых cookie может повлиять на работу сайта."
  },
  "Necessary": {
    "uz": "Zarur",
    "en": "Necessary",
    "ru": "Необходимые"
  },
  "Always Enabled": {
    "uz": "Doim yoqilgan",
    "en": "Always Enabled",
    "ru": "Всегда включены"
  },
  "Necessary cookies are absolutely essential for the website to function properly. These cookies ensure basic functionalities and security features of the website, anonymously.": {
    "uz": "Zarur cookie-fayllar saytning to‘g‘ri ishlashi uchun mutlaqo kerak. Ular saytning asosiy funksiyalari va xavfsizlik imkoniyatlarini anonim tarzda ta’minlaydi.",
    "en": "Necessary cookies are absolutely essential for the website to function properly. These cookies ensure basic functionalities and security features of the website, anonymously.",
    "ru": "Необходимые cookie абсолютно важны для правильной работы сайта. Они анонимно обеспечивают базовые функции и функции безопасности сайта."
  },
  "Cookie": {
    "uz": "Cookie",
    "en": "Cookie",
    "ru": "Cookie"
  },
  "Duration": {
    "uz": "Muddati",
    "en": "Duration",
    "ru": "Срок"
  },
  "Description": {
    "uz": "Tavsif",
    "en": "Description",
    "ru": "Описание"
  },
  "1 year": {
    "uz": "1 yil",
    "en": "1 year",
    "ru": "1 год"
  },
  "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Advertisement\" category .": {
    "uz": "GDPR Cookie Consent plagini tomonidan o‘rnatiladi; bu cookie “Reklama” toifasidagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun ishlatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Advertisement\" category .",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent и используется для записи согласия пользователя на cookie категории «Реклама»."
  },
  "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Analytics\" category .": {
    "uz": "GDPR Cookie Consent plagini tomonidan o‘rnatiladi; bu cookie “Analitika” toifasidagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun ishlatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Analytics\" category .",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent и используется для записи согласия пользователя на cookie категории «Аналитика»."
  },
  "The cookie is set by the GDPR Cookie Consent plugin to record the user consent for the cookies in the category \"Functional\".": {
    "uz": "Bu cookie GDPR Cookie Consent plagini tomonidan “Funksional” toifadagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun o‘rnatiladi.",
    "en": "The cookie is set by the GDPR Cookie Consent plugin to record the user consent for the cookies in the category \"Functional\".",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent для записи согласия пользователя на cookie категории «Функциональные»."
  },
  "Set by the GDPR Cookie Consent plugin to record the user consent for the cookies in the \"Necessary\" category .": {
    "uz": "GDPR Cookie Consent plagini tomonidan “Zarur” toifadagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun o‘rnatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin to record the user consent for the cookies in the \"Necessary\" category .",
    "ru": "Устанавливается плагином GDPR Cookie Consent для записи согласия пользователя на cookie категории «Необходимые»."
  },
  "Set by the GDPR Cookie Consent plugin, this cookie is used to store the user consent for cookies in the category \"Others\".": {
    "uz": "GDPR Cookie Consent plagini tomonidan o‘rnatiladi; bu cookie “Boshqalar” toifasidagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun ishlatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin, this cookie is used to store the user consent for cookies in the category \"Others\".",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent и хранит согласие пользователя на cookie категории «Другие»."
  },
  "Set by the GDPR Cookie Consent plugin, this cookie is used to store the user consent for cookies in the category \"Performance\".": {
    "uz": "GDPR Cookie Consent plagini tomonidan o‘rnatiladi; bu cookie “Ishlash samaradorligi” toifasidagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun ishlatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin, this cookie is used to store the user consent for cookies in the category \"Performance\".",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent и хранит согласие пользователя на cookie категории «Производительность»."
  },
  "session": {
    "uz": "sessiya",
    "en": "session",
    "ru": "сессия"
  },
  "Zoho sets this cookie for website security when a request is sent to campaigns.": {
    "uz": "Kampaniyalarga so‘rov yuborilganda sayt xavfsizligi uchun bu cookie Zoho tomonidan o‘rnatiladi.",
    "en": "Zoho sets this cookie for website security when a request is sent to campaigns.",
    "ru": "Zoho устанавливает этот cookie для безопасности сайта при отправке запроса в кампании."
  },
  "Functional": {
    "uz": "Funksional",
    "en": "Functional",
    "ru": "Функциональные"
  },
  "functional": {
    "uz": "funksional",
    "en": "functional",
    "ru": "функциональные"
  },
  "Functional cookies help to perform certain functionalities like sharing the content of the website on social media platforms, collect feedbacks, and other third-party features.": {
    "uz": "Funksional cookie-fayllar sayt kontentini ijtimoiy tarmoqlarda ulashish, fikr-mulohaza yig‘ish va boshqa uchinchi tomon imkoniyatlarini bajarishga yordam beradi.",
    "en": "Functional cookies help to perform certain functionalities like sharing the content of the website on social media platforms, collect feedbacks, and other third-party features.",
    "ru": "Функциональные cookie помогают выполнять такие функции, как публикация контента сайта в социальных сетях, сбор отзывов и другие сторонние возможности."
  },
  "Zoho sets this cookie for the login function on the website.": {
    "uz": "Zoho bu cookie-faylni saytdagi kirish funksiyasi uchun o‘rnatadi.",
    "en": "Zoho sets this cookie for the login function on the website.",
    "ru": "Zoho устанавливает этот cookie для функции входа на сайт."
  },
  "Performance": {
    "uz": "Samaradorlik",
    "en": "Performance",
    "ru": "Производительность"
  },
  "performance": {
    "uz": "samaradorlik",
    "en": "performance",
    "ru": "производительность"
  },
  "Performance cookies are used to understand and analyze the key performance indexes of the website which helps in delivering a better user experience for the visitors.": {
    "uz": "Samaradorlik cookie-fayllari saytning asosiy ishlash ko‘rsatkichlarini tushunish va tahlil qilish uchun ishlatiladi hamda tashrif buyuruvchilar tajribasini yaxshilashga yordam beradi.",
    "en": "Performance cookies are used to understand and analyze the key performance indexes of the website which helps in delivering a better user experience for the visitors.",
    "ru": "Cookie производительности используются для понимания и анализа ключевых показателей работы сайта, что помогает улучшать опыт посетителей."
  },
  "Analytics": {
    "uz": "Analitika",
    "en": "Analytics",
    "ru": "Аналитика"
  },
  "analytics": {
    "uz": "analitika",
    "en": "analytics",
    "ru": "аналитика"
  },
  "Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics the number of visitors, bounce rate, traffic source, etc.": {
    "uz": "Analitik cookie-fayllar tashrif buyuruvchilar sayt bilan qanday o‘zaro aloqada bo‘lishini tushunish uchun ishlatiladi. Ular tashriflar soni, chiqib ketish darajasi, trafik manbai kabi ko‘rsatkichlar haqida ma’lumot beradi.",
    "en": "Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics the number of visitors, bounce rate, traffic source, etc.",
    "ru": "Аналитические cookie используются для понимания того, как посетители взаимодействуют с сайтом. Они помогают получать данные о количестве посетителей, показателе отказов, источнике трафика и других метриках."
  },
  "2 years": {
    "uz": "2 yil",
    "en": "2 years",
    "ru": "2 года"
  },
  "The _ga cookie, installed by Google Analytics, calculates visitor, session and campaign data and also keeps track of site usage for the site's analytics report. The cookie stores information anonymously and assigns a randomly generated number to recognize unique visitors.": {
    "uz": "Google Analytics o‘rnatadigan _ga cookie tashrif buyuruvchi, sessiya va kampaniya ma’lumotlarini hisoblaydi hamda sayt tahliliy hisobotlari uchun foydalanishni kuzatadi. Cookie ma’lumotlarni anonim saqlaydi va noyob tashrif buyuruvchilarni aniqlash uchun tasodifiy raqam beradi.",
    "en": "The _ga cookie, installed by Google Analytics, calculates visitor, session and campaign data and also keeps track of site usage for the site's analytics report. The cookie stores information anonymously and assigns a randomly generated number to recognize unique visitors.",
    "ru": "Cookie _ga, установленный Google Analytics, рассчитывает данные посетителей, сессий и кампаний, а также отслеживает использование сайта для аналитических отчетов. Cookie хранит информацию анонимно и присваивает случайный номер для распознавания уникальных посетителей."
  },
  "1 minute": {
    "uz": "1 daqiqa",
    "en": "1 minute",
    "ru": "1 минута"
  },
  "Set by Google to distinguish users.": {
    "uz": "Foydalanuvchilarni farqlash uchun Google tomonidan o‘rnatiladi.",
    "en": "Set by Google to distinguish users.",
    "ru": "Устанавливается Google для различения пользователей."
  },
  "1 day": {
    "uz": "1 kun",
    "en": "1 day",
    "ru": "1 день"
  },
  "Installed by Google Analytics, _gid cookie stores information on how visitors use a website, while also creating an analytics report of the website's performance. Some of the data that are collected include the number of visitors, their source, and the pages they visit anonymously.": {
    "uz": "Google Analytics tomonidan o‘rnatiladigan _gid cookie tashrif buyuruvchilar saytni qanday ishlatishi haqida ma’lumot saqlaydi va sayt ishlashi bo‘yicha tahliliy hisobot yaratishga yordam beradi. Yig‘iladigan ma’lumotlarga tashriflar soni, manbasi va anonim ko‘rilgan sahifalar kiradi.",
    "en": "Installed by Google Analytics, _gid cookie stores information on how visitors use a website, while also creating an analytics report of the website's performance. Some of the data that are collected include the number of visitors, their source, and the pages they visit anonymously.",
    "ru": "Cookie _gid, установленный Google Analytics, хранит информацию о том, как посетители используют сайт, и помогает формировать аналитический отчет о работе сайта. Среди собираемых данных — количество посетителей, источник и анонимно посещенные страницы."
  },
  "YouTube sets this cookie via embedded youtube-videos and registers anonymous statistical data.": {
    "uz": "YouTube bu cookie-faylni joylashtirilgan videolar orqali o‘rnatadi va anonim statistik ma’lumotlarni qayd etadi.",
    "en": "YouTube sets this cookie via embedded youtube-videos and registers anonymous statistical data.",
    "ru": "YouTube устанавливает этот cookie через встроенные видео и регистрирует анонимные статистические данные."
  },
  "Advertisement": {
    "uz": "Reklama",
    "en": "Advertisement",
    "ru": "Реклама"
  },
  "advertisement": {
    "uz": "reklama",
    "en": "advertisement",
    "ru": "реклама"
  },
  "Advertisement cookies are used to provide visitors with relevant ads and marketing campaigns. These cookies track visitors across websites and collect information to provide customized ads.": {
    "uz": "Reklama cookie-fayllari tashrif buyuruvchilarga mos reklamalar va marketing kampaniyalarini ko‘rsatish uchun ishlatiladi. Ular foydalanuvchilarni turli saytlar bo‘ylab kuzatib, moslashtirilgan reklama uchun ma’lumot yig‘adi.",
    "en": "Advertisement cookies are used to provide visitors with relevant ads and marketing campaigns. These cookies track visitors across websites and collect information to provide customized ads.",
    "ru": "Рекламные cookie используются для показа посетителям релевантной рекламы и маркетинговых кампаний. Они отслеживают посетителей на разных сайтах и собирают данные для персонализированной рекламы."
  },
  "5 months 27 days": {
    "uz": "5 oy 27 kun",
    "en": "5 months 27 days",
    "ru": "5 месяцев 27 дней"
  },
  "A cookie set by YouTube to measure bandwidth that determines whether the user gets the new or old player interface.": {
    "uz": "YouTube tomonidan o‘rnatiladigan bu cookie tarmoq o‘tkazuvchanligini o‘lchaydi va foydalanuvchiga yangi yoki eski player interfeysi ko‘rsatilishini aniqlaydi.",
    "en": "A cookie set by YouTube to measure bandwidth that determines whether the user gets the new or old player interface.",
    "ru": "Cookie, установленный YouTube для измерения пропускной способности и определения, будет ли пользователь видеть новый или старый интерфейс плеера."
  },
  "YSC cookie is set by Youtube and is used to track the views of embedded videos on Youtube pages.": {
    "uz": "YSC cookie YouTube tomonidan o‘rnatiladi va YouTube sahifalaridagi joylashtirilgan videolar ko‘rilishini kuzatish uchun ishlatiladi.",
    "en": "YSC cookie is set by Youtube and is used to track the views of embedded videos on Youtube pages.",
    "ru": "Cookie YSC устанавливается YouTube и используется для отслеживания просмотров встроенных видео на страницах YouTube."
  },
  "never": {
    "uz": "hech qachon",
    "en": "never",
    "ru": "никогда"
  },
  "YouTube sets this cookie to store the video preferences of the user using embedded YouTube video.": {
    "uz": "YouTube bu cookie-faylni joylashtirilgan video orqali foydalanuvchining video sozlamalarini saqlash uchun o‘rnatadi.",
    "en": "YouTube sets this cookie to store the video preferences of the user using embedded YouTube video.",
    "ru": "YouTube устанавливает этот cookie для хранения видеонастроек пользователя при использовании встроенного видео."
  },
  "This cookie, set by YouTube, registers a unique ID to store data on what videos from YouTube the user has seen.": {
    "uz": "YouTube tomonidan o‘rnatiladigan bu cookie foydalanuvchi YouTube’da ko‘rgan videolar haqidagi ma’lumotlarni saqlash uchun noyob ID qayd etadi.",
    "en": "This cookie, set by YouTube, registers a unique ID to store data on what videos from YouTube the user has seen.",
    "ru": "Этот cookie, установленный YouTube, регистрирует уникальный ID для хранения данных о том, какие видео YouTube пользователь посмотрел."
  },
  "Others": {
    "uz": "Boshqalar",
    "en": "Others",
    "ru": "Другие"
  },
  "others": {
    "uz": "boshqalar",
    "en": "others",
    "ru": "другие"
  },
  "Other uncategorized cookies are those that are being analyzed and have not been classified into a category as yet.": {
    "uz": "Boshqa tasniflanmagan cookie-fayllar hozir tahlil qilinayotgan va hali hech bir toifaga kiritilmagan cookie-fayllardir.",
    "en": "Other uncategorized cookies are those that are being analyzed and have not been classified into a category as yet.",
    "ru": "Другие неклассифицированные cookie — это cookie, которые анализируются и еще не отнесены ни к одной категории."
  },
  "No description available.": {
    "uz": "Tavsif mavjud emas.",
    "en": "No description available.",
    "ru": "Описание недоступно."
  },
  "2 hours": {
    "uz": "2 soat",
    "en": "2 hours",
    "ru": "2 часа"
  },
  "13 hours": {
    "uz": "13 soat",
    "en": "13 hours",
    "ru": "13 часов"
  },
  "No description": {
    "uz": "Tavsif yo‘q",
    "en": "No description",
    "ru": "Нет описания"
  },
  "30 minutes": {
    "uz": "30 daqiqa",
    "en": "30 minutes",
    "ru": "30 минут"
  },
  "Save & Accept": {
    "uz": "Saqlash va qabul qilish",
    "en": "Save & Accept",
    "ru": "Сохранить и принять"
  },
  "Powered by": {
    "uz": "Tomonidan quvvatlanadi",
    "en": "Powered by",
    "ru": "Работает на"
  },
  "09 Jun 2025": {
    "uz": "09-iyun 2025",
    "en": "09 Jun 2025",
    "ru": "09 июня 2025"
  },
  "06 Feb 2023": {
    "uz": "06-fevral 2023",
    "en": "06 Feb 2023",
    "ru": "06 февраля 2023"
  },
  "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Necessary\" category .": {
    "uz": "GDPR Cookie Consent plagini tomonidan o‘rnatiladi; bu cookie “Zarur” toifadagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun ishlatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Necessary\" category .",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent и используется для записи согласия пользователя на cookie категории «Необходимые»."
  },
  "Google Tag Manager (noscript)": {
    "uz": "Google Tag Manager (noscript)",
    "en": "Google Tag Manager (noscript)",
    "ru": "Google Tag Manager (noscript)"
  },
  "End Google Tag Manager (noscript)": {
    "uz": "End Google Tag Manager (noscript)",
    "en": "End Google Tag Manager (noscript)",
    "ru": "End Google Tag Manager (noscript)"
  },
  "begin Moneypenny code": {
    "uz": "begin Moneypenny code",
    "en": "begin Moneypenny code",
    "ru": "begin Moneypenny code"
  },
  "end Moneypenny code": {
    "uz": "end Moneypenny code",
    "en": "end Moneypenny code",
    "ru": "end Moneypenny code"
  },
  "Custom Feeds for Instagram JS": {
    "uz": "Instagram JS uchun maxsus lentalar",
    "en": "Custom Feeds for Instagram JS",
    "ru": "Пользовательские ленты Instagram JS"
  },
  "googleoff: all": {
    "uz": "googleoff: all",
    "en": "googleoff: all",
    "ru": "googleoff: all"
  },
  "googleon: all": {
    "uz": "googleon: all",
    "en": "googleon: all",
    "ru": "googleon: all"
  }
};
  var textSources = new WeakMap();
  var applying = false;
  var scheduled = false;

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function getInitialLanguage() {
    try {
      var saved = window.localStorage.getItem('greenes_language');
      if (saved && SUPPORTED_LANGUAGES[saved]) return saved;
    } catch (error) {}
    return DEFAULT_LANGUAGE;
  }

  function translate(source, lang) {
    var key = normalize(source);
    if (!key) return source;
    var entry = TRANSLATIONS[key];
    if (!entry) return source;
    return entry[lang] || entry.en || source;
  }

  function preserveWhitespace(original, replacement) {
    var start = (String(original).match(/^\s*/) || [''])[0];
    var end = (String(original).match(/\s*$/) || [''])[0];
    return start + replacement + end;
  }

  function isIgnored(node) {
    var element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    if (!element) return true;
    return Boolean(element.closest('script, style, noscript, svg, .ku-language-switcher, [data-no-translate]'));
  }

  function rememberTextNode(node, force) {
    if (!node || node.nodeType !== Node.TEXT_NODE || isIgnored(node)) return;
    var value = normalize(node.nodeValue);
    if (!value) return;
    if (force || !textSources.has(node)) textSources.set(node, value);
  }

  function walkTextNodes(root, callback) {
    if (!root || isIgnored(root)) return;
    if (root.nodeType === Node.TEXT_NODE) {
      callback(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (isIgnored(node) || !normalize(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node;
    while ((node = walker.nextNode())) callback(node);
  }

  function applyTextTranslations(root) {
    var lang = window.GreenesLanguage || getInitialLanguage();
    applying = true;
    try {
      walkTextNodes(root || document.body, function (node) {
        rememberTextNode(node, false);
        var source = textSources.get(node);
        var translated = translate(source, lang);
        if (normalize(node.nodeValue) !== normalize(translated)) {
          node.nodeValue = preserveWhitespace(node.nodeValue, translated);
        }
      });
      applyAttributeTranslations(lang);
      document.documentElement.setAttribute('lang', lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-GB');
      updateSwitcher(lang);
    } finally {
      setTimeout(function () { applying = false; }, 0);
    }
  }

  function applyAttributeTranslations(lang) {
    ['placeholder', 'aria-label', 'title', 'alt', 'value'].forEach(function (attr) {
      document.querySelectorAll('[' + attr + ']').forEach(function (el) {
        if (isIgnored(el)) return;
        if (attr === 'value' && !/^(button|submit|reset)$/i.test(el.type || '')) return;
        var originalAttr = 'data-i18n-original-' + attr;
        if (!el.hasAttribute(originalAttr)) el.setAttribute(originalAttr, el.getAttribute(attr) || '');
        var original = el.getAttribute(originalAttr) || '';
        var translated = translate(original, lang);
        if (translated !== original || TRANSLATIONS[normalize(original)]) el.setAttribute(attr, translated);
      });
    });
    var titleSource = document.querySelector('title');
    if (titleSource) {
      if (!titleSource.dataset.i18nOriginal) titleSource.dataset.i18nOriginal = titleSource.textContent;
      titleSource.textContent = translate(titleSource.dataset.i18nOriginal, lang);
    }
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      applyTextTranslations(document.body);
    });
  }

  function buildSwitcher() {
    var wrapper = document.querySelector('.ku-language-switcher');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'ku-language-switcher';
      wrapper.setAttribute('aria-label', 'Language selector');
      wrapper.setAttribute('data-no-translate', 'true');
      wrapper.innerHTML = '<span class="ku-language-switcher__label">Til</span>' +
        Object.keys(SUPPORTED_LANGUAGES).map(function (lang) {
          return '<button type="button" data-lang="' + lang + '" title="' + LANGUAGE_NAMES[lang] + '">' + SUPPORTED_LANGUAGES[lang] + '</button>';
        }).join('');
      document.body.appendChild(wrapper);
    }
    wrapper.style.display = 'inline-flex';
    wrapper.style.visibility = 'visible';
    wrapper.style.removeProperty('opacity');
    if (wrapper.dataset.bound === 'true') return;
    wrapper.dataset.bound = 'true';
    wrapper.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-lang]');
      if (!button) return;
      setLanguage(button.getAttribute('data-lang'));
    });
  }

  function updateSwitcher(lang) {
    document.querySelectorAll('.ku-language-switcher button[data-lang]').forEach(function (button) {
      var active = button.getAttribute('data-lang') === lang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      // Inline fallback styles are updated too, so it works even if CSS is cached or not loaded.
      button.style.background = active ? 'rgba(255, 255, 255, 0.34)' : 'transparent';
      button.style.color = active ? 'rgba(0, 0, 0, 0.92)' : 'rgba(22, 22, 22, 0.74)';
    });
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES[lang]) return;
    window.GreenesLanguage = lang;
    try { window.localStorage.setItem('greenes_language', lang); } catch (error) {}
    applyTextTranslations(document.body);
  }

  function observeDynamicContent() {
    var observer = new MutationObserver(function (mutations) {
      if (applying) return;
      mutations.forEach(function (mutation) {
        if (mutation.type === 'characterData') rememberTextNode(mutation.target, true);
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function (node) { walkTextNodes(node, function (textNode) { rememberTextNode(textNode, true); }); });
        }
      });
      scheduleApply();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  window.GreenesSetLanguage = setLanguage;
  window.GreenesLanguage = getInitialLanguage();

  /**
   * Admin paneldan kiritilgan kontentning avto-tarjimalarini lug'atga qo'shadi.
   * Format: { "uz matn": { en, ru } }. Shundan keyin dinamik kontent (yangilik,
   * hikoya va h.k.) ham til almashtirilganda avtomatik tarjima qilinadi.
   */
  window.GreenesAddTranslations = function (dict) {
    if (!dict || typeof dict !== 'object') return;
    var changed = false;
    Object.keys(dict).forEach(function (uz) {
      var key = normalize(uz);
      if (!key) return;
      var v = dict[uz] || {};
      TRANSLATIONS[key] = { uz: uz, en: v.en || uz, ru: v.ru || uz };
      changed = true;
    });
    if (changed) applyTextTranslations(document.body);
  };

  function loadContentTranslations() {
    try {
      fetch('/api/public/i18n').then(function (r) { return r.json(); }).then(function (d) {
        if (d && d.ok && d.dict) window.GreenesAddTranslations(d.dict);
      }).catch(function () {});
    } catch (e) { /* noop */ }
  }

  function init() {
    buildSwitcher();
    walkTextNodes(document.body, function (node) { rememberTextNode(node, false); });
    applyTextTranslations(document.body);
    observeDynamicContent();
    loadContentTranslations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
