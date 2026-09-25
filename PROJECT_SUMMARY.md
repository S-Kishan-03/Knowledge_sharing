# MechWiki — Project Summary (Injectible Context)

> **Purpose:** This file provides complete project context for AI agents. Inject this instead of reading all source files.

---

## Project Identity

- **Name:** MechWiki — Mechanical Engineering Knowledge Hub
- **Type:** Static, JSON-driven wiki + interactive calculators
- **Hosting:** GitHub Pages (zero-config, no build step required currently)
- **License:** MIT
- **Stack:** Vanilla ES6+ JavaScript, CSS Custom Properties, KaTeX, Marked.js
- **Architecture:** Client-side hash routing, lazy-loaded topic content, embedded calculators

---

## Core Value Proposition

**Interactive engineering reference** where every topic includes:
- Wikipedia-style infoboxes with key formulas (LaTeX/KaTeX)
- Live, unit-aware calculators (6 currently)
- Cross-topic wiki links (`[[topic-id|Label]]`)
- Structured sections with markdown content
- Key takeaways + related topics

---

## File Structure (Key Files Only)

```
MechWiki/
├── index.html                    # SPA entry point
├── css/styles.css                # 982 lines — design system, glassmorphism, responsive
├── js/
│   ├── app.js                    # 125 lines — init, theme, sidebar, search, router setup
│   ├── router.js                 # 44 lines — hash-based client router
│   ├── renderer.js               # 353 lines — home view, topic view, TOC, KaTeX, calculators
│   └── calculators.js            # 550 lines — 6 calculators (switch-based, HTML strings)
├── data/
│   ├── index.json                # 410 lines — site config, 8 categories, 33 topics metadata
│   └── topics/                   # 33 JSON files — full topic content
│       ├── stress-strain-analysis.json
│       ├── thermodynamics-laws.json
│       ├── bernoulli-fluid-mechanics.json
│       ├── spur-gear-design.json
│       ├── gdnt-fundamentals.json
│       └── ... (28 more)
├── README.md                     # User-facing documentation
└── .codegraph/                   # Code intelligence index (auto-generated)
```

---

## Data Schema (Topic JSON)

```json
{
  "id": "unique-slug",
  "title": "Display Title",
  "category": "Category Name",
  "categoryId": "category-slug",
  "readTime": "8 min",
  "difficulty": "Beginner|Intermediate|Advanced",
  "icon": "icon-key",           // Maps to Renderer.getIcon()
  "summary": "One-line summary",
  "tags": ["Tag1", "Tag2"],
  "lastUpdated": "2026-09-23",
  "infobox": {
    "title": "Infobox Title",
    "imageSymbol": "🔧",
    "keyFormulas": [{ "label": "Name", "math": "LaTeX string" }],
    "siUnits": "Unit string",
    "primaryFields": "Field names",
    "keyConstants": "Constants (optional)"
  },
  "sections": [
    {
      "id": "section-id",
      "heading": "Section Heading",
      "content": "Markdown content with [[wiki-links]] and $$LaTeX$$",
      "calculator": "calculator_type_key"  // Optional
    }
  ],
  "keyTakeaways": ["Takeaway 1", "Takeaway 2"],
  "relatedTopics": ["topic-id-1", "topic-id-2"]
}
```

---

## Calculators (6 Implemented)

| Key | Title | Inputs | Outputs |
|-----|-------|--------|---------|
| `carnot_calculator` | Carnot Engine Efficiency | Th, Tc (°C/K), Qh (kJ) | η (%), W (kJ), Qc (kJ) |
| `bernoulli_calculator` | Fluid Continuity & Pressure Drop | D1, D2 (mm), v1 (m/s), ρ (kg/m³) | v2 (m/s), Q (L/s), ΔP (kPa) |
| `stress_calculator` | Axial Stress/Strain/Elongation | F (kN), d (mm), L0 (mm), E (GPa) | σ (MPa), ε, ΔL (mm) |
| `gear_calculator` | Spur Gear Ratio & Torque | Z1, Z2, m (mm), N1 (RPM), T1 (N·m) | i, N2 (RPM), T2 (N·m), a (mm) |
| `machining_calculator` | Cutting Speed/Feed/MRR | Vc (m/min), D (mm), z, fz (mm), ap, ae (mm) | N (RPM), F (mm/min), MRR (cm³/min) |
| `gdnt_position_calculator` | Position Tolerance @ MMC | Tspec, Dmmc, Dactual, posErr (mm) | Bonus, Total, Pass/Fail |

**Architecture:** Single `Calculators` object with `render(type, containerId)` + `init{Type}Events()` per calculator. HTML templates as template literals. Event listeners attached via `input` on each field.

---

## Router Contract

```javascript
Router.navigate('home')                          // Home dashboard
Router.navigate('category/${categoryId}')        // Filtered category view
Router.navigate('topic/${topicId}')              // Deep-dive topic view
// Hash format: #home, #category/thermal, #topic/stress-strain-analysis
```

---

## Renderer API

```javascript
Renderer.renderHome(indexData, activeCategory?, searchQuery?)
Renderer.renderTopic(topicId)                    // Fetches topic JSON, renders full view
Renderer.parseWikiLinks(html)                    // [[id|label]] → <a class="wiki-link">
Renderer.highlightActiveSidebar(topicId)
Renderer.getIcon(iconKey)                        // Returns emoji
```

---

## CSS Design Tokens (Key)

```css
:root {
  /* Dark (default) */
  --bg-primary: #0b0f19;
  --bg-card: #1f293d;
  --accent-primary: #6366f1;
  --accent-secondary: #06b6d4;
  --accent-gradient: linear-gradient(135deg, #6366f1, #06b6d4);
  --glass-bg: rgba(17, 24, 39, 0.75);
  --font-sans: 'Inter';
  --font-heading: 'Outfit';
  --font-mono: 'JetBrains Mono';
}
[data-theme="light"] { /* light overrides */ }
```

---

## External Dependencies (CDN)

| Library | Version | Purpose |
|---------|---------|---------|
| KaTeX | 0.16.8 | LaTeX math rendering |
| Marked.js | latest | Markdown → HTML |
| Google Fonts | — | Inter, Outfit, JetBrains Mono |

---

## Current Limitations (Known)

1. **Performance:** All 33 topics loaded in `masterIndexData` at startup (~50KB JSON)
2. **No Search Index:** Live search filters in-memory array; O(n) on each keystroke
3. **No SEO:** No sitemap, robots.txt, JSON-LD, Open Graph tags
4. **Accessibility Gaps:** Missing ARIA, focus trap, KaTeX a11y
5. **Calculator Tech Debt:** 550-line switch, no TypeScript, untestable
6. **Content Authoring:** Manual 2-file edit, no validation
7. **No Build Step:** All processing client-side; limits optimization

---

## Planned Improvements (In Progress)

See `REVIEW.md` for full plan. Priority order:

1. Split `index.json` → `index-meta.json` + `search-index.json` (build-time)
2. JSON Schema validation + GitHub Action
3. CLI tool: `scripts/new-topic.js`
4. Accessibility fixes (ARIA, focus trap, search live region)
5. Calculator refactor → TypeScript registry pattern with Zod
6. SEO: sitemap.xml, robots.txt, JSON-LD, Open Graph injection
7. Lazy-load topic metadata, integrate search index

---

## Key Entry Points for AI Agents

| Task | Start Here |
|------|------------|
| Add new topic | `data/index.json` + `data/topics/new-topic.json` (see README.md) |
| Modify calculator | `js/calculators.js` → find `get{Name}HTML()` + `init{Name}Events()` |
| Change styling | `css/styles.css` — design tokens at top, components below |
| Modify topic rendering | `js/renderer.js` → `renderTopic()` |
| Change routing | `js/router.js` → `Router.register()` |
| Add category | `data/index.json` → `categories` array + `categoryId` in topics |

---

## Commands for Local Development

```bash
# Preview locally
python -m http.server 8000
# Open http://localhost:8000

# Validate topic JSON (after schema added)
node scripts/validate-topics.js

# Create new topic (after CLI added)
node scripts/new-topic.js --title "New Topic" --category solids

# Build search index (after script added)
node scripts/build-search-index.js

# Generate SEO artifacts (after script added)
node scripts/generate-sitemap.js
```

---

## GitHub Pages Deployment

1. Push to `main` branch
2. Settings → Pages → Source: `main` / `/ (root)`
3. Live at `https://USERNAME.github.io/REPO/`

**No build step required currently.** All processing is client-side.

---

## Extending the Platform

### Add a New Calculator
1. Add HTML template in `Calculators.get{Name}HTML()`
2. Add event handler in `Calculators.init{Name}Events()`
3. Register in `Calculators.calculatorTypes` array
4. Reference in topic JSON: `"calculator": "name_calculator"`

### Add a New Category
1. Add to `data/index.json` → `categories` array
2. Add `categoryId` to relevant topics
3. Icon key must exist in `Renderer.getIcon()`

### Modify Topic Content
Edit `data/topics/{topic-id}.json` — markdown in `sections[].content`, formulas in `infobox.keyFormulas[].math`

---

## Testing Checklist (Manual)

- [ ] Home page loads, categories render, search works
- [ ] Category filter shows correct topics
- [ ] Topic view loads: infobox, sections, TOC, calculators, takeaways, related
- [ ] Wiki links navigate correctly
- [ ] All 6 calculators compute correctly (test edge cases)
- [ ] Dark/light theme toggle persists
- [ ] Mobile sidebar opens/closes
- [ ] Responsive layout at 320px, 768px, 1024px, 1440px
- [ ] KaTeX renders in infobox + section content
- [ ] Browser back/forward works (hash routing)

---

## Contact / Ownership

- **Maintainer:** Kishan (GitHub CLI Utility Tools)
- **Issues:** GitHub Issues on repo
- **Contributions:** PRs welcome — follow JSON schema

---

*Generated: 2026-09-25 | This file is the authoritative project context for AI agents.*