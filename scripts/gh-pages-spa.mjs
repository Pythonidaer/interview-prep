/**
 * GitHub Pages SPA fallback for client-side routes (e.g. /interview-prep/ai-role).
 * @see https://github.com/rafgraph/spa-github-pages
 */
import fs from "fs";
import path from "path";

const distDir = path.join(import.meta.dirname, "..", "dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("gh-pages-spa: dist/index.html not found — run vite build first");
  process.exit(1);
}

const repoSlug = process.env.GITHUB_REPOSITORY?.split("/")[1];
let base =
  process.env.BASE_PATH ??
  (repoSlug
    ? repoSlug.endsWith(".github.io")
      ? "/"
      : `/${repoSlug}/`
    : "/");

if (base !== "/" && !base.startsWith("/")) base = `/${base}`;
if (base !== "/" && !base.endsWith("/")) base = `${base}/`;

/** 0 = user/org site at domain root; 1 = project site at /repo/ */
const segmentCount = base === "/" ? 0 : 1;

const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Interview prep</title>
    <script type="text/javascript">
      var segmentCount = ${segmentCount};
      var l = window.location;
      l.replace(
        l.protocol + "//" + l.hostname + (l.port ? ":" + l.port : "") +
          l.pathname
            .split("/")
            .slice(0, 1 + segmentCount)
            .join("/") +
          "/?/" +
          l.pathname
            .slice(1)
            .split("/")
            .slice(segmentCount)
            .join("/")
            .replace(/&/g, "~and~") +
          (l.search ? "&" + l.search.slice(1).replace(/&/g, "~and~") : "") +
          l.hash
      );
    </script>
  </head>
  <body></body>
</html>
`;

fs.writeFileSync(path.join(distDir, "404.html"), notFoundHtml);
console.log(
  `gh-pages-spa: wrote dist/404.html (segmentCount=${segmentCount}, base=${base})`,
);
