# Interview prep

Minimal React + GraphQL glossary UI for reviewing topic definitions loaded from [`interview.json`](./interview.json).

## Interview prep page

- **Route:** `/interview-prep` (also redirects from `/`)
- **Component:** [`src/pages/InterviewPrepPage.tsx`](./src/pages/InterviewPrepPage.tsx)
- **Run locally:** `npm install` → `npm run dev` → open the URL Vite prints (often `http://localhost:5173/interview-prep`)

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
