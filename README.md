# MechWiki - Mechanical Engineering Roadmap & Knowledge Hub

An interactive, modern Mechanical Engineering knowledge sharing platform and visual learning roadmap inspired by [roadmap.sh](https://roadmap.sh/frontend). Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **KaTeX**—engineered specifically for zero-configuration, 100% static hosting on **GitHub Pages**.

![Status](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)
![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub_Pages-22c55e?logo=github)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Key Features

### 🗺️ Visual Learning Roadmap (Inspired by roadmap.sh)
- **3-Phase Structured Journey**: Curated into the 3 core pillars of mechanical engineering:
  - **Phase 1 · Product Design & CAD**: Requirements, 3D CAD modeling, engineering drawings & BOM, ISO fits & surface finishes, GD&T fundamentals, tolerance stack-up, machine elements, and prototype validation.
  - **Phase 2 · Simulation & Analysis (CAE)**: Statics, stress & strain, kinematics, thermodynamics & power cycles, Bernoulli fluid mechanics, thermal & CFD analysis, structural FEA, fatigue life, and topology optimization.
  - **Phase 3 · Manufacturing & CAM**: Subtractive CNC machining, feeds & speeds, cutting tool selection, sheet metal design, plastic injection molding, casting, additive manufacturing / 3D printing, CMM metrology, and statistical process control (SPC).
- **Interactive Node Controls**: Click any roadmap node to open a detailed summary drawer, preview key takeaways, and jump directly into the full topic or linked calculator.
- **Progress Tracking**: Mark topics as *Unread*, *In Progress*, or *Completed*. Progress is saved locally in `localStorage`.
- **Flowchart & Step List Views**: Switch between a visual interconnected flowchart and an ordered step-by-step checklist.
- **Smart Next Step**: One-click "Next Recommended Topic" button to keep you moving along the curriculum.

### 📐 Native LaTeX Equation Rendering
- Mathematical formulas are natively rendered via **KaTeX** ($$\sigma = \frac{F}{A}$$, $$\eta = 1 - \frac{T_C}{T_H}$$, $$v = \frac{\pi \cdot D \cdot N}{1000}$$), delivering crisp rendering without external image dependencies.

### 🧮 6 Built-in Interactive Engineering Calculators
Integrated directly into relevant roadmap topics:
1. **Carnot Engine Efficiency Calculator**: Calculate theoretical thermal efficiency from hot and cold reservoir temperatures ($$T_H, T_C$$).
2. **Fluid Flow & Bernoulli Pressure Drop Calculator**: Compute flow rates, velocity, and pressure changes using Bernoulli's equation.
3. **Axial Stress, Strain & Elongation Calculator**: Determine mechanical stress, strain, and total displacement based on Young's Modulus ($$E$$) and applied load ($$F$$).
4. **Spur Gear Ratio & Torque Transformer**: Calculate pitch diameters, velocity ratios, output RPM, and torque multiplication.
5. **CNC Milling Speeds & Feeds Calculator**: Compute spindle speed (RPM), feed rate (mm/min or in/min), and material removal rate (MRR) based on tool diameter, flutes, surface speed ($$V_c$$), and chip load ($$f_z$$).
6. **GD&T True Position & Bonus Tolerance Calculator**: Compute radial error, true diametral position error, and bonus tolerance based on MMC / LMC departure conditions.

### 🌙 Robust Dark & Light Mode
- Clean, eye-friendly light mode and modern dark mode with glassmorphism effects.
- Instant toggle with persistence in `localStorage` and system theme detection.

### 🔍 Live Instant Search & Filtering
- Real-time client-side search across all 30 engineering topics, formulas, summaries, and tags.
- Filter by category, reading status, or search query.

### 📱 Responsive Layout with Collapsible Navigation
- Collapsible sidebar navigation for distraction-free reading.
- Toggle via top navbar icon, sidebar header close button, floating edge tab, or keyboard shortcut (`Ctrl+B` / `Cmd+B`).
- Clean sequential "Previous Topic" and "Next Topic" controls at the end of each guide.

---

## 🚀 Hosting on GitHub Pages (Zero Config)

MechWiki is 100% static with client-side hash routing (`/#roadmap`, `/#topic/...`, `/#calculators/...`) and relative asset paths (`base: './'`), so it **never encounters 404 errors** on GitHub Pages.

### Automated Deployment (GitHub Actions - Recommended)

The repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of MechWiki"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages in your repository settings**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** &rarr; **Pages** (in the left sidebar).
   - Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.

3. **Live!**
   GitHub will automatically build and publish your site at:
   `https://<your-username>.github.io/<your-repo-name>/`

---

## 💻 Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `pnpm`

### Installation & Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd mechwiki
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local Vite development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   This compiles TypeScript and outputs optimized static bundles to the `/dist` directory.

5. **Type check**:
   ```bash
   npm run lint
   ```

---

## 📁 Project Structure

```
mechwiki/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── data/
│   ├── index.json              # Catalog metadata and categories
│   └── topics/                 # Topic content JSON files
│       ├── thermodynamics-laws.json
│       ├── gdnt-fundamentals.json
│       └── ...
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation, search modal trigger & theme toggle
│   │   ├── Sidebar.tsx         # Category and topic navigation sidebar
│   │   ├── RoadmapView.tsx     # roadmap.sh-style interactive visual roadmap
│   │   ├── TopicDetailView.tsx # Article layout, formulas, infobox & takeaways
│   │   ├── CalculatorView.tsx  # 6 Interactive engineering calculators
│   │   ├── MathRenderer.tsx    # KaTeX math equation component
│   │   └── SearchModal.tsx     # Full-text fuzzy search dialog
│   ├── data/
│   │   └── topicsRegistry.ts   # Bundled topic registry & roadmap sequencing
│   ├── types.ts                # TypeScript interfaces
│   ├── App.tsx                 # Main layout & hash router
│   ├── main.tsx                # React root entry point
│   └── index.css               # Tailwind CSS v4 styling & dark mode definitions
├── GITHUB_PAGES_DEPLOY.md      # Detailed GitHub Pages setup notes
├── package.json
├── tsconfig.json
├── vite.config.ts              # Vite configuration with relative base path
└── README.md
```

---

## ✍️ Adding a New Topic

Topics are modular and cleanly structured in JSON.

1. **Add metadata to `data/index.json`**:
   ```json
   {
     "id": "new-topic-slug",
     "title": "Topic Title",
     "category": "Product Design & CAD",
     "categoryId": "product-design",
     "readTime": "7 min",
     "difficulty": "Intermediate",
     "icon": "cog",
     "summary": "High-level summary of the topic.",
     "tags": ["Design", "CAD", "Engineering"]
   }
   ```

2. **Create the content file `data/topics/new-topic-slug.json`**:
   ```json
   {
     "id": "new-topic-slug",
     "title": "Topic Title",
     "category": "Product Design & CAD",
     "categoryId": "product-design",
     "readTime": "7 min",
     "difficulty": "Intermediate",
     "icon": "cog",
     "summary": "High-level summary of the topic.",
     "infobox": {
       "title": "Quick Reference",
       "imageSymbol": "⚙️",
       "keyFormulas": [
         { "label": "Key Formula", "math": "\\sigma = \\frac{F}{A}" }
       ],
       "siUnits": "Pascal (Pa), N/m²"
     },
     "sections": [
       {
         "id": "intro",
         "heading": "Introduction",
         "content": "Detailed technical explanation..."
       }
     ],
     "keyTakeaways": [
       "Core insight 1",
       "Core insight 2"
     ]
   }
   ```

3. Register the topic in `src/data/topicsRegistry.ts` to include it in the roadmap curriculum sequence.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
