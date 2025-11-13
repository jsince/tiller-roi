# Repository Guidelines

## Project Structure & Module Organization
- `index.html`: Landing page, calculator layout, modal copy, and script include.
- `styles.css`: All typography, layout, and responsive treatments (no preprocessor).
- `src/main.js`: Calculator state, rendering helpers, math engine, CSV export.
- `assets/`: Reserved for imagery or static downloads (currently empty).
- `README.md`: Quick-start plus backlog ideas; `AGENTS.md` expands contributor rules.

## Build, Test, and Development Commands
- `open index.html` (macOS) / `xdg-open index.html` (Linux): launch the calculator directly.
- `python3 -m http.server 5173`: serve the project locally at `http://localhost:5173/`.
- There is no bundler, package manager, or automated test suite yet—keep contributions framework-free unless discussed.

## Coding Style & Naming Conventions
- HTML: semantic sections (`header`, `main`, `section`, `article`) with BEM-ish utility classes (`hero__cta`, `panel__header`).
- CSS: 2-space indentation, CSS custom properties for theme tokens, avoid vendor-specific hacks.
- JavaScript: modern ES modules, const/let, arrow functions where practical, camelCase for variables/functions, `UPPER_SNAKE_CASE` only for constants like `STORAGE_KEY`.
- Comments: add only where logic is non-obvious (e.g., explaining clamp limits); keep them concise.

## Testing Guidelines
- Manual verification only: switch between CRO/Redesign tabs, vary horizon toggle, and confirm KPIs, waterfall, sensitivity, and CSV export update live.
- Before opening a PR, smoke-test in at least one Chromium browser and Safari (macOS) to catch slider/input quirks.
- If you add automated tests (e.g., Playwright), co-locate scripts under `tests/` and document run commands in `README.md`.

## Commit & Pull Request Guidelines
- Commits should be task-scoped with imperative verbs, e.g., `Add sensitivity table export` or `Fix baseline form validation`.
- PR checklist: summary of changes, testing notes (manual steps + browser), screenshots/GIFs for meaningful UI updates, and linked issue or ticket reference.
- Avoid force-pushes after review unless rebasing is explicitly requested; keep history readable for downstream audits.
