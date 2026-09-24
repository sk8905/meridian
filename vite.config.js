import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

// The v2 SPA (its own /v2/js + /v2/css + the shared CSS) is bundled and content-
// hashed by Vite. EVERYTHING ELSE loaded from a root path — the desk data modules
// (ft.js, credit/js/data.js, …, refreshed ~5×/day by the routine) and the shared
// runtime modules at root (feed.js, palette.js, credit/js/shared.js, …) — stays
// EXTERNAL: emitted as-is so a data refresh only rewrites that one small file and
// never re-hashes the app bundle. postbuild.mjs copies them into dist/.
export default defineConfig({
  root,
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: path.resolve(root, "v2/index.html"),
      // Keep every root-absolute IMPORT SPECIFIER that isn't the v2 SPA itself out of
      // the bundle. Only unresolved source ids (as written, e.g. "/ft.js") — never a
      // resolved filesystem path (which also starts with "/"), so the entry and the
      // bundled /v2/** modules are unaffected.
      external: (source, _importer, isResolved) => {
        if (isResolved || typeof source !== "string") return false;
        if (!source.startsWith("/")) return false;      // only root-absolute specifiers
        if (source.startsWith("/v2/")) return false;     // the v2 SPA itself → bundle
        if (source.startsWith(root)) return false;        // a filesystem path (entry) → not external
        return true;                                      // /ft.js, /feed.js, /credit/js/*, …
      },
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
