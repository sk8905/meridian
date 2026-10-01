// Real-user vitals beacon (v2/js/vitals.js → POST /api/vitals). The client collects
// field metrics and sends ONE compact JSON summary per session when the page is first
// hidden/torn down. Here we stub /api/vitals to capture the POST body, load Home, let
// the deferred desk data land, then fire `pagehide` and assert the beacon fired with a
// well-formed payload — including deskMs, the "wire:desk" User-Timing measure that
// glance.js records around the deferred desk-data import (so this also proves the
// deferral actually ran). No analytics binding exists, so the Worker just logs it; the
// contract under test is the client beacon + its shape.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

// Capture beacon bodies: return 204 immediately, read the POST stream on the side.
const beacons = [];
const srv = await serve({
  "/api/vitals": (q) => { let b = ""; q.on("data", (c) => (b += c)); q.on("end", () => { try { beacons.push(JSON.parse(b)); } catch { /* ignore */ } }); return [204, ""]; },
});
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);

// Wait until Home's DEFERRED desk data has landed: glance.js records the "wire:desk"
// User-Timing measure the moment loadDeskData() resolves, so this both sequences the
// test and proves the deferred import path actually runs.
await pg.waitForFunction(() => performance.getEntriesByName("wire:desk", "measure").length > 0, { timeout: 8000 });

// The beacon fires on pagehide (its reliable backstop) as well as visibilitychange→hidden.
await pg.evaluate(() => window.dispatchEvent(new Event("pagehide")));
await pg.waitForTimeout(150);

check(beacons.length >= 1, `a vitals beacon is sent when the page is hidden (${beacons.length})`);
const v = beacons[0] || {};
check(typeof v.vp === "string" && /^\d+x\d+$/.test(v.vp), `the beacon carries the viewport size (${v.vp})`);
check("deskMs" in v, "the beacon carries a deskMs field (Home desk-data load time)");
check(typeof v.deskMs === "number" && v.deskMs >= 0, `deskMs is measured — the deferred desk-data import ran (${v.deskMs})`);
check("ttfb" in v && "fcp" in v && "lcp" in v && "cls" in v && "inp" in v, "the beacon carries the core metric fields (ttfb/fcp/lcp/cls/inp)");
checkEq(typeof v.pwa, "boolean", "the beacon reports PWA display mode as a boolean");

// It fires at most ONCE per session (guarded) — a second pagehide must not re-send.
await pg.evaluate(() => window.dispatchEvent(new Event("pagehide")));
await pg.waitForTimeout(100);
checkEq(beacons.length, 1, "the beacon is sent only once per session");

checkErrs(errs, "vitals beacon");
await ctx.close();
await b.close(); srv.close();
finish();
