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

Write notes anywhere in your Obsidian vault. Add this frontmatter to publish:

```yaml
---
title: "Note Title"
date: 2025-01-24
publish: true
category: second-brain   # posts | learning-log | project | second-brain
tags: []
---
```

### Commands

```bash
make sync        # Sync from Obsidian vault
make dev         # Sync + serve locally
make deploy      # Sync + build + push
```

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
