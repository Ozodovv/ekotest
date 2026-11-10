// GitHub Pages uchun statik papka yaratadi: node build-pages.js [API_URL]
// API_URL berilsa — sayt shu serverga (masalan Render) ulanadi; berilmasa — serversiz "local" rejim.
const fs = require("fs"), path = require("path");
const out = path.join(__dirname, "github-pages"), pub = path.join(__dirname, "public"), priv = path.join(__dirname, "private");
const API_URL = process.argv[2] || "";
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out);
for (const f of ["index.html", "test.html", "learn.html", "dars.html", "style.css", "api.js", "yol.js", "topo.js"]) fs.copyFileSync(path.join(pub, f), path.join(out, f));
if (API_URL) fs.copyFileSync(path.join(priv, "admin.html"), path.join(out, "admin.html"));
fs.writeFileSync(path.join(out, "config.js"), `window.EKO = { mode: "local", API_URL: ${JSON.stringify(API_URL)} };\n`);
if (!API_URL) {
  fs.writeFileSync(path.join(out, "data.js"), "window.REGIONS = " + JSON.stringify(require("./data/regions")) + ";\nwindow.TOPICS = " + JSON.stringify(require("./data/questions")) + ";\nwindow.LESSONS = " + JSON.stringify(require("./data/lessons")) + ";\n");
  for (const f of ["index.html", "test.html", "learn.html", "dars.html"]) { const p = path.join(out, f); fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace('<script src="api.js"></script>', '<script src="data.js"></script><script src="api.js"></script>')); }
}
fs.writeFileSync(path.join(out, ".nojekyll"), "");
fs.writeFileSync(path.join(out, "robots.txt"), "User-agent: *\nAllow: /\n");
console.log("Tayyor:", out, API_URL ? "(server rejimi: " + API_URL + ")" : "(serversiz rejim)");
