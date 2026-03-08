# Ben Warai Otoko - Digital Garden

Personal website and digital garden built with [Quartz v4](https://quartz.jzhao.xyz/).

**Live site:** [benwaraiotoko.dev](https://benwaraiotoko.dev)

## Quick Start

```bash
# Install dependencies
npm install

# Serve locally at http://localhost:8080
make serve
```

## Obsidian Workflow

Write notes anywhere in your Obsidian vault. Add frontmatter to publish:

```yaml
---
title: "Note Title"
date: 2026-01-24
publish: true
category: posts        # posts | learning-log | project | second-brain
tags: []
description: ""
---
```

The sync script scans the entire vault for `publish: true` and copies files
into the right `content/` subfolder based on `category`.

### Commands

```bash
make sync-dry    # Preview what would change (no writes)
make sync        # Sync vault → content/ (removes unpublished files)
make dev         # Sync + serve locally
make deploy      # Sync + build + git push → Cloudflare Pages
```

### Categories → Sections

| `category` | Website section |
|---|---|
| `posts` | /posts (blog) |
| `learning-log` | /learning-logs |
| `project` | /projects |
| `second-brain` | /second-brain (default) |

### Publish / Unpublish

| Action | How |
|---|---|
| Publish | Set `publish: true` → `make sync` |
| Unpublish | Set `publish: false` → `make sync` (file auto-removed) |
| Preview | `make sync-dry` |

## Auto-Sync (macOS launchd)

A launchd job runs `scripts/auto-deploy.sh` every 15 minutes. It only builds
and pushes if content actually changed — no empty commits.

```bash
# Watch the log
tail -f ~/Library/Logs/portfolio-sync.log

# Stop auto-sync
launchctl unload ~/Library/LaunchAgents/com.benwaraiotoko.portfolio-sync.plist

# Start auto-sync
launchctl load ~/Library/LaunchAgents/com.benwaraiotoko.portfolio-sync.plist

# Run manually right now
bash scripts/auto-deploy.sh
```

## Installing on a New Mac

```bash
# 1. Install dependencies
npm install

# 2. Copy the launchd plist to LaunchAgents (edit USERNAME first if needed)
cp scripts/com.benwaraiotoko.portfolio-sync.plist \
   ~/Library/LaunchAgents/com.benwaraiotoko.portfolio-sync.plist

# 3. Register the job
launchctl load ~/Library/LaunchAgents/com.benwaraiotoko.portfolio-sync.plist

# 4. Verify it's running
launchctl list | grep portfolio
```

The plist and auto-deploy script assume:
- Portfolio at `~/Documents/GitHub/Bwo_Portfolio`
- Vault at `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/bwo-second-brain`
- `python3`, `node`, `npx` at `/opt/homebrew/bin` (Homebrew on Apple Silicon)

If your paths differ, update `VAULT_PATH` in `scripts/sync-obsidian.py` and
`PORTFOLIO_DIR` in `scripts/auto-deploy.sh`.

## Tech Stack

- **Framework:** [Quartz v4](https://quartz.jzhao.xyz/)
- **Theme:** Kanagawa color scheme
- **Hosting:** Cloudflare Pages
- **Notes:** Obsidian (iCloud sync)
- **Auto-sync:** macOS launchd (every 15 min)

## Structure

```
content/
├── posts/           # Blog posts
├── learning-logs/   # Learning journey
├── projects/        # Project docs
├── second-brain/    # Knowledge base
├── about.md
└── index.md

scripts/
├── sync-obsidian.py                         # Vault → content/ sync
├── auto-deploy.sh                           # Smart deploy (only if changed)
└── com.benwaraiotoko.portfolio-sync.plist   # launchd job backup
```

## License

Content: CC BY-NC-SA 4.0 | Code: MIT
