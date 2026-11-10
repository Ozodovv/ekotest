// Topografik izochiziqlar: sichqoncha/barmoq harakatiga sekin javob beradi.
(function () {
  const c = document.getElementById("topo"); if (!c) return;
  const ctx = c.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seed = 2.4;
  let W, H, dpr, S, px = 0.5, py = 0.5, tx = 0.5, ty = 0.5, raf = 0;
  const L = []; for (let l = -3.2; l <= 3.2; l += 0.4) L.push(+l.toFixed(2));
  const f = (x, y) => {
    const ox = (px - 0.5) * 1.6, oy = (py - 0.5) * 1.6;
    return Math.sin(x * 3.1 + oy + seed) + Math.sin(y * 2.3 - ox * 0.8 + 1.7) + 0.7 * Math.sin((x + y) * 5.2 + ox + 2.1) + 0.5 * Math.sin((x - y * 1.3) * 7.3 - oy) + 0.35 * Math.sin(x * 11 + y * 9 + 3.3 + ox);
  };
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const cols = Math.ceil(W / S) + 1, rows = Math.ceil(H / S) + 1, k = 1 / 900, v = new Float32Array(cols * rows);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) v[j * cols + i] = f(i * S * k, j * S * k);
    L.forEach((lv, li) => {
      const idx = li % 4 === 0; ctx.beginPath();
      for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
        const a = v[j * cols + i], b = v[j * cols + i + 1], cc = v[(j + 1) * cols + i + 1], d = v[(j + 1) * cols + i];
        const n = (a > lv ? 8 : 0) + (b > lv ? 4 : 0) + (cc > lv ? 2 : 0) + (d > lv ? 1 : 0);
        if (n === 0 || n === 15) continue;
        const x = i * S, y = j * S, t = (u, w) => (lv - u) / (w - u);
        const T = [x + t(a, b) * S, y], R = [x + S, y + t(b, cc) * S], B = [x + t(d, cc) * S, y + S], Lf = [x, y + t(a, d) * S];
        const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
        switch (n) {
          case 1: case 14: seg(Lf, B); break; case 2: case 13: seg(B, R); break;
          case 3: case 12: seg(Lf, R); break; case 4: case 11: seg(T, R); break;
          case 6: case 9: seg(T, B); break; case 7: case 8: seg(T, Lf); break;
          case 5: seg(T, Lf); seg(B, R); break; case 10: seg(T, R); seg(Lf, B); break;
        }
      }
      ctx.lineWidth = idx ? 1.4 : 0.8; ctx.strokeStyle = idx ? "rgba(31,111,139,.34)" : "rgba(31,111,139,.17)"; ctx.stroke();
    });
  }
  function resize() { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; S = W < 700 ? 22 : 15; c.width = W * dpr; c.height = H * dpr; c.style.width = W + "px"; c.style.height = H + "px"; draw(); }
  function tick() { px += (tx - px) * 0.06; py += (ty - py) * 0.06; draw(); raf = Math.abs(tx - px) + Math.abs(ty - py) > 0.002 ? requestAnimationFrame(tick) : 0; }
  addEventListener("resize", resize);
  if (!reduce) addEventListener("pointermove", (e) => { tx = e.clientX / innerWidth; ty = e.clientY / innerHeight; if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
  resize(); requestAnimationFrame(() => c.classList.add("on"));
})();
