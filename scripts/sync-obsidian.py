#!/usr/bin/env python3
"""
Sync Obsidian vault to Quartz - publish: true anywhere in vault.

Scans your ENTIRE vault and syncs any file with `publish: true` frontmatter.
Files are organized by their `category` frontmatter field:
  - category: posts        → content/posts/
  - category: learning-log → content/learning-logs/
  - category: project      → content/projects/
  - category: second-brain → content/second-brain/ (default)

Usage:
    python scripts/sync-obsidian.py          # Sync all
    python scripts/sync-obsidian.py --dry    # Preview changes
    python scripts/sync-obsidian.py --clean  # Remove orphaned files
"""

import argparse
import re
import shutil
from pathlib import Path

# Configuration
VAULT_PATH = Path.home() / "Documents" / "bwo-second-brain"
QUARTZ_CONTENT = Path(__file__).parent.parent / "content"

# Folders to skip in vault
SKIP_FOLDERS = {".obsidian", ".sync", ".trash", "5-Templates", ".git"}

# Category → Quartz folder mapping
CATEGORY_MAP = {
    "posts": "posts",
    "post": "posts",
    "blog": "posts",
    "learning-log": "learning-logs",
    "learning-logs": "learning-logs",
    "learninglog": "learning-logs",
    "project": "projects",
    "projects": "projects",
    "second-brain": "second-brain",
    "secondbrain": "second-brain",
    "reference": "second-brain",
    "knowledge": "second-brain",
}

# Default category if none specified
DEFAULT_CATEGORY = "second-brain"


def parse_frontmatter(file_path: Path) -> dict:
    """Parse YAML frontmatter from markdown file."""
    try:
        content = file_path.read_text(encoding="utf-8")
        if not content.startswith("---"):
            return {}

        end_idx = content.find("---", 3)
        if end_idx == -1:
            return {}

        fm_text = content[3:end_idx]

        # Simple YAML parsing for our needs
        result = {}
        for line in fm_text.split("\n"):
            if ":" in line:
                key, _, value = line.partition(":")
                key = key.strip().lower()
                value = value.strip().strip('"').strip("'")

                # Handle boolean
                if value.lower() == "true":
                    value = True
                elif value.lower() == "false":
                    value = False

                result[key] = value

        return result
    except Exception as e:
        print(f"  ⚠ Error parsing {file_path.name}: {e}")
        return {}


def should_publish(frontmatter: dict) -> bool:
    """Check if file should be published."""
    return frontmatter.get("publish") is True


def get_target_folder(frontmatter: dict) -> str:
    """Determine target folder from category."""
    category = frontmatter.get("category", "").lower()
    if not category:
        category = frontmatter.get("type", "").lower()

    return CATEGORY_MAP.get(category, DEFAULT_CATEGORY)


def find_publishable_files() -> list[tuple[Path, str]]:
    """Find all files with publish: true in vault."""
    publishable = []

    for md_file in VAULT_PATH.rglob("*.md"):
        # Skip excluded folders
        if any(skip in md_file.parts for skip in SKIP_FOLDERS):
            continue

        fm = parse_frontmatter(md_file)
        if should_publish(fm):
            target_folder = get_target_folder(fm)
            publishable.append((md_file, target_folder))

    return publishable


def sync_file(src: Path, dst: Path, dry_run: bool = False) -> bool:
    """Sync a single file. Returns True if file was synced/updated."""
    # Check if file needs updating
    if dst.exists():
        src_mtime = src.stat().st_mtime
        dst_mtime = dst.stat().st_mtime
        if src_mtime <= dst_mtime:
            return False  # Already up to date

    if dry_run:
        action = "update" if dst.exists() else "create"
        print(f"  [{action.upper()}] {dst.relative_to(QUARTZ_CONTENT)}")
    else:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        action = "Updated" if dst.exists() else "Created"
        print(f"  ✓ {action}: {dst.relative_to(QUARTZ_CONTENT)}")

    return True


def clean_orphans(publishable_files: list[tuple[Path, str]], dry_run: bool = False) -> int:
    """Remove files in Quartz that were synced from vault but no longer have publish: true.

    Only removes files that have a matching source in the vault with publish: false/missing.
    Files created directly in Quartz (no vault source) are preserved.
    """
    # Build lookup of vault files by name (to check if file came from vault)
    vault_files_by_name = {}
    for md_file in VAULT_PATH.rglob("*.md"):
        if any(skip in md_file.parts for skip in SKIP_FOLDERS):
            continue
        vault_files_by_name[md_file.name] = md_file

    # Get set of expected destination files (from publishable vault files)
    expected = set()
    for src, folder in publishable_files:
        dst = QUARTZ_CONTENT / folder / src.name
        expected.add(dst)

    # Also keep index.md files
    for folder in ["posts", "projects", "learning-logs", "second-brain"]:
        expected.add(QUARTZ_CONTENT / folder / "index.md")

    # Keep root files
    expected.add(QUARTZ_CONTENT / "index.md")
    expected.add(QUARTZ_CONTENT / "about.md")

    removed = 0
    for folder in ["posts", "projects", "learning-logs", "second-brain"]:
        folder_path = QUARTZ_CONTENT / folder
        if not folder_path.exists():
            continue

        for md_file in folder_path.glob("*.md"):
            if md_file not in expected:
                # Only remove if there's a matching vault file (that was unpublished)
                # Preserve files created directly in Quartz (no vault source)
                if md_file.name in vault_files_by_name:
                    if dry_run:
                        print(f"  [REMOVE] {md_file.relative_to(QUARTZ_CONTENT)}")
                    else:
                        md_file.unlink()
                        print(f"  🗑 Removed: {md_file.relative_to(QUARTZ_CONTENT)}")
                    removed += 1

    return removed


def sync_all(dry_run: bool = False, clean: bool = True):
    """Sync all publishable files. Cleans orphans by default."""
    print("=" * 50)
    print("Syncing Obsidian → Quartz")
    print(f"Vault: {VAULT_PATH}")
    print("=" * 50)

    # Find all publishable files
    print("\n🔍 Scanning vault for publish: true...")
    publishable = find_publishable_files()
    print(f"   Found {len(publishable)} publishable file(s)")

    # Sync files
    print("\n📄 Syncing files...")
    synced = 0
    by_folder = {}

    for src, folder in publishable:
        dst = QUARTZ_CONTENT / folder / src.name
        if sync_file(src, dst, dry_run):
            synced += 1
        by_folder[folder] = by_folder.get(folder, 0) + 1

    if synced == 0:
        print("  (no changes)")

    # Show summary by folder
    print("\n📊 Summary:")
    for folder, count in sorted(by_folder.items()):
        print(f"   {folder}: {count} file(s)")

    # Clean orphans if requested
    removed = 0
    if clean:
        print("\n🧹 Cleaning orphaned files...")
        removed = clean_orphans(publishable, dry_run)
        if removed == 0:
            print("  (no orphans)")

    print("\n" + "=" * 50)
    if dry_run:
        print(f"[DRY RUN] Would sync {synced}, remove {removed}")
    else:
        print(f"✅ Synced {synced} file(s)")
        if removed:
            print(f"🗑 Removed {removed} orphan(s)")
    print("=" * 50)


def main():
    parser = argparse.ArgumentParser(
        description="Sync Obsidian vault to Quartz (publish: true anywhere)"
    )
    parser.add_argument("--dry", action="store_true", help="Preview changes")
    parser.add_argument("--no-clean", action="store_true", help="Don't remove unpublished files")
    args = parser.parse_args()

    sync_all(dry_run=args.dry, clean=not args.no_clean)


if __name__ == "__main__":
    main()
