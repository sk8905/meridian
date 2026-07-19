// =============================================================================
// tests/lib.mjs — shared harness for the headless regression specs.
//
// Playwright + Chromium are NOT vendored: the suite expects a playwright
// install on the host (default: the remote-session path below; override with
// WIRE_PW=/path/to/playwright/index.js). Chromium comes from Playwright's
// normal resolution (PLAYWRIGHT_BROWSERS_PATH honoured).
//
// The server serves the repo root with the same rewrites the production
// Worker applies (directory → index.html) and stubs /api/* so specs run
// offline and deterministic. NOTE: Playwright routes would disable the HTTP
// cache (breaking service-worker paths), so stubs live HERE, in the server.
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PW = process.env.WIRE_PW || "/opt/node22/lib/node_modules/playwright/index.js";

export async function launchChromium() {
  const pkg = await import(PW);
  return (pkg.default || pkg).chromium.launch();
}

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json", ".png": "image/png" };
const feedItems = (n = 30) => Array.from({ length: n }, (_, i) => ({ title: `Story ${i} on markets and rates`, url: `https://www.ft.com/x${i}`, source: i % 2 ? "FT" : "Reuters", date: "2026-07-19", time: `0${9 - (i % 9)}:00`, desk: "m" }));

export function serve(apis = {}) {
  const srv = http.createServer((q, r) => {
    let p = q.url.split("?")[0];
    if (apis[p]) { const [code, body] = apis[p](q); r.writeHead(code, { "content-type": "application/json" }); r.end(body); return; }
    if (p === "/api/me") { r.writeHead(200, { "content-type": "application/json" }); r.end('{"email":"tester@wire"}'); return; }
    if (p === "/api/feed") { r.writeHead(200, { "content-type": "application/json" }); r.end(JSON.stringify({ items: feedItems(120) })); return; }
    if (p.startsWith("/api/")) { r.writeHead(200, { "content-type": "application/json" }); r.end("{}"); return; }
    if (p === "/") p = "/index.html";
    if (/^\/(macro|credit|legal|menu)\/?$/.test(p)) p = p.replace(/\/?$/, "") + "/index.html";
    const fp = path.join(ROOT, p);
    if (fs.existsSync(fp) && fs.statSync(fp).isFile()) { r.writeHead(200, { "content-type": MIME[path.extname(fp)] || "text/plain" }); fs.createReadStream(fp).pipe(r); }
    else { r.writeHead(404); r.end("x"); }
  });
  return new Promise((res) => srv.listen(0, () => res({ port: srv.address().port, close: () => srv.close() })));
}

export const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone)" };
export const DESKTOP = { viewport: { width: 1280, height: 900 } };

// Page + collected errors (page errors always; console errors minus resource noise).
export async function open(browser, dev, url) {
  const ctx = await browser.newContext(dev);
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
  pg.on("console", (m) => { if (m.type() === "error" && !/net::|404|Failed to load resource/.test(m.text())) errs.push("console: " + m.text().slice(0, 160)); });
  await pg.goto(url, { waitUntil: "load" });
  return { ctx, pg, errs };
}

// Real touch input via CDP (Playwright's tap() doesn't drive the swipe code).
export async function touches(ctx, pg) {
  const cdp = await ctx.newCDPSession(pg);
  const ev = (type, x, y) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });
  return {
    tap: async (x, y) => { await ev("touchStart", x, y); await ev("touchEnd", 0, 0); },
    // Two-phase horizontal swipe: begin (lock + mid-gesture hold) and finish.
    swipeBegin: async (x, y, dir) => { await ev("touchStart", x, y); await ev("touchMove", x + dir * 20, y); await pg.waitForTimeout(60); await ev("touchMove", x + dir * 150, y); await pg.waitForTimeout(150); },
    swipeFinish: async (x, y, dir) => { await ev("touchMove", x + dir * 270, y); await ev("touchEnd", 0, 0); await pg.waitForTimeout(600); },
  };
}

let failures = 0;
export function check(cond, msg) {
  if (cond) { console.log("  ok:", msg); }
  else { failures++; console.error("  FAIL:", msg); }
}
export function checkEq(got, want, msg) { check(got === want, `${msg} (got ${JSON.stringify(got)}, want ${JSON.stringify(want)})`); }
export function checkErrs(errs, where) { check(errs.length === 0, `no page errors on ${where}${errs.length ? " — " + errs.slice(0, 2).join(" | ") : ""}`); }
export function finish() { if (failures) { console.error(`${failures} check(s) FAILED`); process.exit(1); } console.log("all checks passed"); }
