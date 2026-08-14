import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");

export function readData(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function writeData(fileName, data) {
  const filePath = path.join(DATA_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
