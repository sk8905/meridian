// Profiles link integrity — the detail pages (manager / hedge fund / law firm / legal
// item) are rendered by the Credit & Legal desk view functions inside the Profiles
// hash-router host. Those desks emit their OWN routes (#/deals, #/intel, #/list?q=…)
// that the Profiles router does NOT handle, so before the profilesMode fix a deal/intel
// news item or a tag chip navigated to #/deals|#/list → the router fell to `default`
// and BOUNCED you back to the list instead of the story (the Arini bug). This spec
// crawls a broad sample of profiles and asserts EVERY rendered link is either external
// (http) or an internal #/ route the Profiles router actually handles — never a
// desk-only route, a bare "#", or an undefined/null href.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const empty = (b) => [200, b || "{}"];
const srv = await serve({
  "/api/feed": () => empty('{"items":[]}'), "/api/hero": () => empty('{"asOf":"2026-10-09","instruments":[]}'),
  "/api/xfeed": () => empty('{"tweets":[]}'), "/api/markets": () => empty('{"markets":[]}'),
  "/api/rates": () => empty('{"rates":[]}'), "/api/hormuz": () => empty("{}"),
  "/api/predict": () => empty('{"markets":[]}'), "/api/watchlist": () => empty('{"items":[]}'),
});
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/profiles/`);
pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
await pg.waitForTimeout(600);

// Exactly the routes v2/js/profiles/app.js router() switches on. Anything else dead-ends.
const HANDLED = ["manager", "fund", "clo", "lp", "hf", "firm", "item"];
const ids = await pg.evaluate(async () => {
  const c = await import("/credit/js/data.js"); const l = await import("/legal/js/data.js");
  return {
    managers: c.managers.map((m) => m.id).slice(0, 60),
    hf: (c.HEDGE_FUNDS || []).map((h) => h.id).slice(0, 30),
    lps: (c.lps || []).map((x) => x.id),
    firms: l.firms.map((f) => f.id),
    items: (l.items || []).slice(0, 20).map((i) => i.id),
  };
});

const flags = await pg.evaluate(async ({ routes, HANDLED }) => {
  const bad = [];
  let dealIntelExt = 0;
  const handled = new Set(HANDLED);
  const visit = async (hash) => {
    location.hash = hash;
    await new Promise((r) => setTimeout(r, 70));
    const host = document.querySelector("#pf-detail"); if (!host) return;
    host.querySelectorAll("a[href], [data-href]").forEach((el) => {
      const v = el.getAttribute("data-href") != null ? el.getAttribute("data-href") : el.getAttribute("href");
      if (v == null || v === "" || v === "#" || /undefined|null|NaN/.test(v) || /^javascript:/i.test(v)) {
        bad.push({ hash, v, text: (el.textContent || "").trim().slice(0, 30), why: "empty/#/undefined" });
      } else if (v.startsWith("#/")) {
        const r = v.split("?")[0].replace(/^#/, "").split("/").filter(Boolean)[0];
        if (r && !handled.has(r)) bad.push({ hash, v, text: (el.textContent || "").trim().slice(0, 30), why: "unhandled route" });
      }
    });
    // Deal/intel news rows must now be external story links (or plain text), never a #/deals route.
    host.querySelectorAll('.tw-row[data-kind="deal"] .tw-head, .tw-row[data-kind="intel"] .tw-head').forEach((h) => {
      if (h.tagName === "A") { const href = h.getAttribute("href") || ""; if (/^https?:/i.test(href)) dealIntelExt++; else if (href.startsWith("#/deals") || href.startsWith("#/intel")) bad.push({ hash, v: href, text: "deal/intel head", why: "deal/intel still routes to desk" }); }
    });
  };
  for (const id of routes.managers) await visit(`#/manager/${encodeURIComponent(id)}`);
  for (const id of routes.hf) await visit(`#/hf/${encodeURIComponent(id)}`);
  for (const id of routes.lps) await visit(`#/lp/${encodeURIComponent(id)}`);
  for (const id of routes.firms) await visit(`#/firm/${encodeURIComponent(id)}`);
  for (const id of routes.items) await visit(`#/item/${encodeURIComponent(id)}`);
  return { bad, dealIntelExt };
}, { routes: ids, HANDLED });

check(flags.bad.length === 0, `every profile link resolves — no dead-ends${flags.bad.length ? ": " + flags.bad.slice(0, 6).map((x) => `${x.why} ${x.v} (${x.hash})`).join("; ") : ""}`);
check(flags.dealIntelExt >= 1, `deal/intel news items link to their source story externally in Profiles (${flags.dealIntelExt} seen) — not the desk-only #/deals route that bounced to the list`);

// Behavioural: clicking a deal/intel news item must NOT bounce to the list. Find a
// manager whose news pane carries one, click it, and assert the manager detail survives.
const bounced = await pg.evaluate(async ({ managers }) => {
  for (const id of managers) {
    location.hash = `#/manager/${encodeURIComponent(id)}`;
    await new Promise((r) => setTimeout(r, 70));
    const head = document.querySelector('#pf-detail .tw-row[data-kind="deal"] .tw-head, #pf-detail .tw-row[data-kind="intel"] .tw-head');
    if (!head) continue;
    const before = location.hash;
    // A real click: external heads are target=_blank (no in-page nav); the bug was the
    // hash changing to #/deals and the router showing the list. Assert the hash is unchanged.
    head.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 90));
    const detailStill = !!document.querySelector("#pf-detail .twire, #pf-detail .tdet, #pf-detail .tpane");
    return { tested: true, hashUnchanged: location.hash === before, detailStill, before, after: location.hash };
  }
  return { tested: false };
}, { managers: ids.managers });
if (bounced.tested) {
  check(bounced.hashUnchanged && bounced.detailStill, `clicking a deal/intel news item stays on the manager — no bounce to the list (hash ${bounced.before} → ${bounced.after})`);
} else {
  check(true, "no deal/intel news row in the sampled managers to click (route-level checks above still cover it)");
}

checkErrs(errs, "profiles link integrity");
await ctx.close();
await b.close(); srv.close();
finish();
