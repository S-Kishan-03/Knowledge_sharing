# MechWiki — Technical Review & Improvement Plan

**Date:** 2026-09-25  
**Reviewer:** Sisyphus (AI Orchestrator)  
**Project:** Mechanical Engineering Knowledge Sharing Platform  
**Rating:** 8.5/10 — Strong execution, unique niche value

---

## Executive Summary

MechWiki is a well-architected, JSON-driven static wiki for mechanical engineering, purpose-built for zero-config GitHub Pages hosting. Its standout feature is **6 production-quality interactive engineering calculators** embedded directly in topics — a rare and high-value differentiator for a static site.

The codebase demonstrates solid front-end architecture: clean separation of concerns (router, renderer, app, calculators), modern CSS with design tokens, responsive glassmorphism UI, and client-side navigation via hash routing.

---

## Detailed Ratings

| Area | Score | Notes |
|------|-------|-------|
| **Architecture** | 9/10 | JSON-driven, zero-build, perfect for GitHub Pages. Clean separation of content/data/logic. |
| **Design System** | 9/10 | Glassmorphism + CSS custom properties, dark/light theming, responsive, polished typography (Inter/Outfit/JetBrains Mono). |
| **Engineering Calculators** | 9.5/10 | **Killer feature** — 6 calculators (Carnot, Bernoulli, Stress, Gear, Machining, GD&T) with live updates. Rare in static wikis. |
| **Content Model** | 8/10 | Rich schema: infoboxes, wiki-links (`[[id\|label]]`), sections with embedded calculators, TOC, related topics, key takeaways. |
| **UX/Navigation** | 8.5/10 | Instant search, collapsible sidebar, breadcrumbs, sticky TOC with scrollspy, mobile-first. |
| **Math Rendering** | 8/10 | KaTeX integration works well for LaTeX in content. |
| **Performance** | 6/10 | All topics loaded at startup; no search index; will degrade at scale. |
| **Accessibility** | 5/10 | Missing ARIA attributes, focus management, screen-reader support for math. |
| **SEO/Discoverability** | 3/10 | No sitemap, robots.txt, structured data, or Open Graph tags. |
| **Developer Experience** | 5/10 | Manual 2-file content creation; no validation; calculator code hard to extend. |

---

## Critical Issues (Must Fix)

### 1. Performance & Scale — All Topics Loaded at Startup
**File:** `js/app.js:42-50`  
**Problem:** `masterIndexData` loads all 33 topics (~50KB) on every page load. At 300 topics → ~500KB+.  
**Fix:** Split `index.json` → `index-meta.json` (categories + topic metadata only) + lazy-load topic content. Build client-side search index (FlexSearch/MiniSearch) at build time.

### 2. Content Authoring Friction — Manual 2-File Process
**Files:** `data/index.json` + `data/topics/*.json`  
**Problem:** No validation, ID mismatches possible, repetitive boilerplate.  
**Fix:** Add JSON Schema (`data/schema/topic.schema.json`), GitHub Action validation, and CLI tool (`scripts/new-topic.js`).

### 3. Accessibility Gaps
| Issue | Location | Severity |
|-------|----------|----------|
| Missing `aria-expanded`/`aria-controls` | Sidebar toggle, category accordions | High |
| Search input lacks `aria-label`/live region | `global-search-input` | High |
| KaTeX math not screen-reader accessible | `renderer.js:249-257` | Medium |
| Focus trap missing in mobile sidebar | `.app-sidebar.open` | High |
| Missing heading hierarchy in topic view | `renderer.js:216-224` | Medium |

### 4. Calculator Architecture — Technical Debt
**File:** `js/calculators.js` (550 lines)  
**Problems:** Giant switch statement, HTML strings inline, no TypeScript, duplicated event binding, untestable.  
**Fix:** Refactor to registry pattern with Zod schemas, typed inputs/outputs, separate render/compute logic.

### 5. SEO & Discoverability — Nearly Non-Existent
**Missing:** `sitemap.xml`, `robots.txt`, JSON-LD structured data (`LearningResource`), Open Graph/Twitter Card meta tags per topic.  
**Fix:** Add build-step GitHub Action to generate static SEO artifacts.

---

## High-Impact Improvements (Should Fix)

### 6. Search Index Generation
Build a **static search index** at build time (FlexSearch or MiniSearch) → ship as `search-index.json`. Enables instant search without loading all topic content.

### 7. Topic Schema Versioning
Add `schemaVersion` to topic JSON to enable future migrations.

### 8. Error Boundary & Loading States
Improve loading spinner, add retry logic for failed topic fetches, show partial content on error.

### 9. Analytics / Telemetry (Privacy-First)
Add optional, opt-in Plausible or Umami analytics via GitHub Pages-compatible snippet.

---

## Nice-to-Have (Deferred)

- Mermaid.js diagram support in markdown
- `<model-viewer>` for 3D CAD models (GLTF/STL)
- Code playgrounds for CAD automation APIs (WebAssembly)
- End-of-topic quizzes with localStorage progress
- PWA/Service Worker for offline access
- Multi-language (i18n) support
- User accounts / progress tracking (requires backend)
- AI-powered "Ask MechWiki" RAG system
- Mobile app via Capacitor
- LMS integration (SCORM/xAPI)
- Calculator/template marketplace

---

## Implementation Priority Order

```
Week 1 (Critical):
├── Split index.json → index-meta.json + search index generation
├── JSON Schema + GitHub Action validation
├── CLI tool: scripts/new-topic.js
├── Accessibility fixes (ARIA, focus trap, search live region, KaTeX a11y)
└── SEO: sitemap.xml, robots.txt, JSON-LD, Open Graph injection

Week 2 (Architecture):
├── Calculator refactor → TypeScript registry pattern
├── Update renderer for lazy loading + SEO meta injection
└── Add build scripts (package.json, tsconfig.json)

Week 3+ (Polish):
├── Search index integration
├── Topic schema versioning
├── Improved error/loading states
└── Optional analytics
```

---

## File Structure After Refactor

```
MechWiki/
├── index.html                    # Entry point (minimal changes)
├── css/styles.css                # Design system (minor a11y updates)
├── js/
│   ├── app.js                    # Lazy-load index-meta, init search index
│   ├── router.js                 # Unchanged
│   ├── renderer.js               # SEO meta injection, a11y improvements
│   ├── calculators/
│   │   ├── index.ts              # Registry + exports
│   │   ├── types.ts              # Zod schemas, TypeScript interfaces
│   │   ├── carnot.ts
│   │   ├── bernoulli.ts
│   │   ├── stress.ts
│   │   ├── gear.ts
│   │   ├── machining.ts
│   │   └── gdnt-position.ts
│   └── search/
│       └── index.js              # FlexSearch client wrapper
├── data/
│   ├── index-meta.json           # Categories + topic metadata (no content)
│   ├── search-index.json         # Generated at build
│   ├── schema/
│   │   └── topic.schema.json     # JSON Schema for validation
│   └── topics/
│       └── *.json                # Full topic content (unchanged format)
├── scripts/
│   ├── new-topic.js              # CLI for content authors
│   ├── build-search-index.js     # Generates search-index.json
│   ├── generate-sitemap.js       # Generates sitemap.xml + robots.txt
│   └── validate-topics.js        # Validates all topics against schema
├── .github/workflows/
│   ├── validate-content.yml      # PR validation
│   └── build-seo.yml             # Generates SEO artifacts on push
├── package.json                  # Dev dependencies (TypeScript, Zod, FlexSearch)
├── tsconfig.json
├── REVIEW.md                     # This file
└── PROJECT_SUMMARY.md            # Injectible project context
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing topic links during refactor | Low | High | Preserve `Router.navigate('topic/${id}')` contract |
| Calculator refactor introduces bugs | Medium | High | Write unit tests for compute functions before refactor |
| Search index too large for GitHub Pages | Low | Medium | FlexSearch indexes are compact; gzip compression |
| GitHub Actions minutes exceeded | Low | Low | Build steps are fast (<2 min total) |

---

## Success Metrics

- [ ] Initial page load < 100KB (gzipped) — currently ~150KB+
- [ ] Search returns results in < 50ms
- [ ] Lighthouse Accessibility score > 95
- [ ] Lighthouse SEO score > 90
- [ ] Zero content validation errors in CI
- [ ] New topic creation < 30 seconds via CLI
- [ ] All 6 calculators pass unit tests

---

## Approval

- [ ] Architecture changes approved
- [ ] Calculator refactor approach approved
- [ ] SEO strategy approved
- [ ] Timeline accepted

**Next Action:** Begin Week 1 critical fixes.