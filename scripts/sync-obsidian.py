#!/usr/bin/env python3
from typing import List, Tuple, Optional
"""
Sync Obsidian vault to Quartz - publish: true anywhere in vault.

Scans your ENTIRE vault and syncs any file with `publish: true` frontmatter.
Files are organized by their `category` frontmatter field:
  - category: posts        → content/posts/
  - category: learning-log → content/learning-logs/
  - category: project      → content/projects/
  - category: second-brain → content/second-brain/ (default)

Also copies images referenced in published notes to content/<folder>/assets/.

Usage:
    python scripts/sync-obsidian.py          # Sync all
    python scripts/sync-obsidian.py --dry    # Preview changes
    python scripts/sync-obsidian.py --clean  # Remove orphaned files
"""

import argparse
import re
import shutil
from pathlib import Path

# Image extensions to handle
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".tiff", ".avif"}

# Configuration
VAULT_PATH = (
    Path.home() / "Library" / "Mobile Documents" / "iCloud~md~obsidian" / "Documents" / "bwo-second-brain"
)
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


def extract_image_refs(file_path: Path) -> List[str]:
    """Extract image filenames/paths from a markdown file.

    Handles both:
      - Obsidian wiki-links: ![[image.png]]
      - Standard markdown:   ![alt](path/to/image.png)
    """
    content = file_path.read_text(encoding="utf-8")
    refs: List[str] = []

    # Wiki-link embeds: ![[some image.png]]
    for m in re.finditer(r"!\[\[([^\]]+\.(png|jpg|jpeg|gif|svg|webp|bmp|tiff|avif))\]\]", content, re.IGNORECASE):
        refs.append(m.group(1))

    # Standard markdown images: ![alt](path/to/image.png) — skip external URLs
    for m in re.finditer(r"!\[[^\]]*\]\(([^)]+\.(png|jpg|jpeg|gif|svg|webp|bmp|tiff|avif))\)", content, re.IGNORECASE):
        ref = m.group(1)
        if not ref.startswith(("http://", "https://")):
            refs.append(ref)

    return refs


def find_image_in_vault(image_ref: str, note_path: Path) -> Optional[Path]:
    """Locate an image file in the vault.

    Search order:
      1. Relative to the note's directory (Obsidian default: note-dir/assets/)
      2. Vault-wide rglob (fallback)
    """
    image_name = Path(image_ref).name  # Strip any path prefix from the ref

    # 1. Look in assets/ next to the note
    candidate = note_path.parent / "assets" / image_name
    if candidate.exists():
        return candidate

    # 2. Look directly next to the note
    candidate = note_path.parent / image_name
    if candidate.exists():
        return candidate

    # 3. Full vault search
    for found in VAULT_PATH.rglob(image_name):
        if found.is_file():
            return found

    return None


def sync_images(src_note: Path, target_folder: str, dry_run: bool = False) -> tuple[int, int]:
    """Copy images referenced in src_note to content/<target_folder>/assets/.

    Returns (copied_count, missing_count).
    """
    refs = extract_image_refs(src_note)
    if not refs:
        return 0, 0

    copied = 0
    missing = 0
    assets_dst = QUARTZ_CONTENT / target_folder / "assets"

    for ref in refs:
        src_img = find_image_in_vault(ref, src_note)
        if src_img is None:
            print(f"  ⚠ Missing image: {ref!r} (referenced in {src_note.name})")
            missing += 1
            continue

        dst_img = assets_dst / src_img.name
        if dst_img.exists():
            src_mtime = src_img.stat().st_mtime
            dst_mtime = dst_img.stat().st_mtime
            if src_mtime <= dst_mtime:
                continue  # Already up to date

        is_new = not dst_img.exists()
        if dry_run:
            action = "create" if is_new else "update"
            print(f"  [{action.upper()}] {target_folder}/assets/{src_img.name}")
        else:
            assets_dst.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_img, dst_img)
            action = "Created" if is_new else "Updated"
            print(f"  ✓ {action}: {target_folder}/assets/{src_img.name}")

        copied += 1

    return copied, missing


def clean_orphan_images(publishable_files: List[Tuple[Path, str]], dry_run: bool = False) -> int:
    """Remove images from content assets/ that are no longer referenced by any published note."""
    # Build set of all referenced image names across published notes
    referenced: dict[str, set[str]] = {}  # folder → set of image filenames
    for src, folder in publishable_files:
        refs = extract_image_refs(src)
        if folder not in referenced:
            referenced[folder] = set()
        for ref in refs:
            referenced[folder].add(Path(ref).name)

    removed = 0
    for folder in ["posts", "projects", "learning-logs", "second-brain"]:
        assets_dir = QUARTZ_CONTENT / folder / "assets"
        if not assets_dir.exists():
            continue
        expected_names = referenced.get(folder, set())
        for img in assets_dir.iterdir():
            if img.is_file() and img.suffix.lower() in IMAGE_EXTENSIONS:
                if img.name not in expected_names:
                    if dry_run:
                        print(f"  [REMOVE] {folder}/assets/{img.name}")
                    else:
                        img.unlink()
                        print(f"  🗑 Removed: {folder}/assets/{img.name}")
                    removed += 1

    return removed


def find_publishable_files() -> List[Tuple[Path, str]]:
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

    is_new = not dst.exists()
    if dry_run:
        action = "create" if is_new else "update"
        print(f"  [{action.upper()}] {dst.relative_to(QUARTZ_CONTENT)}")
    else:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        action = "Created" if is_new else "Updated"
        print(f"  ✓ {action}: {dst.relative_to(QUARTZ_CONTENT)}")

    return True


def clean_orphans(publishable_files: List[Tuple[Path, str]], dry_run: bool = False) -> int:
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

    # Sync images
    print("\n🖼 Syncing images...")
    total_img_copied = 0
    total_img_missing = 0

    for src, folder in publishable:
        img_copied, img_missing = sync_images(src, folder, dry_run)
        total_img_copied += img_copied
        total_img_missing += img_missing

    if total_img_copied == 0 and total_img_missing == 0:
        print("  (no image changes)")
    if total_img_missing > 0:
        print(f"  ⚠ {total_img_missing} image(s) not found in vault")

    # Show summary by folder
    print("\n📊 Summary:")
    for folder, count in sorted(by_folder.items()):
        print(f"   {folder}: {count} file(s)")

    # Clean orphans if requested
    removed = 0
    removed_imgs = 0
    if clean:
        print("\n🧹 Cleaning orphaned files...")
        removed = clean_orphans(publishable, dry_run)
        if removed == 0:
            print("  (no orphans)")

        print("\n🧹 Cleaning orphaned images...")
        removed_imgs = clean_orphan_images(publishable, dry_run)
        if removed_imgs == 0:
            print("  (no orphaned images)")

    print("\n" + "=" * 50)
    if dry_run:
        print(f"[DRY RUN] Would sync {synced} file(s), {total_img_copied} image(s); remove {removed} file(s), {removed_imgs} image(s)")
    else:
        print(f"✅ Synced {synced} file(s), {total_img_copied} image(s)")
        if removed:
            print(f"🗑 Removed {removed} orphan file(s)")
        if removed_imgs:
            print(f"🗑 Removed {removed_imgs} orphaned image(s)")
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
