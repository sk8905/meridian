import { makeView } from "./_placeholder.js?v=v2-1";
const v = makeView({ name: "Credit", accent: "var(--credit,#9aa3b3)",
  blurb: "Credit desk (funds, managers, LPs, CLOs). Its heavy dataset will be lazy-loaded once and cached — so the long blank page on first open goes away and revisits are instant." });
export const mount = v.mount;
