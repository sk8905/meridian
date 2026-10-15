// tests/fixtures/r43-probe.mjs — the in-page HOUSE_STYLE R43 probe shared by
// tests/style-r43.mjs (desktop widths) and tests/style-r43-phone.mjs (iPhone, both
// themes). It returns a list of violations (strings) for the page as rendered:
//   (b) every events row / events table leads with its date (the wire: its time) and
//       ends with its source;
//   (c) no events item runs past two lines, and every list keeps ONE row height;
//   (d) text colours resolve only to the three tiers (ink / mut / faint) plus the
//       semantic up / down, accent, link and the eight domain-label tokens;
//   (e) no bold (font-weight ≥ 600) outside headings, navigation tabs / chips and the
//       owner's "Open original at … / Open at …" link;
//   (f) no table column narrower than its longest single word, no table cell
//       overflowing (a truncating R43 column ends in an ellipsis instead);
//   and no horizontal page scroll.
// The surface list every spec walks.
export const SURFACES = [
  ["Home", "/v2/"], ["News", "/v2/news/"],
  ["Markets Credit", "/v2/dashboard/credit"], ["Markets Rates", "/v2/dashboard/rates"], ["Markets Legal", "/v2/dashboard/legal"],
  ["Markets Equities", "/v2/dashboard/equities"], ["Markets Hedge", "/v2/dashboard/hedge-funds"],
  ["Deals All", "/v2/transactions/"], ["Deals Lending", "/v2/transactions/#/lending"], ["Deals Structured", "/v2/transactions/#/structured"], ["Deals Secondaries", "/v2/transactions/#/secondary"],
  ["Deals M&A", "/v2/transactions/#/mna"], ["Deals League", "/v2/transactions/#/league"], ["Deals Fundraising", "/v2/transactions/#/fundraising"],
  ["Deal drawer", "/v2/transactions/#/deal/d1046"], ["Restructuring", "/v2/restructuring/"],
  ["Profiles All", "/v2/profiles/"], ["Profiles Managers", "/v2/profiles/", "managers"], ["Profiles HF", "/v2/profiles/", "hedgefunds"], ["Profiles Investors", "/v2/profiles/", "investors"],
  ["Profiles Firms", "/v2/profiles/", "firms"], ["Profiles People", "/v2/profiles/", "people"],
  ["Manager profile", "/v2/profiles/#/manager/m20"], ["HF profile", "/v2/profiles/#/hf/h2"], ["LP profile", "/v2/profiles/#/lp/l1"],
  ["Firm profile", "/v2/profiles/#/firm/cliffordchance"], ["Borrower", "/v2/profiles/#/co/Iguanas%20Holdings"], ["Compare", "/v2/profiles/#/compare/m20/m29"],
  ["Menu Watchlist", "/v2/menu/watchlist"], ["Menu New", "/v2/menu/new"], ["Menu Digest", "/v2/menu/digest"],
  ["Menu Sources", "/v2/menu/coverage"], ["Menu Settings", "/v2/menu/settings"],
];

// Wait for a surface to settle on a CONDITION (its view mounted and its main list or
// table present), never a fixed timeout.
export async function settle(pg, chip) {
  await pg.waitForFunction(() => {
    const v = [...document.querySelectorAll(".v2-view")].find((e) => e.offsetParent !== null);
    return !!v && v.textContent.trim().length > 20 && !v.querySelector(".v2-loading");
  }, null, { timeout: 20000 });
  if (chip) {
    await pg.click(`#pf-chips [data-p="${chip}"]`);
    await pg.waitForFunction((c) => { const p = document.querySelector(`.tpane[data-pane="${c}"]`); return !!p && p.offsetParent !== null && !!p.querySelector("tbody tr, li"); }, chip, { timeout: 15000 });
  }
  // Two animation frames: late layout passes (Dashboard packing, column roles) land.
  await pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await pg.waitForFunction(() => !document.querySelector(".dsh-mid") || !!document.querySelector(".dsh-mid .dsh-card"), null, { timeout: 15000 });
}

// The probe itself — serialised into the page by page.evaluate.
export function r43Probe() {
  const out = [];
  const vis = (e) => { if (!e || !e.getClientRects().length) return false; const s = getComputedStyle(e); return s.visibility !== "hidden" && s.display !== "none" && +s.opacity !== 0; };
  const name = (e) => `${e.tagName.toLowerCase()}${typeof e.className === "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : ""}`;
  const where = (e) => { const c = e.closest(".dsh-card, section, .tpane, .g-panel, .tui-panel, [id]"); return c ? (c.id || name(c)) : "page"; };
  const R = (e) => e.getBoundingClientRect();
  const root = document.documentElement;
  // (–) No horizontal page scroll.
  if (root.scrollWidth > root.clientWidth + 1) out.push(`page scrolls sideways (${root.scrollWidth} > ${root.clientWidth})`);

  // (b)(c) THE events row: date first, source last, two lines, one height per list.
  const lists = new Map();
  for (const li of document.querySelectorAll(".g-ev")) {
    if (!vis(li)) continue;
    const d = li.querySelector(":scope > .c-date"), t = li.querySelector(":scope > .g-ev-t"), s = li.querySelector(":scope > .c-src");
    if (!d || !t || !s || li.firstElementChild !== d) { out.push(`events row without date-first / source-last cells in ${where(li)}`); continue; }
    const rd = R(d), rt = R(t), rs = R(s);
    if (rd.right > rt.left + 1) out.push(`events row date not left of its headline in ${where(li)}`);
    if (rs.width > 0 && rs.left < rt.right - 1) out.push(`events row source not right of its headline in ${where(li)}`);
    const lh = parseFloat(getComputedStyle(t).lineHeight) || 17;
    if (R(li).height > lh * 2 + 18) out.push(`events row over two lines (${Math.round(R(li).height)}px) in ${where(li)}`);
    const p = li.parentElement; if (!lists.has(p)) lists.set(p, new Set()); lists.get(p).add(Math.round(R(li).height));
  }
  // The news wire: its time leads, its source closes the line, one row height per day.
  for (const r of document.querySelectorAll("a.g-feed-row")) {
    if (!vis(r)) continue;
    const tm = r.querySelector(".g-feed-time"), tt = r.querySelector(".g-feed-title");
    if (!tm || !tt || r.firstElementChild !== tm) { out.push(`wire row does not lead with its time in ${where(r)}`); continue; }
    if (R(tm).left > R(tt).left + 1) out.push(`wire row time not left of its headline in ${where(r)}`);
    const lh = parseFloat(getComputedStyle(tt).lineHeight) || 17;
    if (R(r).height > lh * 2 + 26) out.push(`wire row over two lines (${Math.round(R(r).height)}px) in ${where(r)}`);
    const p = r.parentElement; if (!lists.has(p)) lists.set(p, new Set()); lists.get(p).add(Math.round(R(r).height));
  }
  for (const [p, hs] of lists) if (hs.size > 1) out.push(`uneven row heights ${[...hs].join("/")}px in ${where(p)}`);

  // (c) ONE leading-column style: every visible list date and the wire's time share the
  // same size and colour (owner 2026-10-15).
  const leads = [...document.querySelectorAll(".g-ev > .c-date, td.c-date, a.g-feed-row > .g-feed-time")].filter(vis).filter((e) => e.textContent.trim());
  const leadStyles = new Set(leads.map((e) => { const c = getComputedStyle(e); return `${c.fontSize} ${c.color}`; }));
  if (leadStyles.size > 1) out.push(`leading date / time cells differ in style (${[...leadStyles].join(" vs ")})`);

  // (b)(f) Tables.
  for (const t of document.querySelectorAll("table")) {
    if (!vis(t)) continue;
    const ths = t.tHead && t.tHead.rows[0] ? [...t.tHead.rows[0].cells].filter(vis) : [];
    // An events table (data-events) leads with its date and ends with its source.
    if (t.dataset.events === "1" && ths.length) {
      if (!ths[0].classList.contains("c-date")) out.push(`events table does not lead with its date in ${where(t)}`);
      if (!ths[ths.length - 1].classList.contains("c-src")) out.push(`events table does not end with its source in ${where(t)}`);
    }
    for (const th of ths) {
      // Rotated (vertical-text) matrix headers are tall by design.
      if ([th, ...th.querySelectorAll("*")].some((e) => /vertical/.test(getComputedStyle(e).writingMode))) continue;
      if (+getComputedStyle(th).fontWeight >= 600) out.push(`bold table header "${th.textContent.trim().slice(0, 20)}" in ${where(t)}`);
      if (th.scrollWidth > th.clientWidth + 1 && !/\s/.test(th.textContent.trim())) out.push(`table header clips its word "${th.textContent.trim()}" in ${where(t)}`);
      if (th.textContent.trim() && th.getClientRects().length && R(th).height > parseFloat(getComputedStyle(th).lineHeight || "14") * 1.9 + 14 && !/\s/.test(th.textContent.trim())) out.push(`table header wraps a single word in ${where(t)}`);
    }
    const rows = [...t.tBodies].flatMap((b) => [...b.rows]).filter(vis).slice(0, 40);
    for (const r of rows) for (const c of r.cells) {
      if (!vis(c) || !c.textContent.trim()) continue;
      const cs = getComputedStyle(c);
      if (c.scrollWidth > c.clientWidth + 1 && cs.textOverflow !== "ellipsis") out.push(`table cell overflows ("${c.textContent.trim().slice(0, 24)}") in ${where(t)}`);
      const word = c.textContent.trim();
      // The fixed, narrow source column truncates by design (full name in its title).
      if (!/\s/.test(word) && word.length > 1 && c.scrollWidth > c.clientWidth + 1 && !c.classList.contains("c-text") && !c.classList.contains("c-src")) out.push(`table column narrower than its word "${word.slice(0, 24)}" in ${where(t)}`);
    }
  }

  // (d)(e) Every visible text node's colour and weight.
  const probe = document.createElement("span"); document.body.appendChild(probe);
  const rgb = (v) => { probe.style.color = ""; probe.style.color = v; return getComputedStyle(probe).color; };
  const toks = ["ink", "mut", "faint", "accent", "up", "down", "link", "news", "mac", "crd", "lex", "amber", "ft", "hdg", "rsch", "fi"];
  const cs0 = getComputedStyle(root);
  const allowed = new Set(toks.map((k) => cs0.getPropertyValue(`--t-${k}`).trim()).filter(Boolean).map(rgb));
  ["--wb-txt", "--accent", "--ink", "--chip-ul"].forEach((k) => { const v = cs0.getPropertyValue(k).trim(); if (v) allowed.add(rgb(v)); });
  allowed.add("rgb(255, 255, 255)"); allowed.add("rgb(0, 0, 0)");   // header buttons (R12): white on black / black on white
  probe.remove();
  const HEAD = /^H[1-6]$|^(TH)$/;
  const BOLD_OK = [
    "h1", "h2", "h3", "h4", "h5", "h6", "[role='heading']", "summary",
    // section / card / sheet / panel titles
    "[class*='-h-t']", "[class*='-title']", "[class*='-ttl']", "[class*='-head']", ".dsh-h", ".tpg-h", ".crr-sec", ".tpanel-h *", ".tui-ph > span:first-child",
    ".na-h-t", ".na-sec", ".na-menu-recent-h", ".nf-grp", ".nf-head", ".rxh-t", ".dsh-term-lbl", ".dsh-pc-reports-h", ".dsh-ms-col-h", ".dsh-cyc-hd-t", ".dsh-sheet-t",
    ".g-feed-dayhdr", ".tw-day", ".ew-day", ".year-head", ".tveh-grp-h", ".tinv-head", ".tinv-spon-l", ".tbdc-seclbl", ".tx-striplbl", ".tx-fh", ".tx-fmore-t", ".tx-title", ".tx-drawer-t", ".tx-phone-h",
    ".cov-title", ".cov-sec", ".cov-src-h", ".cov-fix-h", ".cov-role-h", ".mac-km-h", ".macro-subhead", ".macro-sum-title", ".compact-head", ".intel-head", ".g-hbs-lbl", ".g-sv-head", ".g-rates-head", ".g-snap-t", ".g-mm-title", ".g-mkt-title", ".g-card-title", ".g-sub-h", ".g-mw-coach-h", ".hf-cons-h-t", ".hf-ofr-h", ".wire-watch .watch-grp-h", ".dg-head",
    // navigation tabs, chips, brand
    ".tchip", ".mtab", ".nav-link", ".ps-btn", ".logo", ".g-logo", ".brand-text *", ".g-brand-text *", ".dsh-navchip", ".g-feed-chip", ".g-wiretab", ".g-wire-lane", ".na-chip", ".na-pred-fchip", ".g-pred-fchip", ".dsh-lgl-chip", ".crr-chip", ".dsh-sortchip", ".lf-sel", ".seg-btn", ".chart-mode-btn", ".chart-range-btn", ".g-hero-rg", ".g-mkt-chip", ".sls-chip", ".chip", ".tchip-menu-item",
    // the owner's one exception: "Open original at …" / "Open at …"
    ".g-read-open", ".wr-open", ".wr-h", ".g-read-h",
  ].join(",");
  const badBold = new Map(), badCol = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    const e = n.parentElement; if (!e || !vis(e) || e.closest("svg, script, style, noscript, [aria-hidden='true'], .v2-hidden")) continue;
    const r = R(e); if (r.width < 1 || r.height < 1) continue;
    const s = getComputedStyle(e);
    if (+s.fontWeight >= 600 && !HEAD.test(e.tagName) && !e.closest(BOLD_OK)) { const k = name(e); badBold.set(k, (badBold.get(k) || 0) + 1); }
    if (!allowed.has(s.color) && s.color !== "rgba(0, 0, 0, 0)") { const k = `${name(e)} ${s.color}`; badCol.set(k, (badCol.get(k) || 0) + 1); }
  }
  for (const [k] of badBold) out.push(`bold body text ${k}`);
  for (const [k] of badCol) out.push(`off-tier colour ${k}`);
  return [...new Set(out)];
}
