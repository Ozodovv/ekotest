# EkoTest — Render'ga joylash (bosqichma-bosqich)

Natija: sayt `https://ekotest-xxxx.onrender.com` ko'rinishidagi ochiq manzilda ishlaydi, ma'lumotlar saqlanadi, admin panel ishlaydi. Hammasi bepul.

Kerak bo'ladi: elektron pochta va 20 daqiqa. Kompyuterga hech narsa o'rnatish shart emas.

## 1-qadam. Zip'ni oching
Bu zip'ni kompyuterda oching (o'ng tugma → "Extract all" / "Ochish"). Ichida `ekotest` papkasi chiqadi.

## 2-qadam. GitHub'ga yuklang
1. https://github.com da bepul hisob oching (bor bo'lsa, kiring).
2. O'ng yuqoridagi **+** → **New repository**.
3. Repository name: `ekotest`. **Public** yoki **Private** (ikkalasi ham bo'ladi). **Create repository**.
4. Ochilgan sahifada **uploading an existing file** havolasini bosing.
5. `ekotest` papkasi **ichidagi** hamma narsani (papkaning o'zini emas) sudrab tashlang:
   `public`, `data` (ichidagi `questions_more.js` bilan), `server.js`, `package.json`, `package-lock.json`, `render.yaml`, `.gitignore`, `README.md` va boshqalar.
   `github-pages` papkasi kerak emas, tashlamasangiz ham bo'ladi.
6. Pastdagi **Commit changes** tugmasini bosing.
Tekshiring: repo ildizida `server.js` va `package.json` ko'rinib turishi kerak.

## 3-qadam. Doimiy baza (Neon) — ma'lumotlar o'chmasligi uchun
1. https://neon.com da hisob oching (GitHub orqali kirsangiz ham bo'ladi).
2. **Create project** → nom bering → yarating.
3. **Connection string** ni nusxalang. U `postgresql://...` bilan boshlanadi. Parolni ko'rsatuvchi **Show password** yoqilgan holatda nusxalang.
Bu qatorni hech kimga bermang.

## 4-qadam. Render'da saytni yarating
1. https://render.com da hisob oching (GitHub orqali kirish qulay) va GitHub'ga `ekotest` repo'siga ruxsat bering.
2. **New +** → **Web Service** → GitHub repo'ingiz `ekotest` ni tanlang.
3. Sozlamalar:
   - Name: `ekotest`
   - Language / Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance type: **Free**
4. **Environment Variables** bo'limida qo'shing:
   | Nomi | Qiymati |
   |---|---|
   | `ADMIN_LOGIN` | o'zingiz tanlagan login |
   | `ADMIN_PASS` | kuchli parol (kamida 12 belgi) |
   | `ADMIN_PATH` | `/boshqaruv-x7k2` (yoki o'zingiz o'ylab topgan yashirin manzil) |
   | `DATABASE_URL` | 3-qadamdagi Neon qatori |
   Ixtiyoriy: `PER_TOPIC` — har mavzudan nechta savol tushishi (standart 2).
5. **Create Web Service** ni bosing. 3–5 daqiqada "Your service is live" chiqadi.

## 5-qadam. Ochiq manzil
Render sahifasi tepasida manzil turadi: `https://ekotest-xxxx.onrender.com`.
- Shu havolani do'stlaringizga yuboring, ular ro'yxatdan o'tib test ishlaydi.
- Admin panel: `https://ekotest-xxxx.onrender.com/boshqaruv-x7k2` (login va parol 4-qadamdagi). Bosh sahifada admin havolasi yo'q.

## 6-qadam. Tekshiring
1. Saytni oching, viloyat va tumanlar chiqishini ko'ring. Bosh sahifada 11 mavzu ko'rinishi kerak.
   `https://ekotest-xxxx.onrender.com/healthz` ochilsa "ok" chiqadi.
2. O'zingiz ro'yxatdan o'tib testni ishlang (22 ta savol).
3. Admin panelga kiring: ro'yxatdan o'tganlar soni 1 bo'lishi kerak.
4. Render'da **Manual Deploy → Restart** qiling va admin panelni qayta oching. Ma'lumot saqlangan bo'lsa, baza to'g'ri ulangan.

## Muhim eslatmalar
- Bepul tarifda sayt 15 daqiqa ishlatilmasa uxlaydi. Birinchi ochilish taxminan 1 daqiqa oladi. Do'stlaringizga oldindan ayting.
- `DATABASE_URL` kiritilmasa, ro'yxatdan o'tganlar server qayta ishga tushganda o'chib ketadi.
- `ADMIN_PASS` ni 4-qadamda albatta o'zingiz kiriting. Kiritilmasa, server tasodifiy parol yaratadi (Render → Logs bo'limida ko'rinadi).
- Admin sahifasiga 15 daqiqada 8 martadan ko'p noto'g'ri urinish bloklanadi; sessiya 12 soat amal qiladi.
- Saytni o'zgartirsangiz: GitHub'da faylni yangilang, Render o'zi qayta joylaydi.
- Chiroyli domen (masalan ekotest.uz) keyinroq Render → Settings → Custom Domains orqali ulanadi.

## Variant: faqat GitHub Pages (serversiz)
`github-pages/` papkasini repo ildiziga yuklab, Settings → Pages → Deploy from branch → main / root. Bunda admin panel va umumiy statistika ishlamaydi, natijalar faqat foydalanuvchining o'z brauzerida qoladi.
