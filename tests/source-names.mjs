// A source is shown by its NAME, never its URL (owner 2026-10-20, HOUSE_STYLE R43b).
// The 20 Oct briefing showed a full kark.com URL as its source line because the record's
// `srcName` held the link. This checks every committed data module: no name-type field
// (srcName / sourceName / outlet) holds a URL; and the shared renderer guard srcLabel()
// turns any URL-shaped name into the outlet name.
import { check, finish, ROOT } from "./lib.mjs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const MODS = ["briefings.js", "credit/js/data.js", "legal/js/data.js", "macro/js/content.js", "dashboard/js/data.js", "research.js", "newsletters.js"];
const NAME_KEYS = new Set(["srcName", "sourceName", "outlet"]);
const isUrl = (v) => typeof v === "string" && /^(https?:\/\/|www\.)/i.test(v.trim());
const bad = [];
const walk = (o, where, seen = new Set()) => {
  if (!o || typeof o !== "object" || seen.has(o)) return;
  seen.add(o);
  for (const [k, v] of Object.entries(o)) {
    if (NAME_KEYS.has(k) && isUrl(v)) bad.push(`${where}.${k} = ${String(v).slice(0, 80)}`);
    else if (v && typeof v === "object") walk(v, `${where}.${k}`, seen);
  }
};
for (const m of MODS) {
  const mod = await import(pathToFileURL(path.join(ROOT, m)).href);
  walk(mod, m);
}
check(bad.length === 0, `no stored source NAME is a URL (${bad.length}${bad.length ? ": " + bad.slice(0, 5).join(" | ") : ""})`);

const { srcLabel } = await import(pathToFileURL(path.join(ROOT, "util.js")).href);
check(srcLabel("AP", "https://apnews.com/x") === "AP", "srcLabel keeps a real name");
const fromUrl = srcLabel("https://www.kark.com/news/business/ap-asian-shares/", "https://www.kark.com/news/business/ap-asian-shares/");
check(fromUrl && !/[/:]/.test(fromUrl), `srcLabel turns a URL-shaped name into an outlet name (${fromUrl})`);
check(srcLabel("", "https://www.bloomberg.com/news/x") && !/http/.test(srcLabel("", "https://www.bloomberg.com/news/x")), "srcLabel falls back to the outlet when the name is missing");
finish();
