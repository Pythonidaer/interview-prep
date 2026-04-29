# Interview prep

Minimal React + GraphQL glossary UI for reviewing topic definitions loaded from [`interview.json`](./interview.json).

## Interview prep page

- **Route:** `/` (single-page app)
- **Component:** [`src/pages/InterviewPrepPage.tsx`](./src/pages/InterviewPrepPage.tsx)
- **Run locally:** `npm install` → `npm run dev` → open the URL Vite prints (usually `http://localhost:5173/`)

## GitHub Pages

This app is a static Vite build. Deployments fail or show a blank page when:

1. **`base` is wrong** — GitHub project sites live at `https://<user>.github.io/<repo>/`, so JS/CSS must load from `/<repo>/assets/...`. [`vite.config.ts`](./vite.config.ts) sets **`base`** from `GITHUB_REPOSITORY` during `npm run build` in Actions (or override with `BASE_PATH=/your-repo/`). If your repo is **`YOURNAME.github.io`** (user/org site at the domain root), `base` resolves to **`/`** automatically.
2. **Router `basename`** — [`src/main.tsx`](./src/main.tsx) uses `import.meta.env.BASE_URL` so React Router matches that prefix.
3. **Publish `dist/`** — The workflow [`.github/workflows/deploy-github-pages.yml`](./.github/workflows/deploy-github-pages.yml) builds and uploads the **`dist`** output. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions** (not “Deploy from a branch” unless you know you want that). Check the **Actions** tab for workflow errors; first deploy can take a few minutes to go live.

**Local check of a production build** (same paths as CI):

```bash
GITHUB_REPOSITORY=yourname/interview-prep npm run build && npx vite preview --base /interview-prep/
```

(Replace `yourname/interview-prep` with your real `owner/repo`.)

## Shape of `interview.json`

The file is a single JSON object: each **key** is an identifier for one topic (`snake_case`), and each **value** is the **full definition string**. Use valid JSON: inner quotation marks must be escaped (for example `\u201c` / `\u201d`, or `\"` around inner phrases). A raw `"` in the middle of a value prematurely ends JSON string literals and can truncate what the app imports—often mistaken for UI “stripping words.” The GraphQL and React layers do not remove wording from imported strings.

The **`automated_testing_tools`** value previously held empty placeholders (`like  and`) while another key carried the fuller sentence; merge into one topic happens in **`interview.json`** (the UI does not invent tool names).

The app derives a readable **display title** from each key only (underscores → words, capitalization). It does not add topics or change wording in code.

After editing quoting by hand, run **`npm run validate:interview`** (or **`node scripts/fix-interview-json.mjs`** if you hit recurring quote-encoding issues—that script validates with **`JSON.parse`** at the end) so the file stays valid JSON before you refresh the app.

```json
{
  "improve_discovery": "\u201cImprove discovery\u201d means ..."
}
```

Definitions that contain `. ` (period followed by space) are split only for labeling in the modal:

- **Detailed explanation:** text after that first delimiter
- **Plain English:** text through the end of that first sentence

If `. ` never appears in a definition, only one modal section is shown (**Explanation**) with the full string.

## GraphQL data flow

[`src/graphql/schema.ts`](./src/graphql/schema.ts) defines an executable schema and resolvers fed by imported JSON logic in [`src/graphql/topicsFromJson.ts`](./src/graphql/topicsFromJson.ts). The Apollo client uses [`SchemaLink`](./src/graphql/client.ts) so queries run **in the browser** against that schema—no separate HTTP GraphQL server.

**Query:**

```graphql
query InterviewTopics {
  interviewTopics {
    id
    title
    explanation
    plainEnglishExplanation
  }
}
```

Declared in [`src/graphql/queries.ts`](./src/graphql/queries.ts) and used with Apollo `useQuery` on the interview prep page.
