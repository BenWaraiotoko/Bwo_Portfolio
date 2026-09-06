#!/usr/bin/env python3
"""
Regenerate the homepage "Latest" section from the newest published posts.

Reads frontmatter (title, date, description — or optional `tagline` override)
from content/posts/*.md, sorts by date descending, and rewrites the wikilink
list between markers in content/index.md:

    ## Latest

    <!-- latest:auto-begin -->
    ...generated entries...
    <!-- latest:auto-end -->

Everything between the markers is machine-generated — do not edit by hand.
To customize an entry's hook, set `tagline:` in the post's frontmatter
(vault side); it takes precedence over the first sentence of `description:`.

Usage:
    python3 scripts/update-latest.py          # Rewrite the section
    python3 scripts/update-latest.py --dry    # Preview only

Wired into `make sync` (and therefore `make dev`, `make publish`, `make deploy`).
"""

import argparse
import re
import sys
from datetime import date
from pathlib import Path

CONTENT = Path(__file__).parent.parent / "content"
INDEX = CONTENT / "index.md"

CATEGORIES = ["posts"]  # folders eligible for "Latest", priority order
LIMIT = 5  # number of entries shown
MAX_TAGLINE_CHARS = 110  # cap for the hook text after the em-dash

BEGIN = "<!-- latest:auto-begin -->"
END = "<!-- latest:auto-end -->"


def parse_frontmatter(path: Path) -> dict:
    """Parse the flat YAML frontmatter fields we care about."""
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as e:
        print(f"  ⚠ cannot read {path.name}: {e}")
        return {}
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    fm = {}
    for line in text[3:end].splitlines():
        if ":" not in line or line.startswith((" ", "\t", "-", "#")):
            continue
        key, _, value = line.partition(":")
        fm[key.strip().lower()] = value.strip().strip("\"'")
    return fm


def parse_date(raw: str):
    """Parse a YYYY-MM-DD frontmatter date (full ISO also tolerated)."""
    raw = raw.strip().strip("\"'")
    if not raw:
        return None
    try:
        return date.fromisoformat(raw[:10])
    except ValueError:
        return None


def first_sentence(text: str) -> str:
    """Extract the first sentence of a description, capped at MAX_TAGLINE_CHARS."""
    text = text.strip()
    if not text:
        return ""
    parts = re.split(r"(?<=[.!?])\s+", text, maxsplit=1)
    out = parts[0].strip()
    if len(out) > MAX_TAGLINE_CHARS:
        out = out[:MAX_TAGLINE_CHARS]
        out = re.sub(r"\s+\S*$", "", out).rstrip(" ,;:-") + "…"
    return out


def collect_entries() -> list[dict]:
    """Gather eligible pages from the configured category folders."""
    entries = []
    for folder in CATEGORIES:
        d = CONTENT / folder
        if not d.exists():
            continue
        for md in sorted(d.glob("*.md")):
            if md.name == "index.md":
                continue
            fm = parse_frontmatter(md)
            entries.append(
                {
                    "slug": md.stem,
                    "title": fm.get("title") or md.stem.replace("-", " ").title(),
                    "date": parse_date(fm.get("date", "")),
                    "tagline": first_sentence(fm.get("tagline", "") or fm.get("description", "")),
                }
            )

    def sort_key(e):
        # dated entries first, newest first, alphabetical tie-break
        return (
            0 if e["date"] else 1,
            -e["date"].toordinal() if e["date"] else 0,
            e["title"].lower(),
        )

    return sorted(entries, key=sort_key)


def render_lines(entries: list[dict]) -> list[str]:
    lines = []
    for e in entries[:LIMIT]:
        # keep wikilink syntax intact
        title = e["title"].replace("|", "/").replace("[", "(").replace("]", ")")
        line = f"- [[{e['slug']}|{title}]]"
        if e["tagline"]:
            tag = e["tagline"].replace("|", "/").replace("[", "(").replace("]", ")")
            line += f" — {tag}"
        if e["date"]:
            line += f" *({e['date'].strftime('%b')} {e['date'].day}, {e['date'].year})*"
        lines.append(line)
    return lines


def rewrite_index(lines: list[str], dry: bool = False) -> bool:
    """Replace the content between the markers in content/index.md."""
    text = INDEX.read_text(encoding="utf-8")
    if BEGIN not in text or END not in text:
        print(f"  ✗ markers not found in {INDEX}")
        print(f"    Add these lines under '## Latest' (nothing between them):")
        print(f"      {BEGIN}")
        print(f"      {END}")
        return False

    before, _, _ = text.partition(BEGIN)
    _, _, after = text.partition(END)
    new_text = before + BEGIN + "\n" + "\n".join(lines) + "\n" + END + after

    if new_text == text:
        print("  (Latest section already up to date)")
        return True
    if dry:
        print("  [DRY] Latest section would become:")
        for line in lines:
            print(f"    {line}")
    else:
        INDEX.write_text(new_text, encoding="utf-8")
        print(f"  ✓ Updated 'Latest' section in content/index.md ({len(lines)} entries)")
    return True


def main():
    parser = argparse.ArgumentParser(description="Regenerate the homepage Latest section")
    parser.add_argument("--dry", action="store_true", help="Preview without writing")
    args = parser.parse_args()

    entries = collect_entries()
    dated = sum(1 for e in entries if e["date"])
    print(f"  Scanned {len(entries)} page(s) in {', '.join(CATEGORIES)} ({dated} with dates)")

    ok = rewrite_index(render_lines(entries), dry=args.dry)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()