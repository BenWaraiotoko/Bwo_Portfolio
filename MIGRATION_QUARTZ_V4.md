# Migration Plan: Hugo → Quartz v4

**Created:** 2026-01-23
**Status:** In Progress
**Goal:** Migrate benwaraiotoko.dev from Hugo/LoveIt to Quartz v4 with Obsidian workflow

---

## Overview

| Current | Target |
|---------|--------|
| Hugo + LoveIt theme | Quartz v4 (Node.js) |
| Custom D3.js graph | Quartz built-in graph |
| No backlinks | Built-in backlinks |
| No Obsidian sync | `publish: true` filtering |
| Kanagawa theme (CSS) | Kanagawa theme (config) |

---

## Phase 1: Setup Quartz v4 Project

**Status:** ✅ Complete

### Tasks:
- [ ] 1.1 Create new directory `quartz-portfolio` alongside current repo
- [ ] 1.2 Verify Node.js v22+ and npm v10.9.2+ installed
- [ ] 1.3 Run `npx quartz create`
- [ ] 1.4 Choose "Empty Quartz" option (we'll migrate content manually)
- [ ] 1.5 Verify basic build works: `npx quartz build --serve`

### Commands:
```bash
# Check versions
node --version  # Need v22+
npm --version   # Need v10.9.2+

# Create project
cd ~/Documents/GitHub
npx quartz create
# Name: quartz-portfolio
# Choose: Empty Quartz

cd quartz-portfolio
npm install
npx quartz build --serve
```

### Verification:
- [ ] Local server runs at http://localhost:8080
- [ ] Default Quartz page displays

---

## Phase 2: Configure Kanagawa Theme

**Status:** ✅ Complete

### Tasks:
- [ ] 2.1 Edit `quartz.config.ts` with site metadata
- [ ] 2.2 Configure Kanagawa color palette
- [ ] 2.3 Set up dark/light mode colors
- [ ] 2.4 Configure typography

### Kanagawa Color Reference (from current CSS):

```typescript
// Dark Mode (Default)
colors: {
  lightgray: "#2A2A37",    // sumiInk3
  gray: "#363646",         // sumiInk4
  darkgray: "#C8C093",     // oldWhite
  dark: "#DCD7BA",         // fujiWhite (text)
  secondary: "#E46876",    // waveRed (accent)
  tertiary: "#7FB4CA",     // crystalBlue (links)
  highlight: "rgba(126, 156, 216, 0.15)", // waveBlue transparent
  textHighlight: "#E6C38488", // carpYellow transparent
}

// Light Mode
colors: {
  lightgray: "#E6E0D0",
  gray: "#C8C093",
  darkgray: "#727169",
  dark: "#1F1F28",         // sumiInk1 (text)
  secondary: "#E46876",    // waveRed
  tertiary: "#7FB4CA",     // crystalBlue
  highlight: "rgba(152, 187, 108, 0.15)", // springGreen transparent
  textHighlight: "#E6C38488",
}
```

### Graph Colors:
```typescript
graph: {
  colors: {
    node: "#7E9CD8",       // waveBlue (default nodes)
    active: "#E46876",     // waveRed (current/active)
    link: "#E6C384",       // carpYellow (connections)
  }
}
```

### Config Template:
```typescript
// quartz.config.ts
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Ben Warai Otoko",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: "benwaraiotoko.dev",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "published",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: { /* light colors */ },
        darkMode: { /* dark colors */ },
      },
    },
  },
  // ... plugins
}
```

### Verification:
- [ ] Site title shows "Ben Warai Otoko"
- [ ] Dark mode uses Kanagawa dark colors
- [ ] Light mode uses Kanagawa light colors
- [ ] Fonts render correctly

---

## Phase 3: Configure Plugins & Features

**Status:** ✅ Complete

### Tasks:
- [ ] 3.1 Enable graph visualization
- [ ] 3.2 Configure backlinks
- [ ] 3.3 Enable search
- [ ] 3.4 Configure link previews (popovers)
- [ ] 3.5 Set up content filtering (`publish: true`)

### Plugin Configuration:
```typescript
// quartz.config.ts plugins section
plugins: {
  transformers: [
    Plugin.FrontMatter(),
    Plugin.CreatedModifiedDate({
      priority: ["frontmatter", "filesystem"],
    }),
    Plugin.SyntaxHighlighting({
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
    }),
    Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
    Plugin.GitHubFlavoredMarkdown(),
    Plugin.TableOfContents(),
    Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
    Plugin.Description(),
    Plugin.Latex({ renderEngine: "katex" }),
  ],
  filters: [
    Plugin.ExplicitPublish(), // Only publish: true files
  ],
  emitters: [
    Plugin.AliasRedirects(),
    Plugin.ComponentResources(),
    Plugin.ContentPage(),
    Plugin.FolderPage(),
    Plugin.TagPage(),
    Plugin.ContentIndex({
      enableSiteMap: true,
      enableRSS: true,
    }),
    Plugin.Assets(),
    Plugin.Static(),
    Plugin.NotFoundPage(),
  ],
},
```

### Graph Configuration:
```typescript
// quartz.layout.ts
graph: {
  localGraph: {
    drag: true,
    zoom: true,
    depth: 2,
    scale: 1.1,
    repelForce: 0.5,
    centerForce: 0.3,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.9,
    repelForce: 0.5,
    centerForce: 0.3,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
  },
},
```

### Verification:
- [ ] Graph displays on pages
- [ ] Backlinks section appears
- [ ] Search works (Ctrl+K)
- [ ] Link hover shows preview
- [ ] Only `publish: true` content builds

---

## Phase 4: Migrate Content

**Status:** ✅ Complete

### Content Inventory (Current):
| Section | Files | Path |
|---------|-------|------|
| Posts | 3 | `content/posts/` |
| Projects | 2 | `content/projects/` |
| Learning Logs | 5 | `content/learning-logs/` |
| Second Brain | 3 | `content/second-brain/` |
| About | 1 | `content/about.md` |
| **Total** | **14** | |

### Tasks:
- [ ] 4.1 Create folder structure in Quartz
- [ ] 4.2 Copy and adapt posts (add `publish: true`)
- [ ] 4.3 Copy and adapt projects
- [ ] 4.4 Copy and adapt learning-logs
- [ ] 4.5 Copy and adapt second-brain
- [ ] 4.6 Copy about page
- [ ] 4.7 Copy images from `static/images/`

### Frontmatter Transformation:

**Current Hugo format:**
```yaml
---
title: "Post Title"
date: 2025-01-15
draft: false
description: "Description"
tags: ["python", "data-engineering"]
categories: ["Blog"]
featuredImage: "/images/post-image.png"
---
```

**Quartz v4 format:**
```yaml
---
title: "Post Title"
date: 2025-01-15
publish: true
description: "Description"
tags:
  - python
  - data-engineering
image: "/images/post-image.png"
aliases:
  - /2025/01/post-title
---
```

### Key Changes:
1. `draft: false` → `publish: true`
2. `categories` → Remove (use tags only)
3. `featuredImage` → `image`
4. Add `aliases` for old URL redirects
5. Tags: array format `["a", "b"]` → list format

### Folder Structure:
```
quartz-portfolio/
├── content/
│   ├── index.md              # Homepage
│   ├── posts/
│   │   ├── index.md          # Posts listing
│   │   └── *.md
│   ├── projects/
│   │   ├── index.md
│   │   └── *.md
│   ├── learning-logs/
│   │   ├── index.md
│   │   └── *.md
│   ├── second-brain/
│   │   ├── index.md
│   │   └── *.md
│   └── about.md
├── static/
│   └── images/
└── quartz.config.ts
```

### Verification:
- [ ] All 14 content files migrated
- [ ] Images load correctly
- [ ] Old URLs redirect via aliases
- [ ] Tags display correctly
- [ ] No broken internal links

---

## Phase 5: Custom Styling

**Status:** ✅ Complete

### Tasks:
- [ ] 5.1 Create `quartz/styles/custom.scss`
- [ ] 5.2 Style graph with Kanagawa colors
- [ ] 5.3 Style code blocks
- [ ] 5.4 Style callouts/admonitions
- [ ] 5.5 Adjust typography if needed

### Custom SCSS:
```scss
// quartz/styles/custom.scss

// Graph node colors by type
.graph {
  // Default nodes
  .node circle {
    fill: var(--secondary);
  }

  // Tag nodes
  .node.tag circle {
    fill: #957FB8; // oniViolet
  }

  // Current page
  .node.current circle {
    fill: #E46876; // waveRed
  }

  // Links
  .link {
    stroke: #E6C384; // carpYellow
  }
}

// Code block styling
pre {
  background: #16161D !important; // sumiInk0
  border: 1px solid #2A2A37;
}

// Callout styling
.callout {
  border-left-color: var(--secondary);
}

// Selection color
::selection {
  background: rgba(230, 195, 132, 0.3); // carpYellow
}
```

### Verification:
- [ ] Graph uses Kanagawa colors
- [ ] Code blocks have dark background
- [ ] Selection highlight is yellow-tinted
- [ ] Overall look matches current site

---

## Phase 6: Obsidian Workflow Setup

**Status:** ✅ Complete

### Tasks:
- [ ] 6.1 Decide on Obsidian vault location
- [ ] 6.2 Create symlink or sync script
- [ ] 6.3 Create Obsidian template for new notes
- [ ] 6.4 Test publish workflow

### Option A: Symlink (Recommended for local)
```bash
# Link Quartz content to Obsidian vault
ln -s ~/Documents/GitHub/quartz-portfolio/content ~/Documents/Obsidian/Portfolio
```

### Option B: Sync Script (For Resilio/cloud sync)
```python
#!/usr/bin/env python3
# utils/sync_from_obsidian.py
"""Sync notes with publish: true from Obsidian vault to Quartz content."""
import shutil
from pathlib import Path
import yaml

VAULT = Path.home() / "Documents" / "Obsidian" / "SecondBrain"
CONTENT = Path("./content")

def has_publish_true(path: Path) -> bool:
    """Check if file has publish: true in frontmatter."""
    text = path.read_text()
    if not text.startswith("---"):
        return False
    try:
        _, fm, _ = text.split("---", 2)
        data = yaml.safe_load(fm)
        return data.get("publish", False) is True
    except:
        return False

def sync():
    """Copy publishable notes to content folder."""
    for md in VAULT.rglob("*.md"):
        if has_publish_true(md):
            rel = md.relative_to(VAULT)
            dest = CONTENT / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(md, dest)
            print(f"✓ {rel}")

if __name__ == "__main__":
    sync()
```

### Obsidian Template:
```yaml
---
title: "{{title}}"
date: {{date:YYYY-MM-DD}}
publish: false
tags: []
---

# {{title}}

Content here...
```

### Verification:
- [ ] Can create note in Obsidian
- [ ] Setting `publish: true` makes it appear on site
- [ ] `publish: false` notes stay private
- [ ] Wikilinks `[[note]]` work

---

## Phase 7: Deployment

**Status:** ⏳ Pending

### Tasks:
- [ ] 7.1 Create GitHub repository `quartz-portfolio`
- [ ] 7.2 Push code to GitHub
- [ ] 7.3 Configure Cloudflare Pages
- [ ] 7.4 Set up custom domain
- [ ] 7.5 Test preview deployment
- [ ] 7.6 Switch production to new site

### Cloudflare Pages Settings:
```yaml
Build command: npx quartz build
Output directory: public
Node version: 22
```

### Environment Variables:
```
NODE_VERSION=22
```

### GitHub Actions (Alternative):
```yaml
# .github/workflows/deploy.yml
name: Deploy Quartz
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx quartz build
      - name: Deploy to Cloudflare
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: quartz-portfolio
          directory: public
```

### URL Redirects (`static/_redirects`):
```
# Old Hugo URLs → New Quartz URLs
/2025/01/python-oop-bakery-analogy /posts/python-oop-bakery-analogy 301
/2024/12/* /posts/:splat 301
```

### Verification:
- [ ] Preview URL works
- [ ] All pages load
- [ ] Graph works on deployed site
- [ ] Old URLs redirect correctly
- [ ] Custom domain configured
- [ ] HTTPS works

---

## Phase 8: Final Verification

**Status:** ⏳ Pending

### Checklist:
- [ ] All content migrated and displays correctly
- [ ] Graph shows all nodes with correct colors
- [ ] Backlinks appear on each page
- [ ] Search finds all content
- [ ] Dark/light mode toggle works
- [ ] Mobile responsive
- [ ] Old URLs redirect (SEO preserved)
- [ ] RSS feed works
- [ ] Sitemap generated
- [ ] Performance acceptable (<3s load)
- [ ] Obsidian workflow functional

### Rollback Plan:
1. Keep original `Bwo_Portfolio` repo unchanged
2. Don't delete Hugo deployment until Quartz verified
3. Can switch Cloudflare back to Hugo build anytime
4. DNS change is instant rollback

---

## Reference: Current Site URLs to Preserve

```
# Posts
/2025/01/python-oop-bakery-analogy
/2024/12/why-data-engineering
/2024/12/fixing-my-mac-system

# Projects
/projects/mxf-capture-system
/projects/mac-auto-setup

# Learning Logs
/learning-logs/month-1-dec2024-jan2025
/learning-logs/codecademy-python-fundamentals
/learning-logs/codecademy-sql-fundamentals
/learning-logs/de-project-1-1-local-env
/learning-logs/de-project-1-2-docker-postgres

# Second Brain
/second-brain/sql-cheatsheet
/second-brain/python-data-structures
/second-brain/postgresql-setup

# Other
/about
/graph
/tags/*
```

---

## Troubleshooting

### Common Issues:

**Build fails with Node version error:**
```bash
nvm install 22
nvm use 22
```

**Graph not showing:**
- Check `quartz.layout.ts` has Graph component
- Verify content has internal links

**Backlinks not appearing:**
- Ensure wikilinks use correct syntax: `[[page-name]]`
- Check Plugin.CrawlLinks() is enabled

**Images not loading:**
- Images go in `content/` next to .md files, or `static/`
- Reference with `/images/name.png` or `./image.png`

**Publish filter not working:**
- Ensure `Plugin.ExplicitPublish()` in filters
- Check frontmatter has `publish: true` (not `"true"`)

---

## Progress Tracker

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 1. Setup | ✅ | 2026-01-23 | 2026-01-23 |
| 2. Theme | ✅ | 2026-01-23 | 2026-01-23 |
| 3. Plugins | ✅ | 2026-01-23 | 2026-01-23 |
| 4. Content | ✅ | 2026-01-23 | 2026-01-23 |
| 5. Styling | ✅ | 2026-01-23 | 2026-01-23 |
| 6. Obsidian | ✅ | 2026-01-24 | 2026-01-24 |
| 7. Deploy | ⏳ | | |
| 8. Verify | ⏳ | | |

**Legend:** ⏳ Pending | 🔄 In Progress | ✅ Complete | ❌ Blocked

---

## Notes & Decisions

_Space for recording decisions made during migration:_

- **2026-01-23:** Updated layout to match ssp.sh style
  - Header: Site title + search + darkmode in top bar
  - Graph: Moved to bottom of page (afterBody)
  - TOC: Inline at top of content
  - Backlinks: Bottom of page
  - Sidebars: Explorer (left) + Recent Notes (right)
  - Custom SCSS for clean, centered content focus

---

## Resources

- [Quartz v4 Documentation](https://quartz.jzhao.xyz/)
- [Quartz GitHub](https://github.com/jackyzha0/quartz)
- [Migration from Quartz 3](https://quartz.jzhao.xyz/migrating-from-Quartz-3)
- [Quartz Plugins Reference](https://quartz.jzhao.xyz/plugins)
- [Quartz Layout Customization](https://quartz.jzhao.xyz/layout)
