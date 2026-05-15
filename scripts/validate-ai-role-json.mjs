import fs from "fs";
import path from "path";

const fp = path.join(import.meta.dirname, "..", "ai-role.json");
const data = JSON.parse(fs.readFileSync(fp, "utf8"));

for (const [id, entry] of Object.entries(data)) {
  if (
    typeof entry !== "object" ||
    entry === null ||
    typeof entry.explanation !== "string" ||
    typeof entry.plainEnglishExplanation !== "string"
  ) {
    throw new Error(`ai-role.json: invalid entry for "${id}"`);
  }
}

console.log("validate-ai-role-json: OK");
