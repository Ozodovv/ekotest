// Yagona API qatlami: server rejimi yoki lokal (GitHub Pages) rejimi
(function () {
  const C = window.EKO || { mode: "server", API_URL: "" };
  const BASE = (C.API_URL || "").replace(/\/$/, "");
  const local = C.mode === "local" && !BASE;
  const J = { "Content-Type": "application/json" };
  const ls = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
  const PER_TOPIC = 2;
  const attempts = {};
  const levelOf = (p) => (p >= 85 ? "Yuqori" : p >= 60 ? "O'rta" : "Boshlang'ich");
  const req = async (path, opt) => { const r = await fetch(BASE + path, opt); let d = {}; try { d = await r.json(); } catch (e) {} return { ok: r.ok, d }; };

  window.API = {
    local,
    async regions() {
      if (local) return window.REGIONS;
      return (await req("/api/regions")).d;
    },
    async register(body) {
      if (local) {
        const u = { id: uid(), ...Object.fromEntries(Object.entries(body).map(([k, v]) => [k, String(v).trim()])), sana: new Date().toISOString() };
        const users = ls.get("eko_users", []); users.push(u); ls.set("eko_users", users);
        return { ok: true, d: { userId: u.id } };
      }
      return req("/api/register", { method: "POST", headers: J, body: JSON.stringify(body) });
    },
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
        const key = attempts[attemptId]; if (!key) return { ok: false, d: { xato: "Noto'g'ri so'rov." } };
        delete attempts[attemptId];
        let togri = 0; const mavzuStat = {};
        for (const [qid, info] of Object.entries(key)) {
          mavzuStat[info.mavzu] = mavzuStat[info.mavzu] || { jami: 0, togri: 0 };
          mavzuStat[info.mavzu].jami++;
          if (javoblar[qid] === info.togriMatn) { togri++; mavzuStat[info.mavzu].togri++; }
        }
        const jami = Object.keys(key).length, foiz = Math.round((togri / jami) * 100);
        const natija = { userId, sana: new Date().toISOString(), togri, jami, foiz, daraja: levelOf(foiz), mavzuStat };
        const rs = ls.get("eko_results", []); rs.push(natija); ls.set("eko_results", rs);
        return { ok: true, d: natija };
      }
      return req("/api/submit", { method: "POST", headers: J, body: JSON.stringify({ userId, attemptId, javoblar }) });
    },
    ping(userId) { if (!local) fetch(BASE + "/api/ping", { method: "POST", headers: J, body: JSON.stringify({ userId }) }).catch(() => {}); },
    base: BASE,
  };
})();
