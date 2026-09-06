#!/bin/bash
# Auto-sync Obsidian vault → Quartz → Cloudflare Pages
# Run via launchd every 15 min. Only builds and deploys if content changed.

PORTFOLIO_DIR="/Users/benwaraiotoko/Documents/GitHub/Bwo_Portfolio"
LOG="$HOME/Library/Logs/portfolio-sync.log"

timestamp() { date '+%Y-%m-%d %H:%M:%S'; }

cd "$PORTFOLIO_DIR" || { echo "[$(timestamp)] ERROR: portfolio dir not found" >> "$LOG"; exit 1; }

echo "[$(timestamp)] --- sync started ---" >> "$LOG"

# Sync vault → content/
python3 scripts/sync-obsidian.py >> "$LOG" 2>&1

# Regenerate homepage "Latest" section (between auto markers in content/index.md)
python3 scripts/update-latest.py >> "$LOG" 2>&1

# Only build and deploy if something changed
if [ -n "$(git status --porcelain)" ]; then
    echo "[$(timestamp)] Changes detected — building..." >> "$LOG"
    npx quartz build >> "$LOG" 2>&1

    git add -A
    git commit -m "auto-sync: $(timestamp)" >> "$LOG" 2>&1
    git push >> "$LOG" 2>&1

    echo "[$(timestamp)] Deployed successfully" >> "$LOG"
else
    echo "[$(timestamp)] No changes, skipping build" >> "$LOG"
fi
