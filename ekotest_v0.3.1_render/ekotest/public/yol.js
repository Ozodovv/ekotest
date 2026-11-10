// O'quv yo'li mantig'i: server (Node) ham, brauzer (lokal rejim) ham shu faylni ishlatadi.
(function (root) {
  const PASS = 70; // mavzu testidan o'tish bali (%)
  const levelOf = (p) => (p >= 85 ? "Yuqori" : p >= 60 ? "O'rta" : "Boshlang'ich");

  // topics: [{id, nom}], placementStat: {id:{jami,togri}} | null, progress: {id:{eng,urinish,otdi}}
  function buildPath(topics, placementStat, progress) {
    progress = progress || {};
    const strong = (id) => !!(placementStat && placementStat[id] && placementStat[id].jami && placementStat[id].togri === placementStat[id].jami);
    const order = topics.filter((t) => !strong(t.id)).concat(topics.filter((t) => strong(t.id)));
    let prevDone = true;
    return order.map((t) => {
      const p = progress[t.id] || {};
      const otdi = !!p.otdi, ochiq = prevDone;
      prevDone = otdi;
      return {
        id: t.id, nom: t.nom,
        holat: otdi ? "tugagan" : ochiq ? "ochiq" : "yopiq",
        eng: p.eng ?? null, urinish: p.urinish || 0,
        belgi: !placementStat ? "" : strong(t.id) ? "tanish" : "tavsiya",
      };
    });
  }

  // Joriy daraja: avval daraja testi; kamida 3 mavzu tugagach, mavzu testlarining o'rtachasi ham hisobga olinadi.
  function currentLevel(placement, progress) {
    const done = Object.values(progress || {}).filter((p) => p.otdi && typeof p.eng === "number");
    if (done.length >= 3) return levelOf(Math.round(done.reduce((s, p) => s + p.eng, 0) / done.length));
    return placement ? placement.daraja : null;
  }

  const api = { PASS, levelOf, buildPath, currentLevel };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.YOL = api;
})(typeof window !== "undefined" ? window : globalThis);
