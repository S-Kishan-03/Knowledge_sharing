# Hosting MechWiki on GitHub Pages

MechWiki is 100% client-side (built with React, TypeScript, and Vite) and uses hash routing (`#roadmap`, `#topic/...`, `#calculators/...`), making it **perfect for free hosting on GitHub Pages** with zero 404 routing issues or server backend requirements.

---

## Method 1: Automatic Deployment with GitHub Actions (Recommended)

An automated deployment workflow is pre-configured in `.github/workflows/deploy.yml`.

### Steps:
1. **Push your code to GitHub (including `package-lock.json`)**:
   ```bash
   git init
   git add .
   git commit -m "Initial MechWiki commit with lock file"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages via Actions**:
   - Go to your repository on GitHub.
   - Click **Settings** (tab at the top).
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.

3. **Done!**
   - GitHub Actions will run the workflow and publish your site at:
     `https://<your-username>.github.io/<your-repo-name>/`

---

## 🛠️ Note on Lock Files (`package-lock.json`)

If GitHub Actions reports:
> *Missing dependency lock file — The workflow can't find package-lock.json, npm-shrinkwrap.json, or yarn.lock in your repository.*

Both safeguards are already in place:
1. `package-lock.json` has been generated and included in the root directory. Make sure to commit it (`git add package-lock.json`).
2. `.github/workflows/deploy.yml` has been updated to remove the strict `cache: 'npm'` requirement on `actions/setup-node@v4` and use resilient install logic (`if [ -f package-lock.json ]; then npm ci; else npm install; fi`), ensuring builds succeed even if committed without a lockfile.

---

## Method 2: Manual / Deploy via `gh-pages` Branch

If you prefer building locally and pushing the `dist` folder:

1. Build the production files:
   ```bash
   npm run build
   ```
2. The bundled assets will be generated in `/dist`.
3. In GitHub Settings > Pages, choose **Deploy from a branch** and select the `gh-pages` branch or the folder containing the built files.

---

## Why It Works Seamlessly

- **Base path configured**: `vite.config.ts` uses `base: './'`, ensuring assets load correctly whether hosted at the domain root (`username.github.io`) or inside a repository subdirectory (`username.github.io/mechwiki/`).
- **Hash-based routing**: URLs like `/#roadmap` and `/#topic/gdnt-fundamentals` reload cleanly on any static host without requiring Apache/Nginx `.htaccess` or fallback rewrite rules.
