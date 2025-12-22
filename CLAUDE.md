# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a French-language portfolio site for a Data Engineer built with Hugo Extended, featuring an interactive D3.js knowledge graph visualization. The site is designed with a Kanagawa color scheme and uses the LoveIt theme as a base, deployed to Cloudflare Pages.

**Stack**: Hugo Extended v0.139.0, LoveIt theme, D3.js v7.8.5, Kanagawa CSS theme

**Language**: French (fr) - all content, comments, and user-facing text should be in French

## Essential Commands

### Development
```bash
# Start development server with drafts
hugo server -D

# Start development server without drafts
hugo server

# Build for production
hugo --minify

# Clean build artifacts
rm -rf public/ resources/

# List all content
hugo list all
```

### Content Creation
```bash
# Create new blog post
hugo new posts/title.md

# Create new project
hugo new projects/title.md
```

### Deployment
```bash
# Deploy script (production)
./deploy.sh production

# Deploy script (staging with drafts)
./deploy.sh staging

# Manual deploy: commit and push triggers Cloudflare Pages auto-deployment
git add .
git commit -m "message"
git push origin main
```

## Architecture Overview

### Hugo Site Structure

**Content Organization**:
- `content/posts/` - Blog articles about Data Engineering journey
- `content/projects/` - Portfolio project showcases
- `content/about.md` - About page
- `content/graph.md` - Interactive knowledge graph page (main feature)

**Custom Theme System**:
- Base theme: `themes/LoveIt/` (git submodule)
- Custom CSS: `assets/css/kanagawa.css` (Kanagawa color palette overrides)
- Custom layouts: `layouts/shortcodes/` and `layouts/_default/`, `layouts/_markup/`

**Static Assets**:
- `static/js/knowledge-graph.js` - D3.js force-directed graph implementation
- `static/data/graph.json` - Graph data (nodes and links)

### D3.js Knowledge Graph System

This is the **centerpiece feature** of the portfolio. The knowledge graph visualizes skills, technologies, and their relationships.

**Components**:
1. **Data Model** (`static/data/graph.json`):
   - `nodes`: Array of skill/technology objects with properties:
     - `id`: unique identifier
     - `label`: display name
     - `category`: one of: "central", "language", "tool", "skill", "database", "learning"
     - `description`: tooltip text
     - `url`: link target (usually to tag page)
     - `central`: boolean (true only for main profile node)
   - `links`: Array of connections between nodes with `source` and `target` properties

2. **Visualization** (`static/js/knowledge-graph.js`):
   - D3.js force-directed graph with interactive drag, zoom, and navigation
   - Color-coded by category (central=pink, others=cyan, etc.)
   - Responsive sizing and mobile-friendly interactions

3. **Shortcodes** (`layouts/shortcodes/`):
   - `knowledge-graph.html`: Full-page interactive graph (use: `{{< knowledge-graph >}}`)
   - `article-graph.html`: Mini-graph for article pages (use: `{{< article-graph >}}`)

**To modify the graph**:
1. Edit `static/data/graph.json` to add/remove nodes or links
2. Follow existing node structure (id, label, category, description, url)
3. Test locally with `hugo server -D` before deploying

### Kanagawa Color Scheme

Custom color palette defined in `assets/css/kanagawa.css`:
- Background: `#1F1F28` (dark ink)
- Text: `#DCD7BA` (cream)
- Accent: `#E46876` (coral pink)
- Links: `#7FB4CA` (cyan)
- Code: `#98BB6C` (green)

This CSS file overrides LoveIt theme defaults to achieve the Kanagawa aesthetic.

## Configuration (`config.toml`)

Key settings:
- `baseURL`: Cloudflare Pages URL (update for production)
- `languageCode = "fr"`: French language site
- `theme = "LoveIt"`: Base theme
- Menu structure: Blog, Projets, Compétences (graph), À propos
- Dark theme by default: `defaultTheme = "dark"`
- Build outputs: `["HTML", "RSS", "JSON"]`
- Taxonomies: tags and categories enabled
- Markdown: unsafe HTML enabled for D3.js shortcodes

## Content Frontmatter Structure

### Blog Posts (`content/posts/`)
```yaml
---
title: "Post Title"
date: 2025-01-15
tags: ["python", "sql", "data-engineering"]
categories: ["Formation"]
draft: false
---
```

### Projects (`content/projects/`)
```yaml
---
title: "Project Name"
date: 2025-01-10
tags: ["etl", "python", "docker"]
draft: false
---
```

Use `{{< article-graph >}}` shortcode in posts to display related concepts from the knowledge graph.

## Deployment Workflow

**Cloudflare Pages Configuration**:
- Build command: `hugo --minify`
- Output directory: `public`
- Environment variable: `HUGO_VERSION=0.139.0`

**Workflow**:
1. Make changes locally
2. Test with `hugo server -D`
3. Commit and push to GitHub main branch
4. Cloudflare Pages automatically rebuilds and deploys (~1-2 minutes)

**Deployment Script** (`deploy.sh`):
- Cleans previous builds
- Runs Hugo build (minified)
- Shows build statistics
- Optionally commits and pushes to GitHub
- Supports production/staging environments

## Theme Submodule

The LoveIt theme is installed as a git submodule. If cloning this repo fresh:

```bash
git submodule update --init --recursive
```

Do not modify files inside `themes/LoveIt/` directly. Use `layouts/` overrides and `assets/css/kanagawa.css` for customizations.

## Important File Locations

- **Site config**: `config.toml`
- **Kanagawa theme**: `assets/css/kanagawa.css`
- **Knowledge graph data**: `static/data/graph.json`
- **Graph visualization**: `static/js/knowledge-graph.js`
- **Shortcodes**: `layouts/shortcodes/knowledge-graph.html`, `layouts/shortcodes/article-graph.html`
- **Custom layouts**: `layouts/_default/`, `layouts/_markup/`
- **Deployment script**: `deploy.sh`
- **Documentation**: `README.md`, `Docs/portfolio_guide_mac.md`, `Docs/structure_complete.md`
