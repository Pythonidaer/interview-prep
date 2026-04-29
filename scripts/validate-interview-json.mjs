import fs from "fs";
import path from "path";

const fp = path.join(import.meta.dirname, "..", "interview.json");
JSON.parse(fs.readFileSync(fp, "utf8"));
console.log("validate-interview-json: OK");
