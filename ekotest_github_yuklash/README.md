# EkoTest

## Ishga tushirish
1. Node.js 18+ o'rnating (https://nodejs.org)
2. Papkada: `npm install` so'ng `npm start`
3. Sayt: http://localhost:3000
4. Admin paneli (bosh sahifada havola YO'Q): http://localhost:3000/boshqaruv-x7k2
   - Login/parol: `ADMIN_LOGIN` (standart `admin`) va `ADMIN_PASS` muhit o'zgaruvchilari. `ADMIN_PASS` berilmasa, server ishga tushganda tasodifiy parol yaratib logda ko'rsatadi.
   - Mahalliy ishga tushirish: `ADMIN_PASS=ozparolingiz npm start`

## Nima qilindi
- Ro'yxatdan o'tish: ism, familya, viloyat, tuman, maktab
- Test: 11 ta mavzu (jami 390+ savol), har mavzudan 2 tadan tasodifiy savol = 22 ta savol; variantlar tartibi ham tasodifiy.
  Mavzudan nechta savol tushishi: `PER_TOPIC` muhit o'zgaruvchisi (standart 2).
- Yangi mavzu/savol qo'shish: `data/questions_more.js` (format: `[savol, TO'G'RI javob, xato1, xato2, xato3]`).
- Daraja avtomatik: Boshlang'ich (<60%), O'rta (60-84%), Yuqori (85%+), mavzular bo'yicha natija
- To'g'ri javoblar serverda saqlanadi (brauzerda ko'rinmaydi)
- Admin: login/parol orqali kirish, onlayn soni, foydalanuvchilar soni, testlar soni, foydalanuvchilar jadvali
- Ma'lumotlar `data/db.json` faylida saqlanadi

## Qilinishi kerak (qolgan ~90%)
- To'liq viloyat/tuman/shahar/maktablar bazasi (`data/regions.js`)
- Har mavzuda 30-50 savol, mavzularni sinf bo'yicha kengaytirish
- Ekologiya darsliklari (o'qish bo'limi) va har bo'lim oxirida test (til darsliklari kabi)
- O'rganilgan mavzular hisobi, darajani bir nechta test asosida aniqlash
- Admin: statistika grafiklari, filtr/qidiruv, Excel eksport, savollarni tahrirlash, foydalanuvchini o'chirish
- Haqiqiy ma'lumotlar bazasi (PostgreSQL/SQLite), parolni heshlash, HTTPS, hosting
- Dizayn sayqali, ko'p tillilik (o'zbek/rus/ingliz), telefon uchun sinov

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
