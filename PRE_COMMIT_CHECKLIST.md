# 🔒 Pre-Commit Security Checklist

**IMPORTANT:** Review this checklist BEFORE every `git commit` and `git push` to GitHub.

Your portfolio is **PUBLIC** - colleagues and management may view it!

---

## ✅ Content Review Checklist

Run these checks before committing:

### 🚫 Career Change Language

- [ ] **No mentions of "career change" or "transitioning careers"**
- [ ] **No mentions of "former" role or "was a" language**
- [ ] **No "relocating" or "moving to" any location**
- [ ] **No specific future employment plans or job search**

### 🚫 Japan & Location References

- [ ] **No mentions of Fukuoka, Japan, or any specific relocation plans**
- [ ] **No Japanese language study (JLPT, N3, N2, N1)**
- [ ] **No "living in Japan" or "working in Japan" goals**
- [ ] **No 2029 or specific year targets for relocation**

### 🚫 Bootcamp & Training Programs

- [ ] **No Le Wagon bootcamp references**
- [ ] **No specific bootcamp preparation or application timelines**
- [ ] **No "Autumn 2026" or specific bootcamp dates**

### ✅ Safe Language

**Instead, use:**
- ✅ "Expanding skills" instead of "changing careers"
- ✅ "Professional development" instead of "career transition"
- ✅ "Enhancing broadcast infrastructure expertise"
- ✅ "Applying to current workflows" instead of "preparing for new role"

---

## 🔍 File-by-File Review

Before committing, check these files:

### README.md

- [ ] Headline positions as "skill expansion" not "career change"
- [ ] No Japan/Fukuoka/relocation mentions
- [ ] No bootcamp or Japanese study references
- [ ] Timeline focuses on professional development, not job change

### Learning Logs (content/learning-logs/)

- [ ] **ONLY commit files ending in `-public.md`**
- [ ] No personal goals (JLPT, Japan, Le Wagon)
- [ ] Focus on broadcast technology applications
- [ ] Professional development framing only

### Blog Posts (content/posts/)

- [ ] No career change language
- [ ] No personal relocation plans
- [ ] Technical content focused on current industry
- [ ] Professional tone throughout

### Archetypes (archetypes/)

- [ ] Templates don't include sensitive prompts
- [ ] No JLPT, Le Wagon, or Japan sections
- [ ] Focus on professional development
- [ ] Broadcast technology applications emphasized

---

## 🛡️ Git Commands to Run First

**Before committing, verify what's being committed:**

```bash
# 1. Check git status
git status

# 2. Review changes in each file
git diff README.md
git diff content/learning-logs/
git diff archetypes/

# 3. Verify .gitignore is working
git status --ignored

# Should see CLAUDE.md as ignored!
# Should see private learning logs as ignored!
```

---

## 🚨 Red Flags - STOP if you see:

### In git status:
- ❌ `CLAUDE.md` (should be ignored!)
- ❌ `content/learning-logs/week-*-dec-*.md` (unless it's `*-public.md`)
- ❌ Any file with `-private.md`
- ❌ `notes/`, `private/`, `personal/` directories

### In file content:
- ❌ "Fukuoka"
- ❌ "Japan" (in career context)
- ❌ "JLPT" or "N3"
- ❌ "Le Wagon"
- ❌ "relocate" or "move to"
- ❌ "2029" (in career timeline context)
- ❌ "career change" or "transitioning"

---

## ✅ Safe to Commit When:

### File types:
- ✅ `README.md` (after review)
- ✅ `*-public.md` learning logs
- ✅ Published blog posts (after review)
- ✅ Project showcases (professional focus)
- ✅ Archetypes (sanitized templates)
- ✅ Code, CSS, JavaScript
- ✅ Configuration files (config.toml, etc.)

### Language used:
- ✅ "Professional development"
- ✅ "Expanding skillset"
- ✅ "Broadcast infrastructure optimization"
- ✅ "Data engineering for media workflows"
- ✅ "Enhancing current expertise"

---

## 📝 Pre-Commit Command Sequence

**Run these commands in order:**

```bash
# 1. Check what files are being committed
git status

# 2. Verify CLAUDE.md is NOT listed (should be gitignored)
# If it appears, DO NOT COMMIT!

# 3. Review each file's content
git diff [filename]

# 4. Search for sensitive keywords in all staged files
git diff --cached | grep -i "fukuoka\|jlpt\|le wagon\|relocat\|career change"

# If this returns ANY results, review and fix before committing!

# 5. Only commit if all checks pass
git commit -m "Your commit message"

# 6. Final check before push
git log -1 --stat

# 7. Push to GitHub
git push origin main
```

---

## 🔐 Emergency: Accidentally Committed Sensitive Info?

**If you pushed sensitive content to GitHub:**

### Option 1: Immediate Fix (for recent commits)

```bash
# 1. Remove the sensitive content
# 2. Amend the commit
git add .
git commit --amend --no-edit

# 3. Force push (rewrites history)
git push origin main --force
```

### Option 2: Nuclear Option (if needed)

```bash
# Remove file from entire Git history
git filter-branch --index-filter \
'git rm --cached --ignore-unmatch path/to/sensitive/file' HEAD

git push origin main --force
```

**⚠️ Note:** Force push rewrites history. Use with caution!

---

## 📋 Quick Reference: Allowed vs. Forbidden

| ❌ FORBIDDEN | ✅ ALLOWED |
|-------------|-----------|
| "Transitioning to Data Engineer" | "Expanding into Data Engineering" |
| "Moving to Fukuoka in 2029" | "Professional development timeline" |
| "JLPT N3 study" | _(Remove entirely)_ |
| "Le Wagon bootcamp" | _(Remove entirely)_ |
| "Career change journey" | "Professional development journey" |
| "Former broadcast engineer" | "Broadcast infrastructure specialist" |
| "Looking for Data Engineer jobs" | "Building data engineering skills" |

---

## 🎯 Remember

**Your GitHub profile is PUBLIC.**

Anyone with the link can see:
- ✅ Your commit messages
- ✅ All file contents
- ✅ Complete commit history
- ✅ Everything in the repository

**Keep personal career plans private!**

---

**Last Updated:** December 24, 2025
**Status:** 🔒 Security Checklist Active
