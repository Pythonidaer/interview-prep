import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * GitHub Pages:
 * - Project site: `https://USER.github.io/REPO/` → base `/REPO/`
 * - User site: repo named `USER.github.io` → site is `https://USER.github.io/` → base `/`
 *
 * Override: `BASE_PATH=/my-repo/ npm run build` or `BASE_PATH=/` for user-site root.
 */
const repoSlug = process.env.GITHUB_REPOSITORY?.split("/")[1];

let base =
  process.env.BASE_PATH ??
  (repoSlug
    ? repoSlug.endsWith(".github.io")
      ? "/"
      : `/${repoSlug}/`
    : "/");

if (base !== "/" && !base.startsWith("/")) {
  base = `/${base}`;
}
if (base !== "/" && !base.endsWith("/")) {
  base = `${base}/`;
}

export default defineConfig({
  base,
  plugins: [react()],
});
