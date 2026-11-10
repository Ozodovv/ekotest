const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const TOPICS = require("./data/questions");
const REGIONS = require("./data/regions");
const LESSONS = require("./data/lessons");
const YOL = require("./public/yol.js");

// ---- Sozlamalar (Render'da Environment bo'limidan beriladi) ----
const PORT = process.env.PORT || 3000;
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin";
// Parol berilmasa, tasodifiy parol yaratiladi va logda ko'rsatiladi (standart ochiq parol YO'Q).
let ADMIN_PASS = process.env.ADMIN_PASS;
if (!ADMIN_PASS) {
  ADMIN_PASS = crypto.randomBytes(9).toString("base64url");
  console.warn(`DIQQAT: ADMIN_PASS berilmagan. Vaqtinchalik parol: ${ADMIN_PASS}  (Environment'da ADMIN_PASS ni o'rnating)`);
}
// Yashirin manzil: boshida "/" bo'lishi shart, noto'g'ri yozilsa o'zimiz to'g'rilaymiz.
let ADMIN_PATH = (process.env.ADMIN_PATH || "/boshqaruv-x7k2").trim();
if (!ADMIN_PATH.startsWith("/")) ADMIN_PATH = "/" + ADMIN_PATH;
ADMIN_PATH = ADMIN_PATH.replace(/\/+$/, "") || "/boshqaruv-x7k2"; // oxiridagi "/" admin sahifasidagi nisbiy havolalarni buzardi
const DB_FILE = path.join(__dirname, "data", "db.json");
const PER_TOPIC = Math.max(1, Number(process.env.PER_TOPIC) || 2); // daraja testida har mavzudan nechta savol tushadi
const QUIZ_N = Math.max(3, Number(process.env.QUIZ_N) || 8);       // mavzu oxiridagi testda nechta savol tushadi
const ONLINE_MS = 45000;          // shu vaqt ichida "ping" bergan foydalanuvchi onlayn hisoblanadi
const SESSION_MS = 12 * 3600e3;   // admin sessiyasi 12 soat
const MAX_USERS = 200000;         // bazaning haddan oshib ketishidan himoya

// ---- Saqlash: DATABASE_URL bo'lsa Postgres (doimiy), bo'lmasa lokal fayl ----
let db = { users: [], results: [] };
let pool = null;
if (process.env.DATABASE_URL) {
  const { Pool } = require("pg");
  // Neon qatoridagi ?sslmode=...&channel_binding=... qismi bizning ssl sozlamamizni bekor qilmasligi uchun olib tashlanadi.
  let cs = process.env.DATABASE_URL.trim().replace(/^["']|["']$/g, "");
  try { const u = new URL(cs); ["sslmode", "channel_binding", "uselibpqcompat"].forEach((k) => u.searchParams.delete(k)); cs = u.toString(); } catch (e) { console.error("DATABASE_URL noto'g'ri ko'rinishda (postgresql://... bo'lishi kerak)."); }
  const local = /@(localhost|127\.0\.0\.1)[:\/]/.test(cs);
  pool = new Pool({ connectionString: cs, ssl: local ? false : { rejectUnauthorized: false }, max: 4, connectionTimeoutMillis: 15000, idleTimeoutMillis: 30000 });
  pool.on("error", (e) => console.error("Baza ulanish xatosi:", e.message)); // bu bo'lmasa, uzilganda server qulab tushardi
}
async function load() {
  if (pool) {
    for (let i = 1; ; i++) { // Neon bepul bazasi uxlab qolgan bo'lishi mumkin: bir necha marta urinamiz
      try {
        await pool.query("CREATE TABLE IF NOT EXISTS store (k text PRIMARY KEY, v jsonb NOT NULL)");
        const r = await pool.query("SELECT v FROM store WHERE k='db'");
        if (r.rows[0]) db = r.rows[0].v;
        break;
      } catch (e) {
        if (i >= 5) throw e;
        console.warn(`Bazaga ulanilmadi (${i}/5): ${e.message}. Qayta urinilmoqda...`);
        await new Promise((ok) => setTimeout(ok, 3000 * i));
      }
    }
  } else if (fs.existsSync(DB_FILE)) {
    try { db = JSON.parse(fs.readFileSync(DB_FILE, "utf8")); } catch (e) { console.error("db.json o'qilmadi, bo'sh baza bilan boshlandi:", e.message); }
  }
  db.users ||= []; db.results ||= [];
}
let saving = Promise.resolve();
const save = () => {
  if (!pool) { try { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); } catch (e) { console.error("Saqlash xatosi:", e.message); } return; }
  const snap = JSON.stringify(db);
  saving = saving.then(() => pool.query("INSERT INTO store(k,v) VALUES('db',$1) ON CONFLICT (k) DO UPDATE SET v=$1", [snap])).catch((e) => console.error("Saqlash xatosi:", e.message));
};

const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const levelOf = YOL.levelOf;
const TOPIC_LIST = TOPICS.map((t) => ({ id: t.id, nom: t.nom }));
const pathOf = (u) => YOL.buildPath(TOPIC_LIST, u.placement ? u.placement.mavzuStat : null, u.progress);
const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();
const safeEq = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));

const quizzes = new Map();    // attemptId -> mavzu testi (to'g'ri javoblar serverda)
const attempts = new Map();   // attemptId -> to'g'ri javoblar (serverda saqlanadi, brauzerga yuborilmaydi)
const lastSeen = new Map();   // userId -> vaqt
const sessions = new Map();   // admin token -> tugash vaqti
const userIndex = new Map(db.users.map((u) => [u.id, u])); // tezkor qidiruv (qayta to'ldiriladi)

// ---- Oddiy cheklov (rate limit): spam va parol terishdan himoya ----
// Eslatma: bitta maktab/sinf odatda BITTA IP orqali kiradi, shuning uchun limitlar o'quvchilar sonini hisobga olib baland qo'yilgan.
// Parol terishdan himoya (login) esa qattiq: 15 daqiqada 8 ta.
const hits = new Map();
function limit(name, max, windowMs) {
  return (req, res, next) => {
    const k = name + ":" + req.ip, now = Date.now();
    const h = hits.get(k) && hits.get(k).t > now ? hits.get(k) : { n: 0, t: now + windowMs };
    h.n++; hits.set(k, h);
    if (h.n > max) return res.status(429).json({ xato: "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring." });
    next();
  };
}
setInterval(() => {
  const now = Date.now();
  for (const [k, h] of hits) if (h.t < now) hits.delete(k);
  for (const [k, t] of sessions) if (t < now) sessions.delete(k);
  for (const [k, t] of lastSeen) if (now - t > 3600e3) lastSeen.delete(k);
}, 60000).unref();

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", process.env.TRUST_PROXY === undefined ? 1 : (isNaN(Number(process.env.TRUST_PROXY)) ? process.env.TRUST_PROXY : Number(process.env.TRUST_PROXY)));
app.use(express.json({ limit: "20kb" }));

// Xavfsizlik sarlavhalari
app.use((req, res, next) => {
  res.set({ "X-Content-Type-Options": "nosniff", "Referrer-Policy": "same-origin", "X-Frame-Options": "DENY" });
  next();
});

app.get("/healthz", (_, res) => res.send("ok"));

// CORS faqat CORS_ORIGIN berilganda yoqiladi (GitHub Pages bilan ishlatish uchun). Aks holda kerak emas.
if (process.env.CORS_ORIGIN) {
  app.use((req, res, next) => {
    res.set({ "Access-Control-Allow-Origin": process.env.CORS_ORIGIN, "Access-Control-Allow-Headers": "Content-Type, x-admin-token", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", Vary: "Origin" });
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });
}

// ---- SEO: robots.txt va sitemap.xml (yashirin admin manzili bu yerda KO'RSATILMAYDI) ----
const baseUrl = (req) => (process.env.SITE_URL || `${req.headers["x-forwarded-proto"] || req.protocol}://${req.get("host")}`).replace(/\/$/, "");
app.get("/robots.txt", (req, res) => res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /test.html\nDisallow: /learn.html\nDisallow: /dars.html\nSitemap: ${baseUrl(req)}/sitemap.xml\n`));
app.get("/sitemap.xml", (req, res) => res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${baseUrl(req)}/</loc></url></urlset>`));

// maxAge yo'q: brauzer har safar tekshiradi (ETag), shunda yangilangan fayllar darrov ko'rinadi
app.use(express.static(path.join(__dirname, "public"), { index: "index.html" }));

// ---- Foydalanuvchi API ----
app.get("/api/regions", (_, res) => res.set("Cache-Control", "public, max-age=3600").json(REGIONS));

const clean = (v, max) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

app.post("/api/register", limit("reg", 400, 3600e3), (req, res) => {
  const b = req.body || {};
  const ism = clean(b.ism, 40), familya = clean(b.familya, 40), maktab = clean(b.maktab, 80);
  const viloyat = clean(b.viloyat, 60), tuman = clean(b.tuman, 60);
  if (![ism, familya, viloyat, tuman, maktab].every(Boolean)) return res.status(400).json({ xato: "Barcha maydonlarni to'ldiring." });
  if (!REGIONS[viloyat] || !REGIONS[viloyat].includes(tuman)) return res.status(400).json({ xato: "Viloyat yoki tuman noto'g'ri tanlangan." });
  if (db.users.length >= MAX_USERS) return res.status(503).json({ xato: "Hozircha ro'yxatga olish to'xtatilgan." });
  const user = { id: crypto.randomUUID(), ism, familya, viloyat, tuman, maktab, sana: new Date().toISOString() };
  db.users.push(user); userIndex.set(user.id, user); save(); lastSeen.set(user.id, Date.now());
  res.json({ userId: user.id });
});

app.get("/api/test/:userId", limit("test", 800, 3600e3), (req, res) => {
  if (!userIndex.has(req.params.userId)) return res.status(404).json({ xato: "Foydalanuvchi topilmadi." });
  const key = {}; const savollar = []; const mavzular = {};
  for (const t of TOPICS) {
    mavzular[t.id] = t.nom;
    for (const s of shuffle(t.savollar).slice(0, PER_TOPIC)) {
      const variantlar = shuffle(s.o);
      const id = crypto.randomUUID();
      key[id] = { mavzu: t.id, togriMatn: s.o[s.t] };
      savollar.push({ id, mavzu: t.nom, q: s.q, variantlar });
    }
  }
  const attemptId = crypto.randomUUID(); attempts.set(attemptId, key);
  if (attempts.size > 5000) attempts.delete(attempts.keys().next().value); // xotira to'lib ketmasligi uchun
  res.set("Cache-Control", "no-store").json({ attemptId, mavzular, savollar: shuffle(savollar) });
});

app.post("/api/submit", limit("submit", 800, 3600e3), (req, res) => {
  const { userId, attemptId, javoblar } = req.body || {};
  const key = attempts.get(attemptId);
  if (!key || !userIndex.has(userId)) return res.status(400).json({ xato: "Test muddati tugagan yoki so'rov noto'g'ri. Sahifani yangilab, qayta urinib ko'ring." });
  attempts.delete(attemptId);
  const ans = javoblar && typeof javoblar === "object" ? javoblar : {};
  let togri = 0; const mavzuStat = {};
  for (const [qid, info] of Object.entries(key)) {
    mavzuStat[info.mavzu] ??= { jami: 0, togri: 0 };
    mavzuStat[info.mavzu].jami++;
    if (ans[qid] === info.togriMatn) { togri++; mavzuStat[info.mavzu].togri++; }
  }
  const jami = Object.keys(key).length, foiz = Math.round((togri / jami) * 100);
  const natija = { userId, tur: "daraja", sana: new Date().toISOString(), togri, jami, foiz, daraja: levelOf(foiz), mavzuStat };
  db.results.push(natija);
  userIndex.get(userId).placement = { sana: natija.sana, togri, jami, foiz, daraja: natija.daraja, mavzuStat };
  save();
  res.json(natija);
});


// ---- O'quv yo'li: daraja testidan keyin darslar va har dars oxirida test ----
app.get("/api/me/:userId", limit("me", 4000, 3600e3), (req, res) => {
  const u = userIndex.get(req.params.userId);
  if (!u) return res.status(404).json({ xato: "Foydalanuvchi topilmadi." });
  lastSeen.set(u.id, Date.now());
  const yol = pathOf(u);
  res.set("Cache-Control", "no-store").json({
    ism: u.ism, placement: u.placement || null, yol,
    tugagan: yol.filter((x) => x.holat === "tugagan").length, jami: yol.length, pass: YOL.PASS,
    daraja: YOL.currentLevel(u.placement, u.progress),
  });
});

const lessonGate = (req, res) => {
  const u = userIndex.get(req.params.userId), tid = req.params.topicId;
  if (!u) { res.status(404).json({ xato: "Foydalanuvchi topilmadi." }); return null; }
  const t = TOPICS.find((x) => x.id === tid);
  if (!t || !LESSONS[tid]) { res.status(404).json({ xato: "Mavzu topilmadi." }); return null; }
  if (!u.placement) { res.status(409).json({ xato: "Avval daraja testini topshiring.", daraja: true }); return null; }
  const holat = pathOf(u).find((x) => x.id === tid)?.holat;
  if (holat === "yopiq") { res.status(403).json({ xato: "Bu mavzu hali yopiq. Avval oldingi mavzu testidan o'ting." }); return null; }
  return { u, t };
};

app.get("/api/dars/:userId/:topicId", limit("dars", 4000, 3600e3), (req, res) => {
  const g = lessonGate(req, res); if (!g) return;
  res.set("Cache-Control", "no-store").json({ id: g.t.id, nom: g.t.nom, dars: LESSONS[g.t.id], savol: g.t.savollar.length });
});

app.get("/api/quiz/:userId/:topicId", limit("quiz", 2000, 3600e3), (req, res) => {
  const g = lessonGate(req, res); if (!g) return;
  const key = {}; const savollar = [];
  for (const s of shuffle(g.t.savollar).slice(0, QUIZ_N)) {
    const id = crypto.randomUUID();
    key[id] = { togriMatn: s.o[s.t], javob: null };
    savollar.push({ id, q: s.q, variantlar: shuffle(s.o) });
  }
  const attemptId = crypto.randomUUID();
  quizzes.set(attemptId, { userId: g.u.id, mavzu: g.t.id, key });
  if (quizzes.size > 5000) quizzes.delete(quizzes.keys().next().value);
  res.set("Cache-Control", "no-store").json({ attemptId, nom: g.t.nom, pass: YOL.PASS, savollar });
});

// Har javobdan keyin darhol "to'g'ri / noto'g'ri" ko'rsatish uchun. Javob bir marta qabul qilinadi.
app.post("/api/quiz/check", limit("qcheck", 30000, 3600e3), (req, res) => {
  const { attemptId, qid, javob } = req.body || {};
  const a = quizzes.get(attemptId), k = a && a.key[qid];
  if (!k || typeof javob !== "string") return res.status(400).json({ xato: "So'rov noto'g'ri." });
  if (k.javob === null) k.javob = javob;
  res.json({ togri: k.javob === k.togriMatn, togriMatn: k.togriMatn, tanlangan: k.javob });
});

app.post("/api/quiz/finish", limit("qfinish", 2000, 3600e3), (req, res) => {
  const { attemptId } = req.body || {};
  const a = quizzes.get(attemptId), u = a && userIndex.get(a.userId);
  if (!a || !u) return res.status(400).json({ xato: "Test muddati tugagan. Sahifani yangilab, qayta urinib ko'ring." });
  quizzes.delete(attemptId);
  const jami = Object.keys(a.key).length, togri = Object.values(a.key).filter((k) => k.javob === k.togriMatn).length;
  const foiz = Math.round((togri / jami) * 100), otdi = foiz >= YOL.PASS;
  u.progress ||= {};
  const p = u.progress[a.mavzu] ||= { eng: 0, urinish: 0, otdi: false };
  p.urinish++; p.eng = Math.max(p.eng, foiz); p.otdi = p.otdi || otdi; p.sana = new Date().toISOString();
  db.results.push({ userId: u.id, tur: "mavzu", mavzu: a.mavzu, sana: p.sana, togri, jami, foiz });
  save();
  const yol = pathOf(u);
  const keyingi = yol.find((x) => x.holat === "ochiq")?.id || null;
  res.json({ togri, jami, foiz, otdi, pass: YOL.PASS, keyingi, tugagan: yol.filter((x) => x.holat === "tugagan").length, jami_mavzu: yol.length, daraja: YOL.currentLevel(u.placement, u.progress) });
});

app.post("/api/ping", limit("ping", 40000, 3600e3), (req, res) => {
  const id = req.body?.userId;
  if (typeof id === "string" && userIndex.has(id)) lastSeen.set(id, Date.now());
  res.end();
});

// ---- Admin ----
// admin.html ommaviy papkada EMAS (private/), shuning uchun faqat yashirin manzil orqali ochiladi.
const ADMIN_HTML = fs.readFileSync(path.join(__dirname, "private", "admin.html"), "utf8").replace("<head>", '<head><base href="/">'); // yashirin manzil ichma-ich bo'lsa ham style.css/api.js topiladi
app.get(ADMIN_PATH, (_, res) => res.set({ "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" }).type("html").send(ADMIN_HTML));

app.post("/api/admin/login", limit("login", 8, 15 * 60e3), (req, res) => {
  const { login, parol } = req.body || {};
  if (typeof login === "string" && typeof parol === "string" && safeEq(login, ADMIN_LOGIN) && safeEq(parol, ADMIN_PASS)) {
    const token = crypto.randomBytes(24).toString("hex"); sessions.set(token, Date.now() + SESSION_MS);
    return res.json({ token });
  }
  res.status(401).json({ xato: "Login yoki parol noto'g'ri." });
});

const adminOnly = (req, res, next) => {
  const exp = sessions.get(req.headers["x-admin-token"]);
  if (exp && exp > Date.now()) return next();
  res.status(401).json({ xato: "Ruxsat yo'q." });
};

app.get("/api/admin/stats", adminOnly, (_, res) => {
  const now = Date.now();
  const online = [...lastSeen.values()].filter((t) => now - t < ONLINE_MS).length;
  const soni = new Map();
  db.results.forEach((r) => soni.set(r.userId, (soni.get(r.userId) || 0) + 1));
  const foydalanuvchilar = db.users.map((u) => {
    const tugagan = Object.values(u.progress || {}).filter((p) => p.otdi).length;
    const { placement, progress, ...ochiq } = u;
    return { ...ochiq, daraja: YOL.currentLevel(placement, progress) || "Test topshirmagan", foiz: placement ? placement.foiz : null, testlar: soni.get(u.id) || 0, tugagan, jamiMavzu: TOPICS.length };
  }).reverse();
  res.set("Cache-Control", "no-store").json({ jamiFoydalanuvchi: db.users.length, jamiTest: db.results.length, online, foydalanuvchilar });
});

// API uchun mavjud bo'lmagan manzil / xato -> JSON
app.use("/api", (_, res) => res.status(404).json({ xato: "Topilmadi." }));
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") return res.status(400).json({ xato: "So'rov noto'g'ri." });
  console.error(err);
  res.status(500).json({ xato: "Server xatosi." });
});

load().then(() => {
  db.users.forEach((u) => userIndex.set(u.id, u));
  const server = app.listen(PORT, () => console.log(`Sayt: http://localhost:${PORT}\nAdmin: http://localhost:${PORT}${ADMIN_PATH}`));
  // Render serverni qayta ishga tushirganda (SIGTERM) oxirgi ma'lumotlar yo'qolmasligi uchun
  for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, async () => { server.close(); try { await saving; } catch (e) {} process.exit(0); });
}).catch((e) => { console.error("Ishga tushmadi:", e.message); process.exit(1); });
