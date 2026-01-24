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

.PHONY: sync build serve deploy clean help

# Sync from Obsidian vault (scans entire vault for publish: true)
sync:
	python3 scripts/sync-obsidian.py

# Preview what would be synced
sync-dry:
	python3 scripts/sync-obsidian.py --dry

# Sync and remove orphaned files
sync-clean:
	python3 scripts/sync-obsidian.py --clean

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
	@echo "  make sync       Sync notes with 'publish: true' from Obsidian"
	@echo "  make sync-dry   Preview sync (no changes)"
	@echo "  make sync-clean Sync + remove orphaned files"
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
