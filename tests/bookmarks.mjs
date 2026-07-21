// Cross-device bookmarks: a news row saved on one device (press-and-hold /
// right-click → Save to Bookmarks) must appear in the Bookmarks panel on a
// DIFFERENT device. News rows have no app saved-id — they live in the Home
// snapshot store, which now syncs to the per-user KV via /api/saved-home
// (rowmenu.js PUTs on toggle; nav-actions pulls + merges on panel open).
// Two browser contexts = two devices (separate localStorage).
import { launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json", ".png": "image/png" };
const feed = { asOf: new Date().toISOString(), items: [
  { title: "WSJ Exclusive: Big Banks Brace For New Capital Rules", url: "https://www.wsj.com/x1", source: "The Wall Street Journal", region: "US", date: "2026-07-21", time: "11:10" },
  { title: "United States GDP Growth Rate Revised Higher", url: "https://tradingeconomics.com/us/gdp", source: "TradingEconomics", region: "GEN", date: "2026-07-21", time: "13:30" },
]};
// In-memory per-user KV — the piece under test.
let hsvStore = [];
const srv = http.createServer((q, r) => {
  let p = q.url.split("?")[0];
  const j = (o) => { r.writeHead(200, { "content-type": "application/json" }); r.end(JSON.stringify(o)); };
  if (p === "/api/me") return j({ email: "t@w" });
  if (p === "/api/feed") return j(feed);
  if (p === "/api/saved-home") {
    if (q.method === "PUT") {
      let body = "";
      q.on("data", (c) => (body += c));
      q.on("end", () => { try { hsvStore = JSON.parse(body).saved || []; } catch { /* */ } j({ ok: true }); });
      return;
    }
    return j({ email: "t@w", saved: hsvStore });
  }
  if (p.startsWith("/api/")) return j({});
  if (p === "/") p = "/index.html";
  if (/^\/(macro|credit|legal|menu)\/?$/.test(p)) p = p.replace(/\/?$/, "") + "/index.html";
  const fp = path.join(ROOT, p);
  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) { r.writeHead(200, { "content-type": MIME[path.extname(fp)] || "text/plain" }); fs.createReadStream(fp).pipe(r); }
  else { r.writeHead(404); r.end("x"); }
});
await new Promise((res) => srv.listen(0, res));
const port = srv.address().port;
const b = await launchChromium();

// ---- Device A: save a live-wire news row via the row options menu ----------
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${port}/`);
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.waitForTimeout(2500);
  const opened = await pg.evaluate(() => {
    const row = [...document.querySelectorAll(".g-feed-row")].find((r) => (r.textContent || "").includes("WSJ Exclusive"));
    if (!row) return "no row";
    row.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 300, clientY: 300 }));
    return "ok";
  });
  check(opened === "ok", `device A: found the WSJ row (${opened})`);
  await pg.waitForTimeout(400);
  const saved = await pg.evaluate(() => {
    const btn = [...document.querySelectorAll(".rowmenu-act")].find((x) => /save to bookmarks/i.test(x.textContent || ""));
    if (!btn) return "no save button";
    btn.click(); return "ok";
  });
  check(saved === "ok", `device A: tapped Save to Bookmarks (${saved})`);
  await pg.waitForTimeout(1200);   // local write + merge-PUT round-trip
  check(hsvStore.some((o) => o && /WSJ Exclusive/.test(o.title || "")), "server: /api/saved-home received the bookmark");
  checkErrs(errs, "device A");
  await ctx.close();
}

// ---- Device B: fresh context — the bookmark must appear in the panel -------
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${port}/`);
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.waitForTimeout(2200);
  await pg.evaluate(() => document.getElementById("na-saved")?.click());
  await pg.waitForTimeout(1500);   // panel render + server pull + re-render
  const panel = await pg.evaluate(() => (document.getElementById("na-saved-panel")?.textContent || ""));
  check(/WSJ Exclusive/.test(panel), "device B: iPhone-saved news item shows in desktop Bookmarks");
  checkErrs(errs, "device B");
  await ctx.close();
}

await b.close(); srv.close();
finish();
