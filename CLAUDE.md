# CLAUDE.md — Choonie Portfolio Site

## What This Is
Static portfolio site for Choonie Chang (Product Designer / Design Leader), built with **Eleventy (11ty)** and deployed to GitHub Pages. No frameworks, no build pipeline beyond 11ty.

## Source File Map

```
choonie/
├── .eleventy.js          # Config: passthrough css/js/images, input=src, output=_site
├── src/
│   ├── _includes/
│   │   ├── base.njk      # Inner page shell: loads shared.css + transition.css + pageCss, includes nav.njk + project-nav.njk + ba-slider.js + transition.js
│   │   ├── home.njk      # Homepage shell: canvas-based, overflow:hidden, loads home.js
│   │   ├── nav.njk       # Shared top nav (edit once, applies everywhere)
│   │   └── project-nav.njk  # Bottom prev/next case study nav
│   ├── pages/
│   │   ├── index.njk     # Homepage (layout: home.njk)
│   │   ├── viscovery.njk # Case study (layout: base.njk, pageCss: viscovery)
│   │   ├── hangie.njk    # Case study (layout: base.njk, pageCss: hangie)
│   │   ├── ics.njk       # Case study (layout: base.njk, pageCss: ics) — stub
│   │   └── accupass.njk  # Case study (layout: base.njk, pageCss: accupass) — stub
│   ├── css/
│   │   ├── shared.css    # All inner pages: layout, typography, components (metabar, persona-card, ba-slider, etc.)
│   │   ├── home.css      # Homepage only: canvas, hero text, project grid
│   │   ├── transition.css # Page transition overlay (clip-path, .transition-leaving, .transition-arriving)
│   │   ├── viscovery.css # Viscovery-specific overrides
│   │   ├── hangie.css    # Hangie-specific overrides
│   │   ├── ics.css       # ICS-specific overrides
│   │   └── accupass.css  # Accupass-specific overrides
│   ├── js/
│   │   ├── transition.js # Page transition logic (clip-path from left, "Choonie Chang" text, 400ms hold, sessionStorage flag)
│   │   ├── ba-slider.js  # Before/After image slider (drag handle, clip-path reveal)
│   │   └── home.js       # Canvas particle animation on homepage
│   └── images/           # Static assets, subfolders per project
└── _site/                # Build output — DO NOT edit directly
```

## Key Patterns

### Adding a New Case Study Page
1. Create `src/pages/{name}.njk` with frontmatter:
   ```
   ---
   layout: base.njk
   title: Page Title
   pageCss: {name}
   permalink: /{name}/
   nextTitle: "Next Case Study"
   nextHref: "/{next}/"
   nextImg: "/images/{next}/hero.jpg"
   ---
   ```
2. Create `src/css/{name}.css` for page-specific styles
3. Add images to `src/images/{name}/`
4. Update `project-nav.njk` if nav order changes

### Template Composition
`base.njk` loads: `shared.css` → `transition.css` → `{pageCss}.css` → inline script (transition flash prevention) → `nav.njk` → page content → `project-nav.njk` → `ba-slider.js` → `transition.js`

### CSS Architecture
- `shared.css` = all structural components used across inner pages
- Per-page CSS = visual overrides only (colors, spacing tweaks, page-specific sections)
- Breakpoint: **768px** — inner pages stack metabar/personas vertically, reduce padding 96px→20px
- Homepage uses `vw` units at desktop, switches to `px` at mobile

### Page Transition
- Mechanism: **clip-path** (not transform). White overlay clips in from left on click, shows "Choonie Chang" text, holds 400ms, navigates. On new page, clips out from left.
- Flash prevention: Inline `<head>` script checks `sessionStorage` and adds `transition-arriving` class before first paint.

### Before/After Slider (`ba-slider.js`)
- Container: `<div class="ba-slider">` with `.ba-before` + `.ba-after` + `.ba-handle`
- Used in Viscovery page for IA comparison

## Current State (as of 2026-04)

### Live pages
- `/` — Homepage with canvas animation + project grid
- `/viscovery/` — Full case study (complete)
- `/hangie/` — Case study (content TBD)

### Pending Work
- `/ics/` and `/accupass/` — Case study pages (content stubs only)
- Upload flow loop animation for Viscovery Async UX section (`#async-ux-placeholder`)
- About page
- GitHub Pages deployment configuration
- Old root-level `index.html` and `viscovery.html` can be deleted after final verification

## Dev Commands
```bash
cd d:/portfolio/choonie
npx @11ty/eleventy --serve   # local dev server
npx @11ty/eleventy           # build to _site/
```
