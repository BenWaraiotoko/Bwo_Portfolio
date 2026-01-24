# Ben Warai Otoko - Digital Garden

Personal website and digital garden built with [Quartz v4](https://quartz.jzhao.xyz/).

**Live site:** [benwaraiotoko.dev](https://benwaraiotoko.dev)

## Quick Start

```bash
# Install dependencies
npm install

# Serve locally
make serve
# or: npx quartz build --serve

# Open http://localhost:8080
```

## Obsidian Workflow

Write notes anywhere in your Obsidian vault. Set `publish: true` to publish:

```yaml
---
title: "Note Title"
date: 2026-01-24
publish: true              # false = draft, true = publish
category: second-brain     # posts | learning-log | project | second-brain
tags: []
description: ""
---
```

### Templates (in `5-Templates/`)

| Template | Category | Use For |
|----------|----------|---------|
| `6-1-Blog-Post.md` | posts | Blog articles |
| `6-2-Learning-Logs-*.md` | learning-log | Learning journey entries |
| `6-3-Projects.md` | project | Project documentation |
| `6-4-Second-Brain.md` | second-brain | Knowledge base notes |

### Commands

```bash
make sync        # Sync from Obsidian vault (auto-removes unpublished)
make dev         # Sync + serve locally
make deploy      # Sync + build + push
```

### Publish / Unpublish

| Action | How |
|--------|-----|
| **Publish** | Set `publish: true` → run `make sync` |
| **Unpublish** | Set `publish: false` → run `make sync` (file auto-removed) |
| **Preview** | Run `make sync-dry` to see what will change |

### Categories

| Category | Website Section |
|----------|-----------------|
| `posts` | Blog |
| `learning-log` | Learning Logs |
| `project` | Projects |
| `second-brain` | Second Brain (default) |

## Tech Stack

- **Framework:** [Quartz v4](https://quartz.jzhao.xyz/)
- **Theme:** Kanagawa color scheme
- **Hosting:** Cloudflare Pages
- **Notes:** Obsidian

## Structure

```
content/
├── posts/           # Blog posts
├── learning-logs/   # Learning journey
├── projects/        # Project docs
├── second-brain/    # Knowledge base
├── about.md
└── index.md
```

## License

Content: CC BY-NC-SA 4.0
Code: MIT
