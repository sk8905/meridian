// OFR Hedge Fund Monitor panel on the Transactions ▸ Hedge Funds pane. Stubs /api/hfm
// with known rows and verifies the panel renders a formatted tile per series, shows
// the as-of date, credits the OFR source, and links every tile to the monitor.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const HREF = "https://www.financialresearch.gov/hedge-fund-monitor/";
const HFM = {
  hfm: [
    { label: "Credit HF leverage", unit: "x", fmt: "ratio", value: 2.3, prev: 2.0, change: 0.3, asOf: "2026-06-30", href: HREF },
    { label: "Credit HF net return", unit: "%", fmt: "pct", value: 5.1, prev: 3.9, change: 1.2, asOf: "2026-06-30", href: HREF },
    { label: "All-HF gross exposure", unit: "$", fmt: "usd", value: 45193000000000, prev: 42291000000000, change: 2902000000000, asOf: "2026-06-30", href: HREF },
  ],
  asOf: "2026-06-30", source: "U.S. Treasury OFR Hedge Fund Monitor",
};

const srv = await serve({ "/api/hfm": () => [200, JSON.stringify(HFM)] });
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/profiles/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.reload({ waitUntil: "load" });
await pg.waitForTimeout(1800);
// Show the Hedge Funds pane.
await pg.evaluate(() => { const t = document.querySelector('#pf-chips .tchip[data-p="hedgefunds"]'); if (t) t.click(); });
await pg.waitForTimeout(700);

// (1) COLLAPSED ON OPEN — the monitor must NOT show when the pane first opens;
// it's relocated behind an easily-accessible "Monitor" toggle in the header.
const initial = await pg.evaluate(() => {
  const panel = document.getElementById("hf-ofr");
  const btn = document.getElementById("hf-mon-btn");
  return {
    found: !!panel,
    hidden: !!panel && panel.hidden,
    hasBtn: !!btn,
    btnPressed: btn && btn.getAttribute("aria-pressed"),
    btnText: btn ? btn.textContent.trim() : "",
    tilesBefore: panel ? panel.querySelectorAll(".hf-ofr-tile").length : -1,
  };
});
check(initial.found, "OFR panel container is present on the Hedge Funds pane");
check(initial.hidden, "OFR panel is COLLAPSED on open (does not show by default)");
check(initial.hasBtn && /monitor/i.test(initial.btnText), "a Monitor toggle sits in the header (easily accessible)");
check(initial.btnPressed === "false", "the Monitor toggle starts un-pressed");
check(initial.tilesBefore === 0, "the feed is not loaded until the monitor is opened (lazy)");

// (2) OPEN IT — one tap on Monitor reveals the panel and lazy-loads the feed.
await pg.evaluate(() => document.getElementById("hf-mon-btn").click());
await pg.waitForFunction(() => { const p = document.getElementById("hf-ofr"); return p && !p.hidden && p.querySelectorAll(".hf-ofr-tile").length > 0; }, undefined, { timeout: 8000 });

const r = await pg.evaluate(() => {
  const panel = document.getElementById("hf-ofr");
  const tiles = [...panel.querySelectorAll(".hf-ofr-tile")];
  return {
    hidden: panel.hidden,
    pressed: document.getElementById("hf-mon-btn").getAttribute("aria-pressed"),
    tiles: tiles.length,
    asof: (document.getElementById("hf-ofr-asof") || {}).textContent || "",
    vals: tiles.map((t) => (t.querySelector(".hf-ofr-val") || {}).textContent.replace(/\s+/g, " ").trim()),
    srcName: /OFR|Treasury/i.test(panel.textContent),
    hrefs: tiles.length > 0 && tiles.every((t) => /financialresearch\.gov/.test(t.getAttribute("href") || "")),
    chgCls: tiles.map((t) => { const c = t.querySelector(".hf-ofr-chg"); return c ? [...c.classList].find((x) => x === "up" || x === "dn") : null; }),
  };
});
check(!r.hidden && r.pressed === "true", "tapping Monitor reveals the panel and presses the toggle");
check(r.tiles === 3, `OFR panel renders one tile per series (${r.tiles})`);
check(/2\.3×/.test((r.vals || [])[0] || ""), `leverage renders as a ratio (${(r.vals || [])[0]})`);
check(/\+5\.1%/.test((r.vals || [])[1] || ""), `net return renders as a percent (${(r.vals || [])[1]})`);
check(/\$45\.2T/.test((r.vals || [])[2] || ""), `gross exposure renders in \$T (${(r.vals || [])[2]})`);
check((r.chgCls || [])[0] === "up", "a rising metric gets the up-direction class");
check((r.asof || "").includes("2026-06-30"), `panel shows the as-of date (${r.asof})`);
check(r.srcName, "panel credits the OFR / Treasury source");
check(r.hrefs, "every tile links the OFR Hedge Fund Monitor");

// (3) CLOSE IT — tapping Monitor again (or the ✕) hides the panel.
await pg.evaluate(() => document.getElementById("hf-mon-btn").click());
await pg.waitForTimeout(200);
const closed = await pg.evaluate(() => ({ hidden: document.getElementById("hf-ofr").hidden, pressed: document.getElementById("hf-mon-btn").getAttribute("aria-pressed") }));
check(closed.hidden && closed.pressed === "false", "tapping Monitor again collapses the panel");

checkErrs(errs, "hfm panel");
await ctx.close();
await b.close();
srv.close();
finish();
