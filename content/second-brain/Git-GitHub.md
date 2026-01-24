---
title: Git & GitHub for Data Engineers
date: 2026-01-22
publish: true
description: Master Git version control and GitHub collaboration—essential for professional pipelines and code reviews.
tags:
  - git
  - github
  - version-control
  - collaboration
category: second-brain
---
**Git** is how you track code changes, collaborate, and maintain history. Every data engineer uses it daily. GitHub is the cloud platform where teams collaborate.

---

## Core Concepts

**Repository (Repo):** Folder with Git version history
**Commit:** Snapshot of code at a point in time
**Branch:** Parallel version of code
**Merge:** Combine branches

---

## Getting Started

```bash
# Clone a repository
git clone https://github.com/user/my-pipeline.git

# Initialize new repo
git init

# Check status
git status

# See changes
git diff
```

---

## Committing Changes

```bash
# Stage changes
git add file.py            # Stage specific file
git add .                  # Stage all changes

# Commit with message
git commit -m "Fix extraction query for daily revenue"

# View history
git log
git log --oneline          # Compact view

# Undo last commit (keep changes)
git reset HEAD~1

# Undo commit (discard changes)
git reset --hard HEAD~1
```

**Good commit message:** Clear, concise, action-oriented
- ✅ "Fix: update extraction query to include deleted records"
- ❌ "Fixed stuff"
- ❌ "asdf"

---

## Branches (Parallel Development)

```bash
# Create & switch branch
git checkout -b feature/add-daily-summary

# List branches
git branch

# Switch between branches
git checkout main
git checkout feature/add-daily-summary

# Delete branch
git branch -d feature/add-daily-summary

# Merge branch into main
git checkout main
git merge feature/add-daily-summary
```

**Workflow:**
1. `git checkout -b feature/my-feature` (create feature branch)
2. Make changes, commit
3. `git push origin feature/my-feature` (push to GitHub)
4. Create Pull Request on GitHub
5. Teammate reviews
6. Merge after approval

---

## Pushing & Pulling

```bash
# Push local commits to GitHub
git push origin main

# Push new branch
git push origin feature/my-feature

# Pull latest changes
git pull origin main

# Fetch without merging
git fetch origin

# Rebase (cleaner history than merge)
git rebase origin/main
```

---

## Collaboration: Pull Requests

### Creating a PR (GitHub)

1. Push your branch: `git push origin feature/my-feature`
2. Go to GitHub → "Compare & pull request"
3. Add title and description
4. Request reviewers

### Reviewing a PR

```bash
# Pull reviewer's branch
git checkout feature/my-feature
git pull origin feature/my-feature

# Test locally
python -m pytest tests/

# Approve or request changes
```

---

## Handling Merge Conflicts

When two branches modify the same line:

```bash
# During merge
git merge feature/other-branch

# If conflict:
# Git marks conflicts with:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>> feature/other-branch

# Edit file to resolve, then:
git add .
git commit -m "Resolve merge conflict"
```

---

## Essential .gitignore

```bash
# Secrets
.env
credentials.json

# Data files (too large)
*.csv
*.parquet
data/

# Python
__pycache__/
*.pyc
.venv/

# IDE
.vscode/
.idea/

# Pipeline artifacts
logs/
*.log
dbt_packages/
target/
```

---

## Real-World Workflow

```bash
# Morning: sync with main
git pull origin main

# Create feature branch
git checkout -b feature/fix-extraction-bug

# Make changes
vim dags/etl_pipeline.py

# Commit progress
git add dags/etl_pipeline.py
git commit -m "Fix: exclude deleted users from extraction"

# Push & create PR
git push origin feature/fix-extraction-bug
# (GitHub: create pull request)

# After review, merge on GitHub
# Pull merged main locally
git checkout main
git pull origin main

# Delete local feature branch
git branch -d feature/fix-extraction-bug
```

---

## Tips & Gotchas

- **Commit often, push regularly.** Small commits are easier to review and revert if needed.

- **Never commit secrets.** Use `.gitignore` and environment variables.

```bash
# ❌ Don't commit
DB_PASSWORD="secret123"

# ✅ Use
export DB_PASSWORD="secret123"
# Or in .env (add to .gitignore)
```

- **Pull before push.** Always `git pull` before `git push` to avoid conflicts.

```bash
git pull origin main
# Make changes
git push origin main
```

---

## Related

- [[Apache-Airflow]] — DAGs in Git
- [[dbt-Data-Build-Tool]] — dbt projects in Git
- [[Docker-Fundamentals]] — Dockerfile versioning
- [[TOOLS-Learning-Roadmap]] — Your complete tools learning path

---

**Key Takeaway:**  
Git = time travel for code. Commit often, use branches for features, collaborate via PRs, never commit secrets. GitHub is your backup and collaboration hub.
