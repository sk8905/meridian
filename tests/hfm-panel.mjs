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
// Show the Hedge Funds pane (the OFR panel loads when Profiles mounts).
await pg.evaluate(() => { const t = document.querySelector('#pf-chips .tchip[data-p="hedgefunds"]'); if (t) t.click(); });
await pg.waitForTimeout(700);

const r = await pg.evaluate(() => {
  const panel = document.getElementById("hf-ofr");
  if (!panel) return { found: false };
  const tiles = [...panel.querySelectorAll(".hf-ofr-tile")];
  return {
    found: true,
    hidden: panel.hidden,
    tiles: tiles.length,
    asof: (document.getElementById("hf-ofr-asof") || {}).textContent || "",
    vals: tiles.map((t) => (t.querySelector(".hf-ofr-val") || {}).textContent.replace(/\s+/g, " ").trim()),
    srcName: /OFR|Treasury/i.test(panel.textContent),
    hrefs: tiles.length > 0 && tiles.every((t) => /financialresearch\.gov/.test(t.getAttribute("href") || "")),
    chgCls: tiles.map((t) => { const c = t.querySelector(".hf-ofr-chg"); return c ? [...c.classList].find((x) => x === "up" || x === "dn") : null; }),
  };
});
check(r.found, "OFR panel container is present on the Hedge Funds pane");
check(r.found && !r.hidden, "OFR panel is revealed once the feed loads");
check(r.tiles === 3, `OFR panel renders one tile per series (${r.tiles})`);
check(/2\.3×/.test((r.vals || [])[0] || ""), `leverage renders as a ratio (${(r.vals || [])[0]})`);
check(/\+5\.1%/.test((r.vals || [])[1] || ""), `net return renders as a percent (${(r.vals || [])[1]})`);
check(/\$45\.2T/.test((r.vals || [])[2] || ""), `gross exposure renders in \$T (${(r.vals || [])[2]})`);
check((r.chgCls || [])[0] === "up", "a rising metric gets the up-direction class");
check((r.asof || "").includes("2026-06-30"), `panel shows the as-of date (${r.asof})`);
check(r.srcName, "panel credits the OFR / Treasury source");
check(r.hrefs, "every tile links the OFR Hedge Fund Monitor");

checkErrs(errs, "hfm panel");
await ctx.close();
await b.close();
srv.close();
finish();
