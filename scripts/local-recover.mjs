import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const envExamplePath = path.join(root, ".env.example");
const nextPath = path.join(root, ".next");
const requiredKeys = ["STAKELOOP_API_BASE_URL"];

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const values = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

if (!fs.existsSync(envPath)) {
  const hint = fs.existsSync(envExamplePath)
    ? " Copy .env.example to .env.local first."
    : "";

  console.error(`Missing .env.local in stakeloop-user.${hint}`);
  process.exit(1);
}

const envValues = parseEnvFile(envPath);
const missingKeys = requiredKeys.filter((key) => !envValues[key]);

if (missingKeys.length > 0) {
  console.error(`Missing required user env keys: ${missingKeys.join(", ")}`);
  process.exit(1);
}

if (fs.existsSync(nextPath)) {
  fs.rmSync(nextPath, { recursive: true, force: true });
  console.log("Cleared .next build cache.");
} else {
  console.log("No .next build cache found.");
}

console.log("User env check passed. Continuing with install, lint, and build...");
