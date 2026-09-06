# Quartz Portfolio - Build Commands
#
# Workflow:
#   1. Write notes anywhere in Obsidian vault
#   2. Add frontmatter: publish: true, category: posts|learning-log|project|second-brain
#   3. Run: make sync (or make dev for local preview)
#
# Categories:
#   posts        → Blog posts, tutorials
#   learning-log → Learning journey entries
#   project      → Project documentation
#   second-brain → Knowledge base, references (default)

.PHONY: sync sync-dry sync-keep latest build serve deploy clean help

# Sync from Obsidian vault (scans entire vault for publish: true)
# Also regenerates the homepage "Latest" section from the newest posts
sync:
	python3 scripts/sync-obsidian.py
	python3 scripts/update-latest.py

# Preview what would be synced
sync-dry:
	python3 scripts/sync-obsidian.py --dry
	python3 scripts/update-latest.py --dry

# Regenerate the homepage "Latest" section only
latest:
	python3 scripts/update-latest.py

# Sync without removing unpublished files
sync-keep:
	python3 scripts/sync-obsidian.py --no-clean

# Build the site
build:
	npx quartz build

# Serve locally with hot reload
serve:
	npx quartz build --serve

# Sync + Build
publish: sync build

# Sync + Serve (development workflow)
dev: sync serve

# Full deploy: sync, build, commit, push
deploy: sync build
	git add -A
	git commit -m "Update content" || true
	git push

# Clean build artifacts
clean:
	rm -rf public .quartz-cache

# Show help
help:
	@echo ""
	@echo "Quartz Portfolio Commands"
	@echo "========================="
	@echo ""
	@echo "  make sync       Sync + auto-remove unpublished files + refresh Latest"
	@echo "  make sync-dry   Preview sync (no changes)"
	@echo "  make sync-keep  Sync without removing files"
	@echo "  make latest     Regenerate homepage 'Latest' section only"
	@echo "  make build      Build the site"
	@echo "  make serve      Serve locally (http://localhost:8080)"
	@echo "  make dev        Sync + serve (main development command)"
	@echo "  make deploy     Sync + build + git push"
	@echo "  make clean      Remove build artifacts"
	@echo ""
	@echo "Frontmatter for publishing:"
	@echo "  publish: true"
	@echo "  category: posts | learning-log | project | second-brain"
	@echo ""
