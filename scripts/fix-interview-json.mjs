/**
 * Repairs interview.json: opening typographic phrases + escaped inner quotation marks.
 */
import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");
const fp = path.join(root, "interview.json");

let s = fs.readFileSync(fp, "utf8");

s = s.replace(/: ""([^"]+)"(\s+)/g, ': "\\u201c$1\\u201d$2');

const pairs = [
  [
    `"technical_leader": "A "technical leader" is`,
    `"technical_leader": "A \\u201ctechnical leader\\u201d is`,
  ],
  [
    `"personalized_experience": "A "personalized experience" is`,
    `"personalized_experience": "A \\u201cpersonalized experience\\u201d is`,
  ],
  [
    `"cloud_native_stack": "A "cloud-native tech stack" refers`,
    `"cloud_native_stack": "A \\u201ccloud-native tech stack\\u201d refers`,
  ],
];

for (const [a, b] of pairs) s = s.replaceAll(a, b);

s = s.replace(
  /\. The "groundbreaking" part implies/g,
  `. The \\u201cgroundbreaking\\u201d part implies`,
);

// Unescaped glossary terms mid-string — would terminate JSON prematurely
s = s.replace(
  /\. "Virtualized" means resources/g,
  `. \\u201cVirtualized\\u201d means resources`,
);
s = s.replace(
  /; "elastic" means those resources/g,
  `; \\u201celastic\\u201d means those resources`,
);
s = s.replace(
  /; and "cloud-based" means everything/g,
  `; and \\u201ccloud-based\\u201d means everything`,
);

s = s.replace(
  /\. "DynamoDB or related database technologies" refers/g,
  `. \\u201cDynamoDB or related database technologies\\u201d refers`,
);

JSON.parse(s);
fs.writeFileSync(fp, s, "utf8");
console.log("fix-interview-json: OK");
