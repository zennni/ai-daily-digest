#!/usr/bin/env node
/**
 * Push-time consistency checks for ai-daily-digest.
 * Exit 0 = OK; non-zero = do not push.
 *
 * Usage:
 *   node scripts/preflight-check.mjs
 *   npm run preflight   (if package.json present)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const errors = [];
const warns = [];

function fail(msg) { errors.push(msg); }
function warn(msg) { warns.push(msg); }

function read(name) {
  const p = path.join(ROOT, name);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

function readJson(name) {
  const raw = read(name);
  if (raw == null) return null;
  try { return JSON.parse(raw); }
  catch (e) { fail(`${name}: JSON parse failed — ${e.message}`); return null; }
}

function latestDailyHtml() {
  const files = fs.readdirSync(ROOT)
    .filter((f) => /^AI日报-\d{4}-\d{2}-\d{2}\.html$/.test(f))
    .sort();
  return files.length ? files[files.length - 1] : null;
}

function extractHub(html) {
  const m = html && html.match(
    /window\.HUB\s*=\s*(\{[\s\S]*?\});?\s*(?:\/\*HUB_DATA_END\*\/)?\s*<\/script>/
  );
  if (!m) return null;
  try { return JSON.parse(m[1]); }
  catch (e) { fail(`HUB JSON parse failed — ${e.message}`); return null; }
}

// --- rows.json ---
const rows = readJson("rows.json");
if (!rows) fail("rows.json missing or invalid");
else {
  if (!rows.date) fail("rows.json: missing date");
  if (!Array.isArray(rows.models) || rows.models.length === 0) {
    fail("rows.json: models empty");
  }
}

// --- digest.json ---
const digest = readJson("digest.json");
if (!digest) fail("digest.json missing or invalid");
else if (!digest.meta?.date) fail("digest.json: meta.date missing");

// --- latest daily HTML ---
const latestName = latestDailyHtml();
if (!latestName) fail("no AI日报-YYYY-MM-DD.html found");
else {
  const dateFromName = latestName.match(/AI日报-(\d{4}-\d{2}-\d{2})\.html/)[1];
  const html = read(latestName);
  const titleM = html.match(/<title>([^<]*)<\/title>/i);
  if (!titleM) fail(`${latestName}: missing <title>`);
  else if (!titleM[1].includes(dateFromName)) {
    fail(`${latestName}: <title> missing date ${dateFromName} (got: ${titleM[1]})`);
  }
  if (!/\bclass=["'][^"']*\bpage-toc\b/.test(html) && !/<nav[^>]*class=["'][^"']*page-toc/.test(html)) {
    fail(`${latestName}: missing .page-toc DOM`);
  }
  for (const id of ["sec-highlights", "sec-news", "sec-papers", "sec-models", "sec-ecosystem"]) {
    const re = new RegExp(`id=["']${id}["']`);
    if (!re.test(html)) fail(`${latestName}: missing #${id}`);
  }

  // digest / rows / filename date alignment
  if (digest?.meta?.date && digest.meta.date !== dateFromName) {
    fail(`digest.json meta.date ${digest.meta.date} ≠ latest daily ${dateFromName}`);
  }
  if (rows?.date && rows.date !== dateFromName) {
    warn(`rows.json date ${rows.date} ≠ latest daily ${dateFromName} (ok if榜未同日更新)`);
  }
}

// --- list.html「最新」---
const list = read("list.html");
if (!list) fail("list.html missing");
else {
  const tags = [...list.matchAll(/<span class="latest-tag">最新<\/span>/g)];
  if (tags.length !== 1) {
    fail(`list.html: expected exactly 1「最新」tag, found ${tags.length}`);
  } else {
    // nearest date above the tag
    const idx = list.indexOf('<span class="latest-tag">最新</span>');
    const before = list.slice(Math.max(0, idx - 400), idx);
    const dm = before.match(/(\d{4}-\d{2}-\d{2})\s*·/);
    if (!dm) fail('list.html: cannot find date next to「最新」');
    else {
      const listDate = dm[1];
      if (latestName) {
        const dateFromName = latestName.match(/AI日报-(\d{4}-\d{2}-\d{2})\.html/)[1];
        if (listDate !== dateFromName) {
          fail(`list.html「最新」date ${listDate} ≠ latest daily ${dateFromName}`);
        }
      }
      if (digest?.meta?.date && listDate !== digest.meta.date) {
        fail(`list.html「最新」date ${listDate} ≠ digest.json ${digest.meta.date}`);
      }
    }
  }
}

// --- HUB.daily top date in hub + index ---
for (const name of ["hub.html", "index.html"]) {
  const html = read(name);
  if (!html) { fail(`${name} missing`); continue; }
  const hub = extractHub(html);
  if (!hub) { fail(`${name}: window.HUB not found / invalid`); continue; }
  if (!Array.isArray(hub.models) || hub.models.length === 0) {
    fail(`${name}: HUB.models empty`);
  }
  if (!Array.isArray(hub.daily) || hub.daily.length === 0) {
    fail(`${name}: HUB.daily empty`);
  } else {
    const top = hub.daily[0].d;
    if (latestName) {
      const dateFromName = latestName.match(/AI日报-(\d{4}-\d{2}-\d{2})\.html/)[1];
      if (top !== dateFromName) {
        fail(`${name}: HUB.daily[0].d ${top} ≠ latest daily ${dateFromName}`);
      }
    }
    if (digest?.meta?.date && top !== digest.meta.date) {
      fail(`${name}: HUB.daily[0].d ${top} ≠ digest.json ${digest.meta.date}`);
    }
  }
  if (hub.today && digest?.meta?.date && hub.today !== digest.meta.date) {
    warn(`${name}: HUB.today ${hub.today} ≠ digest ${digest.meta.date}`);
  }
  // optional: HUB models vs rows deep check if sources exist
  if (rows?.models) {
    if (hub.models.length !== rows.models.length) {
      fail(`${name}: HUB.models ${hub.models.length} ≠ rows.json ${rows.models.length}`);
    }
  }
}

// --- source files present for single-source workflow ---
for (const name of ["aliases.json", "daily.json", "news.json"]) {
  if (!fs.existsSync(path.join(ROOT, name))) {
    warn(`${name} missing — run extract or restore before build-hub`);
  }
}

// report
for (const w of warns) console.log("WARN  " + w);
if (errors.length) {
  for (const e of errors) console.log("FAIL  " + e);
  console.log(`preflight: ${errors.length} error(s), ${warns.length} warning(s)`);
  process.exit(1);
}
console.log(`preflight: OK (${warns.length} warning(s))`);
process.exit(0);
