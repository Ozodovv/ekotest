# EkoTest

## Ishga tushirish
1. Node.js 18+ o'rnating (https://nodejs.org)
2. Papkada: `npm install` so'ng `npm start`
3. Sayt: http://localhost:3000
4. Admin paneli (bosh sahifada havola YO'Q): http://localhost:3000/boshqaruv-x7k2
   - Login/parol: `ADMIN_LOGIN` (standart `admin`) va `ADMIN_PASS` muhit o'zgaruvchilari. `ADMIN_PASS` berilmasa, server ishga tushganda tasodifiy parol yaratib logda ko'rsatadi.
   - Mahalliy ishga tushirish: `ADMIN_PASS=ozparolingiz npm start`

## O'quv oqimi (Englify uslubida)
1. **Ro'yxatdan o'tish** (ism, familya, viloyat, tuman, maktab) -> `index.html`
2. **Daraja testi** (22 savol, har mavzudan 2 ta) -> `test.html`. Daraja: Boshlang'ich (<60%), O'rta (60-84%), Yuqori (85%+).
3. **Mening yo'lim** -> `learn.html`. 11 mavzu daraja testi natijasiga ko'ra tartiblanadi: xato qilingan mavzular birinchi ("Tavsiya"), to'liq to'g'ri javob berilganlari oxirida. Mavzular ketma-ket ochiladi.
4. **Dars** -> `dars.html?t=<mavzu>`: darslik matni, "Esda tuting" xulosasi.
5. **Mavzu testi** (dars oxirida, 8 savol, har javobdan keyin darhol to'g'ri/noto'g'ri ko'rsatiladi). O'tish bali 70%. O'tmasa, darsni qayta o'qib, testni qayta ishlash mumkin (savollar har safar o'zgaradi). O'tsa, keyingi mavzu ochiladi.
6. Joriy daraja: kamida 3 mavzu tugagach, mavzu testlari o'rtachasiga ko'ra yangilanadi.

Foydalanuvchi qurilmasida `localStorage` orqali eslab qolinadi, qayta kirganda "Davom etish" chiqadi.

## Sozlamalar (muhit o'zgaruvchilari)
- `PER_TOPIC` - daraja testida mavzudan nechta savol (standart 2)
- `QUIZ_N` - mavzu oxiridagi testda nechta savol (standart 8)
- O'tish bali: `public/yol.js` ichidagi `PASS` (standart 70)

## Fayllar
- `data/lessons.js` - darsliklar (mavzu id'lari `questions.js` dagi bilan bir xil). Dars qo'shish/tahrirlash shu yerda.
- `data/questions.js`, `data/questions_more.js` - savollar (har mavzuda 31-43 ta). Format: `[savol, TO'G'RI javob, xato1, xato2, xato3]`.
- `public/yol.js` - yo'l tartibi va daraja mantig'i (server ham, GitHub Pages rejimi ham shuni ishlatadi).
- Ma'lumotlar `data/db.json` (yoki `DATABASE_URL` bo'lsa Postgres) da saqlanadi: foydalanuvchi, daraja testi natijasi, mavzular bo'yicha progress.
- Admin: foydalanuvchilar jadvaliga "Mavzular (tugatilgan/jami)" ustuni qo'shildi, CSV ga ham chiqadi.

## Qilinishi kerak
- Darsliklar matnini o'qituvchi/mutaxassis ko'rib chiqib, kengaytirishi kerak (hozir har mavzuda 3-4 bo'lim). Savollar darslik matniga to'liq moslab tekshirilmagan.
- Sinflar bo'yicha bo'lish (5-9-sinf va h.k.), rasm/video/diagramma darslarda
- Parol bilan kirish (hozir foydalanuvchi faqat qurilmasida eslab qolinadi; boshqa qurilmada qayta ro'yxatdan o'tiladi)
- To'liq maktablar bazasi (`data/regions.js`), ko'p tillilik (o'zbek/rus/ingliz)
- Admin: grafiklar, Excel eksport, savollarni tahrirlash, foydalanuvchini o'chirish
- Parolni heshlash, HTTPS, doimiy baza (Neon), dizayn sayqali, telefonda sinov

## Bepul joylashtirish (Render.com) va Google
1. github.com da bepul hisob oching, yangi repo yarating va shu papkani yuklang (node_modules siz).
2. render.com da hisob oching -> New -> Web Service -> GitHub repo ni tanlang (render.yaml o'zi sozlaydi).
3. ADMIN_PASS ni o'zingiz kuchli parol qilib kiriting.
4. Manzil chiqadi: https://ekotest-xxxx.onrender.com
5. Google: search.google.com/search-console -> "URL prefix" -> manzilni kiriting -> tasdiqlang -> Sitemaps bo'limiga `sitemap.xml` yozing.
OGOHLANTIRISH (bepul tarif): sayt 15 daqiqa ishlatilmasa uxlaydi (birinchi ochilish ~1 daqiqa),
va ma'lumotlar fayli (data/db.json) qayta ishga tushganda O'CHADI. Doimiy saqlash uchun bazaga o'tish kerak.

## Doimiy baza (bepul) — Neon.com
1. neon.com da bepul hisob oching -> yangi project yarating.
2. "Connection string" ni nusxalang (postgresql://... ko'rinishida).
3. Render -> Environment -> DATABASE_URL nomi bilan shu qatorni kiriting (hech kimga yubormang).
4. Qayta ishga tushganda ham ma'lumotlar saqlanib qoladi.

## GitHub Pages (github.io, bepul domen)
1. `node build-pages.js` — `github-pages/` papkasi yaratiladi (serversiz rejim; viloyat/tumanlar ichiga joylangan).
2. `github-pages/` ichidagi fayllarni GitHub repo ildiziga yuklang (Settings -> Pages -> Deploy from branch -> main / root).
3. Sayt: https://FOYDALANUVCHI.github.io/REPO/
Serverli variant: `node build-pages.js https://ekotest-xxxx.onrender.com` (Render'da CORS_ORIGIN ni github.io manziliga qo'ying).
