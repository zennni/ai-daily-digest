#!/usr/bin/env node
/**
 * Build window.HUB from authoritative JSON and inject into hub.html / index.html.
 *
 * Sources (edit these, not the HTML embed):
 *   rows.json     → models (short keys), changes, today / meta.rows*
 *   aliases.json  → aliases
 *   daily.json    → daily timeline cards
 *   news.json     → hub news feed
 *
 * Usage:
 *   node scripts/build-hub.mjs           # inject hub.html + index.html (HUB block only)
 *   node scripts/build-hub.mjs --check   # build in memory, verify vs current embed, no write
 *   node scripts/build-hub.mjs --hub-only
 *
 * After editing hub.html CSS/DOM, still run this to refresh the HUB payload,
 * then ./scripts/sync-hub-index.sh if hub is canonical for the full file.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const HUB_ONLY = args.has("--hub-only");

function readJson(name) {
  const p = path.join(ROOT, name);
  if (!fs.existsSync(p)) throw new Error(`missing ${name}`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function mapModel(r) {
  return {
    n: r.name,
    v: r.vendor,
    c: r.country,
    t: r.tier,
    aa: r.aa,
    aa_d: r.aa_dec ?? null,
    open: r.open_,
    lic: r.lic,
    pin: r.pin ?? null,
    pc: r.pcache ?? null,
    pout: r.pout ?? null,
    cost: r.cost ?? null,
    eff: r.eff ?? null,
    val: r.value ?? null,
    g: r.grade ?? "N/A",
    rk: r.rank,
    src: r.src,
  };
}

function buildHub() {
  const rows = readJson("rows.json");
  const aliases = readJson("aliases.json");
  const daily = readJson("daily.json");
  const news = readJson("news.json");

  if (!Array.isArray(rows.models) || rows.models.length === 0) {
    throw new Error("rows.json models empty");
  }
  if (!rows.date) throw new Error("rows.json missing date");

  const firstDay =
    (Array.isArray(daily) && daily.length
      ? daily[daily.length - 1].d
      : null) || "2026-08-04";

  return {
    aliases,
    models: rows.models.map(mapModel),
    daily,
    news,
    changes: rows.changes || [],
    today: rows.date,
    meta: {
      firstDay,
      rowsDate: rows.date,
      rowsCount: rows.models.length,
    },
  };
}

/** Replace only the window.HUB = {...}; assignment inside a <script> tag. */
function injectHub(html, hubJson) {
  const re =
    /(<script\b[^>]*>\s*)(?:\/\*HUB_DATA_START\*\/\s*)?window\.HUB\s*=\s*\{[\s\S]*?\};?(?:\s*\/\*HUB_DATA_END\*\/)?(\s*<\/script>)/;
  if (!re.test(html)) {
    throw new Error("window.HUB script block not found");
  }
  // reset lastIndex after test
  re.lastIndex = 0;
  const payload =
    "/*HUB_DATA_START*/window.HUB = " +
    hubJson +
    ";/*HUB_DATA_END*/";
  return html.replace(re, (_, open, close) => open + payload + close);
}

function extractHubJson(html) {
  const m = html.match(
    /window\.HUB\s*=\s*(\{[\s\S]*?\});?\s*(?:\/\*HUB_DATA_END\*\/)?\s*<\/script>/
  );
  if (!m) return null;
  return m[1];
}

function main() {
  const hub = buildHub();
  const hubJson = JSON.stringify(hub);

  const targets = HUB_ONLY
    ? ["hub.html"]
    : ["hub.html", "index.html"];

  let wrote = 0;
  for (const name of targets) {
    const p = path.join(ROOT, name);
    if (!fs.existsSync(p)) {
      console.warn(`skip missing ${name}`);
      continue;
    }
    const html = fs.readFileSync(p, "utf8");
    const prev = extractHubJson(html);
    if (CHECK) {
      let same = false;
      try {
        same = prev != null && JSON.stringify(JSON.parse(prev)) === JSON.stringify(hub);
      } catch { same = false; }
      if (same) {
        console.log(`OK ${name}: HUB matches sources (deep)`);
      } else {
        console.log(`DRIFT ${name}: HUB embed ≠ sources (run without --check to fix)`);
        process.exitCode = 2;
      }
      continue;
    }
    const next = injectHub(html, hubJson);
    if (next === html) {
      console.log(`${name}: unchanged`);
    } else {
      fs.writeFileSync(p, next);
      wrote++;
      console.log(`${name}: injected HUB (${hub.models.length} models, daily ${hub.daily.length}, news ${hub.news.length})`);
    }
  }

  if (!CHECK) {
    console.log(
      `build-hub: today=${hub.today} models=${hub.meta.rowsCount} wrote=${wrote} file(s)`
    );
    console.log("Tip: edit rows.json / aliases.json / daily.json / news.json → node scripts/build-hub.mjs");
  }
}

main();
