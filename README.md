# Sudoku Phone App

A lightweight, mobile-friendly Sudoku web app.

## Run locally

```bash
python3 -m http.server 8000
```

Then open:
- On your computer: `http://localhost:8000`
- On your phone (same Wi-Fi): `http://<your-computer-ip>:8000`

## Deploy to GitHub Pages (automatic)

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-gh-pages.yml` that deploys the app to GitHub Pages whenever you push to `work`, `main`, or `master`.

### One-time setup

1. Push this repository to GitHub.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push a commit (or run the workflow manually from **Actions**) to trigger deployment.

After deployment, your site will be available at:
- `https://<your-username>.github.io/<your-repo-name>/`

## Code structure

JavaScript is split by responsibility to keep files readable:

- `app.js`: module entrypoint and DOM element wiring
- `js/sudoku-controller.js`: game controller (events + game actions)
- `js/config.js`: shared constants
- `js/puzzles.js`: puzzle data set
- `js/game-state.js`: pure game-state helpers
- `js/board-view.js`: board rendering and cell visual state

This project intentionally stays framework-free because the interaction surface is small and static, and native ES modules provide maintainable structure without adding a build step.

## Features

- Touch-sized Sudoku grid and keypad
- Easy/Medium/Hard puzzle sets
- Check mistakes anytime
- Hint button
- Center and corner pencil notes
