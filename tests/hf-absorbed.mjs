// A hedge fund merged into its successor (R39o, Emso → Kirkoswald 2026-10-21): the
// successor carries `absorbed: [{ id, name, date, note, source }]`, the old profile is
// gone, nothing still points at it, and an old #/hf/<id> link opens the successor.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import { HEDGE_FUNDS, HEDGE_INTEL } from "../credit/js/data.js";

const live = new Set(HEDGE_FUNDS.map((h) => h.id));
const abs = HEDGE_FUNDS.flatMap((h) => (h.absorbed || []).map((a) => ({ ...a, by: h.id })));
check(abs.length > 0 && abs.every((a) => a.id && a.name && /^https?:/.test(a.source || "")), `every absorbed firm has an id, name and source (${abs.length})`);
const stillLive = abs.filter((a) => live.has(a.id)).map((a) => a.id);
check(stillLive.length === 0, `an absorbed profile no longer exists on its own${stillLive.length ? " — " + stillLive.join(", ") : ""}`);
const dangling = (HEDGE_INTEL || []).filter((x) => x.hfId && !live.has(x.hfId)).map((x) => `${x.id}:${x.hfId}`);
check(dangling.length === 0, `every HEDGE_INTEL item tied to a fund points at a live one${dangling.length ? " — " + dangling.slice(0, 8).join(", ") : ""}`);

const a = abs.find((x) => x.id === "h88") || abs[0];
const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/profiles/#/hf/${a.id}`);
await pg.waitForSelector(".tdet-id h1", { timeout: 10000 });
const r = await pg.evaluate(() => ({ h1: document.querySelector(".tdet-id h1").textContent.trim(), hash: location.hash, line: (document.querySelector(".hf-absorbed") || {}).textContent || "" }));
const succ = HEDGE_FUNDS.find((h) => h.id === a.by);
check(r.h1.includes(succ.name) && r.hash.includes(`/hf/${succ.id}`), `an old #/hf/${a.id} link opens ${succ.name} and corrects the address (${r.hash})`);
check(r.line.includes(a.name) && /source/.test(r.line), `the successor's page says it absorbed ${a.name}, with a source`);
checkErrs(errs, "hf absorbed");
await b.close(); srv.close();
finish();
