// Yagona API qatlami: server rejimi yoki lokal (GitHub Pages) rejimi
(function () {
  const C = window.EKO || { mode: "server", API_URL: "" };
  const BASE = (C.API_URL || "").replace(/\/$/, "");
  const local = C.mode === "local" && !BASE;
  const J = { "Content-Type": "application/json" };
  const ls = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
  const PER_TOPIC = 2, QUIZ_N = 8;
  const attempts = {}, quizzes = {};
  const levelOf = (p) => (p >= 85 ? "Yuqori" : p >= 60 ? "O'rta" : "Boshlang'ich");
  // 25 soniyada javob kelmasa so'rov bekor qilinadi (sahifa abadiy "yuklanmoqda" da qotib qolmasligi uchun) va sahifadagi xato xabari chiqadi
  const req = async (path, opt) => {
    const ac = typeof AbortController !== "undefined" ? new AbortController() : null;
    const tm = ac ? setTimeout(() => ac.abort(), 25000) : 0;
    try { const r = await fetch(BASE + path, Object.assign({}, opt, ac ? { signal: ac.signal } : {})); let d = {}; try { d = await r.json(); } catch (e) {} return { ok: r.ok, d }; }
    finally { clearTimeout(tm); }
  };
  const post = (path, body) => req(path, { method: "POST", headers: J, body: JSON.stringify(body) });
  const err = (xato, extra) => ({ ok: false, d: Object.assign({ xato }, extra || {}) });

  // lokal rejim: foydalanuvchi holati brauzerda saqlanadi
  const st = (id) => ls.get("eko_state_" + id, { placement: null, progress: {} });
  const setSt = (id, v) => ls.set("eko_state_" + id, v);
  const topicList = () => window.TOPICS.map((t) => ({ id: t.id, nom: t.nom }));
  const pathOf = (s) => YOL.buildPath(topicList(), s.placement ? s.placement.mavzuStat : null, s.progress);

  function gate(userId, topicId) {
    const s = st(userId), t = window.TOPICS.find((x) => x.id === topicId);
    if (!t || !window.LESSONS[topicId]) return { e: err("Mavzu topilmadi.") };
    if (!s.placement) return { e: err("Avval daraja testini topshiring.", { daraja: true }) };
    const h = pathOf(s).find((x) => x.id === topicId);
    if (h && h.holat === "yopiq") return { e: err("Bu mavzu hali yopiq. Avval oldingi mavzu testidan o'ting.") };
    return { s, t };
  }

  window.API = {
    local,
    async regions() { return local ? window.REGIONS : (await req("/api/regions")).d; },
    async register(body) {
      if (local) {
        const u = { id: uid(), ...Object.fromEntries(Object.entries(body).map(([k, v]) => [k, String(v).trim()])), sana: new Date().toISOString() };
        const users = ls.get("eko_users", []); users.push(u); ls.set("eko_users", users);
        return { ok: true, d: { userId: u.id } };
      }
      return post("/api/register", body);
    },
    // ---- daraja testi ----
    async test(userId) {
      if (local) {
        const key = {}, savollar = [], mavzular = {};
        for (const t of window.TOPICS) for (const s of (mavzular[t.id] = t.nom, shuffle(t.savollar).slice(0, PER_TOPIC))) {
          const variantlar = shuffle(s.o);
          const id = uid(); key[id] = { mavzu: t.id, togriMatn: s.o[s.t] };
          savollar.push({ id, mavzu: t.nom, q: s.q, variantlar });
        }
        const attemptId = uid(); attempts[attemptId] = key;
        return { ok: true, d: { attemptId, mavzular, savollar: shuffle(savollar) } };
      }
      return req("/api/test/" + userId);
    },
    async submit(userId, attemptId, javoblar) {
      if (local) {
        const key = attempts[attemptId]; if (!key) return err("Noto'g'ri so'rov.");
        delete attempts[attemptId];
        let togri = 0; const mavzuStat = {};
        for (const [qid, info] of Object.entries(key)) {
          mavzuStat[info.mavzu] = mavzuStat[info.mavzu] || { jami: 0, togri: 0 };
          mavzuStat[info.mavzu].jami++;
          if (javoblar[qid] === info.togriMatn) { togri++; mavzuStat[info.mavzu].togri++; }
        }
        const jami = Object.keys(key).length, foiz = Math.round((togri / jami) * 100);
        const natija = { userId, tur: "daraja", sana: new Date().toISOString(), togri, jami, foiz, daraja: levelOf(foiz), mavzuStat };
        const rs = ls.get("eko_results", []); rs.push(natija); ls.set("eko_results", rs);
        const s = st(userId); s.placement = { sana: natija.sana, togri, jami, foiz, daraja: natija.daraja, mavzuStat }; setSt(userId, s);
        return { ok: true, d: natija };
      }
      return post("/api/submit", { userId, attemptId, javoblar });
    },
    // ---- o'quv yo'li ----
    async me(userId) {
      if (local) {
        const u = ls.get("eko_users", []).find((x) => x.id === userId);
        if (!u) return { ok: false, d: { xato: "Foydalanuvchi topilmadi." } };
        const s = st(userId), yol = pathOf(s);
        return { ok: true, d: { ism: u.ism, placement: s.placement, yol, tugagan: yol.filter((x) => x.holat === "tugagan").length, jami: yol.length, pass: YOL.PASS, daraja: YOL.currentLevel(s.placement, s.progress) } };
      }
      return req("/api/me/" + userId);
    },
    async dars(userId, topicId) {
      if (local) { const g = gate(userId, topicId); if (g.e) return g.e; return { ok: true, d: { id: g.t.id, nom: g.t.nom, dars: window.LESSONS[g.t.id], savol: g.t.savollar.length } }; }
      return req("/api/dars/" + userId + "/" + topicId);
    },
    async quizStart(userId, topicId) {
      if (local) {
        const g = gate(userId, topicId); if (g.e) return g.e;
        const key = {}, savollar = [];
        for (const s of shuffle(g.t.savollar).slice(0, QUIZ_N)) {
          const id = uid(); key[id] = { togriMatn: s.o[s.t], javob: null };
          savollar.push({ id, q: s.q, variantlar: shuffle(s.o) });
        }
        const attemptId = uid(); quizzes[attemptId] = { userId, mavzu: topicId, key };
        return { ok: true, d: { attemptId, nom: g.t.nom, pass: YOL.PASS, savollar } };
      }
      return req("/api/quiz/" + userId + "/" + topicId);
    },
    async quizCheck(attemptId, qid, javob) {
      if (local) {
        const a = quizzes[attemptId], k = a && a.key[qid]; if (!k) return err("So'rov noto'g'ri.");
        if (k.javob === null) k.javob = javob;
        return { ok: true, d: { togri: k.javob === k.togriMatn, togriMatn: k.togriMatn, tanlangan: k.javob } };
      }
      return post("/api/quiz/check", { attemptId, qid, javob });
    },
    async quizFinish(attemptId) {
      if (local) {
        const a = quizzes[attemptId]; if (!a) return err("Test muddati tugagan.");
        delete quizzes[attemptId];
        const jami = Object.keys(a.key).length, togri = Object.values(a.key).filter((k) => k.javob === k.togriMatn).length;
        const foiz = Math.round((togri / jami) * 100), otdi = foiz >= YOL.PASS;
        const s = st(a.userId); s.progress = s.progress || {};
        const p = s.progress[a.mavzu] = s.progress[a.mavzu] || { eng: 0, urinish: 0, otdi: false };
        p.urinish++; p.eng = Math.max(p.eng, foiz); p.otdi = p.otdi || otdi; setSt(a.userId, s);
        const yol = pathOf(s);
        return { ok: true, d: { togri, jami, foiz, otdi, pass: YOL.PASS, keyingi: (yol.find((x) => x.holat === "ochiq") || {}).id || null, tugagan: yol.filter((x) => x.holat === "tugagan").length, jami_mavzu: yol.length, daraja: YOL.currentLevel(s.placement, s.progress) } };
      }
      return post("/api/quiz/finish", { attemptId });
    },
    ping(userId) { if (!local) fetch(BASE + "/api/ping", { method: "POST", headers: J, body: JSON.stringify({ userId }) }).catch(() => {}); },
    base: BASE,
  };
})();
