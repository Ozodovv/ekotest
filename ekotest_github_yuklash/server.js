const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const TOPICS = require("./data/questions");
const REGIONS = require("./data/regions");

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
const DB_FILE = path.join(__dirname, "data", "db.json");
const PER_TOPIC = Math.max(1, Number(process.env.PER_TOPIC) || 2); // har mavzudan nechta savol tushadi
const ONLINE_MS = 45000;          // shu vaqt ichida "ping" bergan foydalanuvchi onlayn hisoblanadi
const SESSION_MS = 12 * 3600e3;   // admin sessiyasi 12 soat
const MAX_USERS = 200000;         // bazaning haddan oshib ketishidan himoya

// ---- Saqlash: DATABASE_URL bo'lsa Postgres (doimiy), bo'lmasa lokal fayl ----
let db = { users: [], results: [] };
let pool = null;
if (process.env.DATABASE_URL) {
  const { Pool } = require("pg");
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 4 });
  pool.on("error", (e) => console.error("Baza ulanish xatosi:", e.message)); // bu bo'lmasa, uzilganda server qulab tushardi
}
async function load() {
  if (pool) {
    await pool.query("CREATE TABLE IF NOT EXISTS store (k text PRIMARY KEY, v jsonb NOT NULL)");
    const r = await pool.query("SELECT v FROM store WHERE k='db'");
    if (r.rows[0]) db = r.rows[0].v;
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
const levelOf = (p) => (p >= 85 ? "Yuqori" : p >= 60 ? "O'rta" : "Boshlang'ich");
const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();
const safeEq = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));

const attempts = new Map();   // attemptId -> to'g'ri javoblar (serverda saqlanadi, brauzerga yuborilmaydi)
const lastSeen = new Map();   // userId -> vaqt
const sessions = new Map();   // admin token -> tugash vaqti
const userIndex = new Map(db.users.map((u) => [u.id, u])); // tezkor qidiruv (qayta to'ldiriladi)

// ---- Oddiy cheklov (rate limit): spam va parol terishdan himoya ----
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
app.set("trust proxy", 1);
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
app.get("/robots.txt", (req, res) => res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /test.html\nSitemap: ${baseUrl(req)}/sitemap.xml\n`));
app.get("/sitemap.xml", (req, res) => res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${baseUrl(req)}/</loc></url></urlset>`));

app.use(express.static(path.join(__dirname, "public"), { maxAge: "1h", index: "index.html" }));

// ---- Foydalanuvchi API ----
app.get("/api/regions", (_, res) => res.set("Cache-Control", "public, max-age=3600").json(REGIONS));

const clean = (v, max) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

app.post("/api/register", limit("reg", 30, 3600e3), (req, res) => {
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

app.get("/api/test/:userId", limit("test", 60, 3600e3), (req, res) => {
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

app.post("/api/submit", limit("submit", 60, 3600e3), (req, res) => {
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
  const natija = { userId, sana: new Date().toISOString(), togri, jami, foiz, daraja: levelOf(foiz), mavzuStat };
  db.results.push(natija); save();
  res.json(natija);
});

app.post("/api/ping", limit("ping", 600, 3600e3), (req, res) => {
  const id = req.body?.userId;
  if (typeof id === "string" && userIndex.has(id)) lastSeen.set(id, Date.now());
  res.end();
});

// ---- Admin ----
// admin.html ommaviy papkada EMAS (private/), shuning uchun faqat yashirin manzil orqali ochiladi.
app.get(ADMIN_PATH, (_, res) => res.set({ "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" }).sendFile(path.join(__dirname, "private", "admin.html")));

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
  const oxirgi = new Map(), soni = new Map();
  db.results.forEach((r) => { oxirgi.set(r.userId, r); soni.set(r.userId, (soni.get(r.userId) || 0) + 1); });
  const foydalanuvchilar = db.users.map((u) => {
    const r = oxirgi.get(u.id);
    return { ...u, daraja: r?.daraja || "Test topshirmagan", foiz: r?.foiz ?? null, testlar: soni.get(u.id) || 0 };
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
  process.on("SIGTERM", async () => { server.close(); try { await saving; } catch (e) {} process.exit(0); });
}).catch((e) => { console.error("Ishga tushmadi:", e.message); process.exit(1); });
