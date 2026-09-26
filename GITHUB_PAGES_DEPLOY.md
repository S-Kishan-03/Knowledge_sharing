# Hosting MechWiki on GitHub Pages

MechWiki is 100% client-side (built with React, TypeScript, and Vite) and uses hash routing (`#roadmap`, `#topic/...`, `#calculators/...`), making it **perfect for free hosting on GitHub Pages** with zero 404 routing issues or server backend requirements.

---

## Method 1: Automatic Deployment with GitHub Actions (Recommended)

An automated deployment workflow is already configured in `.github/workflows/deploy.yml`.

### Steps:
1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial MechWiki commit"
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
   - GitHub will automatically trigger the workflow and publish your site at:
     `https://<your-username>.github.io/<your-repo-name>/`

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
