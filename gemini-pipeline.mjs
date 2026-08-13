#!/usr/bin/env node
/**
 * gemini-pipeline.mjs — batch driver for the standalone Gemini evaluator.
 *
 * Reads pending URLs from data/pipeline.md, fetches each job description with
 * the shipped browser-extract.mjs (headless Playwright), writes it to jds/, and
 * runs gemini-eval.mjs --file on it. Uses your GEMINI_API_KEY + GEMINI_MODEL
 * from .env — same key and model as a single gemini-eval run.
 *
 * Resumable: on a successful evaluation the pipeline.md checkbox is flipped to
 * [x], so re-running skips what's already done. Stop with Ctrl-C any time.
 *
 * Usage:
 *   node gemini-pipeline.mjs                 # evaluate every pending job
 *   node gemini-pipeline.mjs --limit 5       # only the first 5 (good for a test)
 *   node gemini-pipeline.mjs --delay 3000    # ms to wait between jobs (default 1500)
 *   node gemini-pipeline.mjs --dry-run       # list what would run, fetch/evaluate nothing
 *   node gemini-pipeline.mjs --keep-going    # don't stop on a failed evaluation (default: keep going)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { spawnSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PIPELINE = join(ROOT, 'data', 'pipeline.md');
const JDS_DIR = join(ROOT, 'jds');

const args = process.argv.slice(2);
const getFlag = (name, def) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};
const limit = parseInt(getFlag('--limit', '0'), 10);
const delayMs = parseInt(getFlag('--delay', '1500'), 10);
const retries = parseInt(getFlag('--retries', '5'), 10);
const dryRun = args.includes('--dry-run');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!existsSync(PIPELINE)) {
  console.error('❌  data/pipeline.md not found. Run `node scan.mjs` first.');
  process.exit(1);
}
if (!process.env.GEMINI_API_KEY) {
  // gemini-eval loads .env itself, but fail fast with a clear message.
  try { (await import('dotenv')).config(); } catch {}
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌  GEMINI_API_KEY not found (set it in .env).');
    process.exit(1);
  }
}

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'job';

// Parse pending rows: "- [ ] <url> | company | title | location | posted: ..."
function readPending() {
  const lines = readFileSync(PIPELINE, 'utf-8').split('\n');
  const jobs = [];
  let inPending = false;
  for (const line of lines) {
    if (/^##\s+Pending/i.test(line)) { inPending = true; continue; }
    if (/^##\s+/.test(line) && !/Pending/i.test(line)) { inPending = false; continue; }
    if (!inPending) continue;
    const m = line.match(/^- \[ \] (\S+)(?:\s*\|\s*(.*))?$/);
    if (!m) continue;
    const url = m[1];
    const meta = (m[2] || '').split('|').map((s) => s.trim());
    jobs.push({ url, company: meta[0] || '', title: meta[1] || '', location: meta[2] || '', rawLine: line });
  }
  return jobs;
}

function markDone(rawLine) {
  const content = readFileSync(PIPELINE, 'utf-8');
  writeFileSync(PIPELINE, content.replace(rawLine, rawLine.replace('- [ ]', '- [x]')));
}

function fetchJD(url) {
  const res = spawnSync('node', ['browser-extract.mjs', url, '--mode', 'jd', '--max-chars', '20000', '--timeout', '35000'],
    { cwd: ROOT, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  if (res.status !== 0) return null;
  const out = res.stdout || '';
  const match = out.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const data = JSON.parse(match[0]);
    return (data.text || '').trim() ? data : null;
  } catch { return null; }
}

const jobs = readPending();
if (jobs.length === 0) {
  console.log('✅  No pending jobs in data/pipeline.md — nothing to do.');
  process.exit(0);
}
const queue = limit > 0 ? jobs.slice(0, limit) : jobs;
mkdirSync(JDS_DIR, { recursive: true });

console.log(`\n🚀  gemini-pipeline — ${queue.length} job(s) to evaluate (model: ${process.env.GEMINI_MODEL || 'default'})\n`);

let done = 0, skipped = 0, failed = 0;
for (let i = 0; i < queue.length; i++) {
  const job = queue[i];
  const label = `[${i + 1}/${queue.length}] ${job.company || '?'} — ${job.title || job.url}`;
  console.log(`\n──────────────────────────────────────────────\n${label}\n${job.url}`);

  if (dryRun) { console.log('   (dry-run) would fetch + evaluate'); continue; }

  const jd = fetchJD(job.url);
  if (!jd) { console.warn('   ⚠️  Could not fetch JD — skipping (left unchecked).'); skipped++; continue; }

  const header = `Company: ${job.company}\nRole: ${job.title}\nLocation: ${job.location}\nURL: ${job.url}\n\n---\n\n`;
  const jdPath = join(JDS_DIR, `${String(i + 1).padStart(3, '0')}-${slugify(`${job.company}-${job.title}`)}.txt`);
  writeFileSync(jdPath, header + jd.text);

  let ok = false;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const evalRes = spawnSync('node', ['gemini-eval.mjs', '--file', jdPath], { cwd: ROOT, stdio: 'inherit', env: process.env });
    if (evalRes.status === 0) { ok = true; break; }
    if (attempt < retries) {
      const backoff = 5000 * attempt; // 5s, 10s, ... — rides out transient 503/429 spikes
      console.warn(`   ⚠️  Attempt ${attempt}/${retries} failed — retrying in ${backoff / 1000}s...`);
      await sleep(backoff);
    }
  }
  if (ok) { markDone(job.rawLine); done++; }
  else {
    failed++;
    console.warn(`   ❌  Gave up after ${retries} attempts (left unchecked — re-run to retry).`);
    if (!args.includes('--keep-going')) { console.error('\nStopping. Re-run to resume, or pass --keep-going to push past failures.'); break; }
  }
  if (i < queue.length - 1) await sleep(delayMs);
}

console.log(`\n══════════════════════════════════════════════\n✅  Done: ${done}   ⚠️  Skipped(fetch): ${skipped}   ❌  Failed(eval): ${failed}\nReports in reports/ · tracker in data/applications.md\n`);
