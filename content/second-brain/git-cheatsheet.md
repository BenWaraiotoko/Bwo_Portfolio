---
title: Git Cheatsheet (Quick Reference)
date: 2026-01-22
publish: true
description: Quick reference for Git commands—clone, branch, commit, push, pull, merge, resolve conflicts.
tags:
  - git
  - cheatsheet
  - quick-reference
category: second-brain
---
# Git Cheatsheet

Quick command reference. For detailed explanations, see [[Git-GitHub]].

---

## Getting Started

```bash
# Clone repository
git clone https://github.com/user/repo.git

# Initialize new repo
git init

# Check status
git status

# See changes
git diff
```

---

## Committing

```bash
# Stage changes
git add file.py              # Specific file
git add .                    # All changes
git add -p                   # Interactive staging

# Commit
git commit -m "Your message"
git commit --amend           # Edit last commit

# View history
git log
git log --oneline
git log --oneline -n 10      # Last 10 commits
git log --graph --all        # Visual tree
```

---

## Branching

```bash
# Create & switch
git checkout -b feature/my-feature
git switch -c feature/my-feature     # Newer syntax

# List branches
git branch
git branch -a                        # Include remote

# Switch
git checkout main
git switch main                      # Newer syntax

# Delete
git branch -d feature/my-feature
git branch -D feature/my-feature     # Force delete

# Rename
git branch -m old-name new-name
```

---

## Pushing & Pulling

```bash
# Push to remote
git push origin main
git push origin feature/my-feature
git push -u origin feature/my-feature  # Set upstream

# Pull latest
git pull origin main
git pull                     # Pull current branch

# Fetch without merging
git fetch origin
git fetch --all              # All remotes

# Rebase (cleaner history)
git rebase origin/main
git rebase -i HEAD~3         # Interactive rebase last 3 commits
```

---

## Merging

```bash
# Merge branch into current
git merge feature/my-feature

# Abort merge
git merge --abort

# Merge only specific commits
git cherry-pick abc123
git cherry-pick abc123 def456  # Multiple commits
```

---

## Resolving Conflicts

```bash
# Check status during conflict
git status

# Edit files, then:
git add .
git commit -m "Resolve merge conflict"

# Or abort
git merge --abort
git rebase --abort
```

---

## Undoing Changes

```bash
# Unstage file
git reset HEAD file.py
git restore --staged file.py       # Newer syntax

# Discard changes
git checkout -- file.py
git restore file.py                # Newer syntax

# Undo last commit (keep changes)
git reset HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert commit (creates new commit)
git revert abc123

# Find lost commits
git reflog
git reset --hard abc123            # Recover
```

---

## Stashing

```bash
# Save changes temporarily
git stash

# List stashes
git stash list

# Apply stash
git stash apply stash@{0}
git stash pop stash@{0}            # Apply & remove

# Delete stash
git stash drop stash@{0}
git stash clear                    # Delete all
```

---

## Remote Management

```bash
# View remotes
git remote
git remote -v                      # Verbose

# Add remote
git remote add origin https://...

# Remove remote
git remote remove origin

# Update remote URL
git remote set-url origin https://new-url
```

---

## Tags (Releases)

```bash
# Create tag
git tag v1.0.0
git tag v1.0.0 abc123              # Tag specific commit

# Push tags
git push origin v1.0.0
git push origin --tags             # All tags

# Delete tag
git tag -d v1.0.0
git push origin -d v1.0.0          # Delete remote

# List tags
git tag
git tag -l "v1.*"                  # Pattern
```

---

## Configuration

```bash
# Set name & email
git config --global user.name "Benjamin"
git config --global user.email "benjamin@example.com"

# View config
git config --list
git config user.name

# Set default editor
git config --global core.editor "vim"

# Setup SSH key
ssh-keygen -t ed25519 -C "benjamin@example.com"
cat ~/.ssh/id_ed25519.pub         # Copy to GitHub
```

---

## Helpful Aliases

```bash
# Add aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'

# Use
git co main
git st
git last
```

---

## Workflow Examples

### Feature Branch Workflow

```bash
# 1. Create feature branch
git checkout -b feature/add-logging

# 2. Make changes & commit
vim app.py
git add app.py
git commit -m "Add logging module"

# 3. Push to GitHub
git push -u origin feature/add-logging

# 4. Create PR on GitHub

# 5. After approval, merge on GitHub

# 6. Pull & clean up locally
git checkout main
git pull origin main
git branch -d feature/add-logging
```

### Daily Workflow

```bash
# Morning: sync main
git checkout main
git pull origin main

# Work on feature
git checkout -b feature/my-task
# ... make changes ...
git add .
git commit -m "Implement my feature"

# Before pushing, sync with main
git fetch origin
git rebase origin/main

# Push & create PR
git push origin feature/my-task
```

---

## Emergency Commands

```bash
# "I committed to wrong branch"
git reset HEAD~1                   # Undo commit
git checkout -b correct-branch     # Create correct branch
git commit -m "..."                # Recommit

# "I need the old version"
git log --all --oneline | grep "message"
git checkout abc123 -- file.py     # Get specific version

# "I lost my branch"
git reflog                         # Find the ref
git checkout -b recovered-branch abc123

# "Merge went wrong"
git merge --abort
git reset --hard HEAD~1            # Undo merge
```

---

## Common Mistakes & Fixes

| Mistake | Fix |
|---------|-----|
| Committed to `main` instead of feature branch | `git reset HEAD~1`, `git checkout -b feature-branch`, `git commit -m "..."`  |
| Pushed secret credentials | Remove from history with `git filter-branch` or [github.com/GitGuardian](https://github.com/GitGuardian) |
| Large file committed | `git rm --cached file.bin`, add to `.gitignore`, `git commit --amend` |
| Merge conflict frustration | Read conflict markers carefully, edit, `git add .`, `git commit` |
| Wrong branch for PR | Change PR target on GitHub or create new PR from correct branch |

---

## Data Engineering Best Practices

```bash
# .gitignore for data projects
*.csv
*.parquet
*.xlsx
data/
logs/
.env
credentials.json
__pycache__/
.venv/
dbt_packages/
target/

# Good commit messages
git commit -m "feat: add incremental dbt model for transactions"
git commit -m "fix: exclude deleted records from staging"
git commit -m "test: add data quality checks to orders model"
git commit -m "docs: update README with Airflow setup"
```

---

## Quick Tips

- **Before pushing:** `git pull origin main` → avoid conflicts
- **Before merging:** Push to feature branch → create PR → let team review
- **Commit often:** Easier to revert small changes
- **Use branches:** Never work directly on `main`
- **Clear messages:** Use imperative: "Add feature" not "Added feature"

---

## Related

- [[Git-GitHub]] — Full Git guide with detailed explanations
- [[TOOLS-Learning-Roadmap]] — Your complete tools learning path

---

*Last updated: Jan 22, 2026*
