// The watchlist has ONE write/sync implementation (credit/js/shared.js): device ∪
// cloud, minus this device's explicit unfollows. Guards the drift the audit found
// (Home's star wrote localStorage only; the Credit view let the cloud overwrite the
// device; menu/nav unions resurrected unfollows):
//   • a follow that exists only in the cloud (another device) is merged in;
//   • a follow that exists only on this device is pushed up to the cloud;
//   • an unfollow made here is NOT resurrected by the next sync, and is pushed.
import { serve, launchChromium, check, finish } from "./lib.mjs";

let server = { manager: ["m2"], fund: [], lp: [], firm: [], hf: [] };
const puts = [];
const srv = await serve({
  "/blank": () => [200, "<!doctype html><title>t</title>", "text/html"],
  "/api/watchlist": (q) => {
    if (q.method === "PUT") { let b = ""; q.on("data", (c) => (b += c)); q.on("end", () => { try { const j = JSON.parse(b); puts.push(j); server = j; } catch { /* ignore */ } }); return [200, "{}"]; }
    return [200, JSON.stringify({ email: "t@wire", watchlist: server })];
  },
});
const b = await launchChromium();
const ctx = await b.newContext();
const pg = await ctx.newPage();
await pg.goto(`http://127.0.0.1:${srv.port}/blank`);
await pg.evaluate(() => localStorage.setItem("meridian.follows", JSON.stringify({ manager: ["m1"] })));

const r1 = await pg.evaluate(async () => {
  const m = await import("/credit/js/shared.js");
  const res = await m.syncFollows();
  await new Promise((r) => setTimeout(r, 200));
  return { res, local: JSON.parse(localStorage.getItem("meridian.follows")).manager };
});
check(r1.res.ok && r1.local.includes("m1") && r1.local.includes("m2"), `sync merges cloud-only (m2) with device-only (m1) follows (${r1.local})`);
check(puts.length >= 1 && puts.at(-1).manager.includes("m1"), "the device-only follow is pushed up to the cloud");

// Unfollow m2 here while the cloud still lists it: it must stay unfollowed.
server = { manager: ["m1", "m2"], fund: [], lp: [], firm: [], hf: [] };
const r2 = await pg.evaluate(async () => {
  const m = await import("/credit/js/shared.js");
  const now = m.toggleFollow("manager", "m2");
  await new Promise((r) => setTimeout(r, 300));
  await m.syncFollows();
  await new Promise((r) => setTimeout(r, 200));
  return { now, local: JSON.parse(localStorage.getItem("meridian.follows")).manager, followed: m.isFollowed("manager", "m2") };
});
check(r2.now === false && !r2.followed && !r2.local.includes("m2"), `an unfollow is not resurrected by the next sync (${r2.local})`);
check(!puts.at(-1).manager.includes("m2"), "the unfollow is pushed to the cloud");
await b.close(); srv.close();
finish();
