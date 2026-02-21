# AGENTS.md

## Purpose
This file explains the minimum validation steps to run for any change in this repository so iteration stays fast and consistent.

## Project layout
- Static web app (no build step): `index.html`, `styles.css`, `app.js`
- Documentation: `README.md`

## Required checks for all code changes
Run these from the repo root:

1. JavaScript syntax check
   ```bash
   node --check app.js
   ```

2. Serve the app locally
   ```bash
   python3 -m http.server 4173
   ```
   Then open `http://127.0.0.1:4173/index.html`.

3. Manual smoke test in the browser
   - Start a new puzzle
   - Enter a value using keypad buttons
   - Use **Check** and **Hint** once
   - If the change touches notes/UI interactions, verify both center and corner note flows

## Optional automated browser check
If Playwright browser tooling is available, run an automated interaction check against `http://127.0.0.1:4173/index.html` and capture a screenshot for UI-visible changes.

## Change-specific expectations
- **UI/style changes**: include a screenshot in the PR notes.
- **Game logic changes**: always test at least one full interaction path (select cell → keypad input → state update visible in grid).
- **Docs-only changes**: no browser run needed.

## PR checklist
- Include a concise summary of what changed.
- List exact commands run for validation and whether they passed.
