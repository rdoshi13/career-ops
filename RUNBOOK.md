# career-ops — Local Runbook (Rishabh)

Your fork, run entirely from the terminal on the standalone **Gemini** path (no AI CLI needed).
Everything runs locally against your files. `scan.mjs` is zero-token; evaluation uses your Gemini key.

Repo: `~/Documents/personal repos/career-ops`

---

## 0. One-time setup (already mostly done)

Already configured: `cv.md`, `config/profile.yml`, `modes/_profile.md`, `portals.yml`, and `.env`
(paid Gemini key + `GEMINI_MODEL=gemini-flash-latest`, since `gemini-2.5-flash` is deprecated).
Eval dependencies are installed.

Two things to finish:

```bash
cd ~/"Documents/personal repos/career-ops"

# (a) Install the Chromium browser Playwright needs for PDF generation
npx playwright install chromium

# (b) Health check — verifies Node, deps, Playwright, config
node doctor.mjs
```

### ⚠️ Fix the API-key shadowing (important)

Your `~/.zshrc` exports `GEMINI_API_KEY` (the **free** key). The eval scripts load `.env` but
do **not** override an existing shell variable — so from an interactive terminal, career-ops would
use the free key, not the paid one in `.env`.

Pick one:

- **Recommended — stop exporting it globally.** Comment out the line in `~/.zshrc`:
  ```bash
  # export GEMINI_API_KEY="<your-free-key>"   # free key — let each repo's .env decide
  ```
  Then `rishabh-os` uses its `.env.local` (free) and career-ops uses its `.env` (paid). Clean separation.
- **Or per-command:** prefix runs with `env -u GEMINI_API_KEY` to force `.env` to win, e.g.
  `env -u GEMINI_API_KEY node gemini-eval.mjs ...`

---

## 1. Discover jobs — `scan.mjs` (zero-token)

Pulls current openings from ~40 companies' public ATS APIs (Greenhouse/Ashby/Lever), filtered by
`portals.yml` (your title + location filters). Writes to `data/pipeline.md`.

```bash
node scan.mjs                    # scan all enabled companies
node scan.mjs --dry-run          # preview matches, write nothing
node scan.mjs --company Vercel   # single company
node scan.mjs --verify           # Playwright-check each URL, drop dead postings
```

Tune what it finds by editing `portals.yml` → `title_filter`, `location_filter`, `tracked_companies`.

---

## 2. Evaluate a job — `gemini-eval.mjs`

Scores one JD against your profile → A–G report in `reports/`, tracker entry, cover-letter draft.

```bash
# Paste the JD inline:
node gemini-eval.mjs "Full Stack Engineer at Acme. Requirements: React, Node, Postgres..."

# Or from a file:
node gemini-eval.mjs --file ./jds/acme-fullstack.txt
```

Output: `reports/NNN-company-DATE.md` (full evaluation), plus a row merged into `data/applications.md`.
Anything scoring **≥ 4.0/5** is worth applying to; the system flags lower scores as skip.

### Batch — evaluate the whole pipeline automatically (`gemini-pipeline.mjs`)

`gemini-eval` takes one JD at a time. To score everything in `data/pipeline.md` on your
Gemini key without pasting anything, use the batch driver (custom wrapper in this fork):

```bash
node gemini-pipeline.mjs                 # fetch + evaluate every pending job
node gemini-pipeline.mjs --limit 10      # just the first 10 (good for a test)
node gemini-pipeline.mjs --keep-going    # don't stop if one job exhausts its retries
node gemini-pipeline.mjs --dry-run       # list what would run, do nothing
# flags: --delay <ms> between jobs (default 1500), --retries <n> on transient 503/429 (default 5)
```

It reads pending URLs, fetches each JD with the headless `browser-extract.mjs`, and runs
`gemini-eval` on it — writing a report + tracker row per job. It's **resumable**: each
success flips the `pipeline.md` checkbox to `[x]`, so re-running continues where it left off.
Gemini's `gemini-flash-latest` occasionally returns 503 "high demand" — the built-in retries
(5s→10s→… backoff) ride those out. For a full unattended run over 100+ jobs, use `--keep-going`.
Budget ~1–2 min per job (fetch + model), so a large pipeline runs for a couple of hours; you
can stop with Ctrl-C and resume any time.

---

## 3. Track & view

```bash
node tracker.mjs                 # tracker operations (see --help)
npm run build:dashboard          # build the static dashboard
npm run serve:dashboard          # serve the Go TUI/web dashboard  (requires Go installed)
```

Canonical tracker files are human-readable: `data/applications.md`, `reports/`, `data/pipeline.md`.
SQLite is only a derived index — the Markdown files are the source of truth.

---

## 4. Generate application docs (needs Playwright chromium from step 0)

CV/cover-letter PDF generation is most automated through an AI CLI (`/career-ops pdf`, `/career-ops cover`).
On the pure-Gemini path the eval writes a cover-letter **draft** into each report; to render PDFs directly:

```bash
node generate-pdf.mjs <input.html> <output.pdf> --format=letter --report=NNN
node generate-cover-letter.mjs --payload <path>
```

---

## 5. Maintenance

```bash
npm run update:check             # see if the upstream tool has updates (never touches your data)
npm run update                   # apply system-file updates
git add cv.md config/ modes/_profile.md portals.yml && git commit -m "update profile"
```

`.env` is gitignored — your keys never get committed. Your data files (`cv.md`, `config/`,
`data/`, `reports/`, `jds/`) are yours; the updater only touches system files.

---

## Typical daily loop

```bash.


cd ~/"Documents/personal repos/career-ops"
node scan.mjs                       # 1. find new roles
# open data/pipeline.md, copy a JD you like into jds/role.txt
node gemini-eval.mjs --file ./jds/role.txt   # 2. score it
# read reports/NNN-*.md; if >= 4.0, apply
```
