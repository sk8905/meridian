// =============================================================================
// niche.mjs — the owner's niche ("Target" in the UI). The implementation now lives
// in credit/js/target.js so the app can load it too (scripts/ is not published);
// this re-export keeps every script's import path working. One source of truth.
// =============================================================================
export * from "../../credit/js/target.js";
