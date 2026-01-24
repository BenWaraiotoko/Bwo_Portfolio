---
title: Git Version Control
date: 2025-12-28
description: Git distributed version control system guide and reference
tags:
  - git
  - version-control
  - development
  - cheatsheet
category: second-brain
publish: true
---
## Summary

Git is a distributed version control system that tracks changes in source code during software development. Understanding Git is essential for modern development workflows, collaboration, and maintaining code history.

## Key concepts

- **Repository**: A directory tracked by Git containing project files and history
- **Commit**: A snapshot of changes with a unique identifier (SHA hash)
- **Branch**: A parallel version of the repository for independent development
- **Remote**: A hosted version of the repository (GitHub, GitLab, etc.)
- **Merge**: Combining changes from different branches
- **Pull Request/Merge Request**: A request to merge changes from one branch to another

## Details

### Repository basics

**Initialize and clone:**
```bash
git init                          # Create new repository
git clone <url>                   # Clone existing repository
git clone <url> <directory>       # Clone to specific directory
```

**Configuration:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --list                 # View all settings
```

### Working with changes

**Staging and committing:**
```bash
git status                        # Check current state
git add <file>                    # Stage specific file
git add .                         # Stage all changes
git add -p                        # Stage changes interactively

git commit -m "message"           # Commit with message
git commit --amend                # Modify last commit
git commit --amend --no-edit      # Add to last commit without changing message
```

**Viewing history:**
```bash
git log                           # View commit history
git log --oneline                 # Compact log view
git log --graph --all             # Visual branch history
git log -p <file>                 # See changes to specific file
git show <commit>                 # Show specific commit details
git diff                          # Show unstaged changes
git diff --staged                 # Show staged changes
git diff <branch1>..<branch2>     # Compare branches
```

### Branching and merging

**Branch management:**
```bash
git branch                        # List local branches
git branch -a                     # List all branches (including remote)
git branch <name>                 # Create new branch
git checkout <branch>             # Switch to branch
git checkout -b <branch>          # Create and switch to new branch
git switch <branch>               # Modern way to switch branches
git switch -c <branch>            # Create and switch (modern)

git branch -d <branch>            # Delete merged branch
git branch -D <branch>            # Force delete branch
```

**Merging:**
```bash
git merge <branch>                # Merge branch into current
git merge --no-ff <branch>        # Merge with merge commit
git merge --squash <branch>       # Squash commits during merge
```

**Handling merge conflicts:**
```bash
git status                        # See conflicted files
# Edit files to resolve conflicts
git add <resolved-file>           # Mark as resolved
git commit                        # Complete the merge
git merge --abort                 # Cancel merge
```

### Working with remotes

**Remote management:**
```bash
git remote -v                     # List remotes
git remote add origin <url>       # Add remote
git remote remove <name>          # Remove remote
git remote rename <old> <new>     # Rename remote
```

**Syncing:**
```bash
git fetch                         # Download remote changes
git pull                          # Fetch and merge
git pull --rebase                 # Fetch and rebase
git push                          # Push commits to remote
git push -u origin <branch>       # Push and set upstream
git push --force-with-lease       # Safer force push
```

### Undoing changes

**Unstaging and reverting:**
```bash
git restore <file>                # Discard working changes
git restore --staged <file>       # Unstage file
git reset HEAD~1                  # Undo last commit, keep changes
git reset --hard HEAD~1           # Undo last commit, discard changes
git revert <commit>               # Create new commit that undoes changes
```

**Cleaning:**
```bash
git clean -n                      # Preview untracked files to delete
git clean -fd                     # Delete untracked files and directories
```

### Advanced techniques

**Stashing:**
```bash
git stash                         # Save current changes temporarily
git stash list                    # List all stashes
git stash pop                     # Apply and remove latest stash
git stash apply                   # Apply stash without removing
git stash drop                    # Remove latest stash
```

**Rebasing:**
```bash
git rebase <branch>               # Rebase current branch onto another
git rebase -i HEAD~3              # Interactive rebase last 3 commits
git rebase --continue             # Continue after resolving conflicts
git rebase --abort                # Cancel rebase
```

**Cherry-picking:**
```bash
git cherry-pick <commit>          # Apply specific commit to current branch
```

**Tagging:**
```bash
git tag                           # List tags
git tag v1.0.0                    # Create lightweight tag
git tag -a v1.0.0 -m "message"    # Create annotated tag
git push origin v1.0.0            # Push tag to remote
git push origin --tags            # Push all tags
```

## Examples

**Standard workflow:**
```bash
# Start new feature
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Update with latest main
git checkout main
git pull
git checkout feature/new-feature
git rebase main

# Push to remote
git push -u origin feature/new-feature
```

**Fix mistake in last commit:**
```bash
# Forgot to add file
git add forgotten-file.txt
git commit --amend --no-edit
```

**Undo committed changes:**
```bash
# Safe revert (creates new commit)
git revert HEAD

# Dangerous reset (rewrites history)
git reset --hard HEAD~1
```

**Work on multiple features:**
```bash
# Save current work
git stash

# Switch to other branch
git checkout other-feature
# ... work on other feature ...

# Return to original work
git checkout original-feature
git stash pop
```

**Clean up branch history:**
```bash
# Interactive rebase to squash/edit commits
git rebase -i HEAD~5
# In editor: change 'pick' to 'squash' for commits to combine
```

**Find when bug was introduced:**
```bash
git bisect start
git bisect bad                    # Current version is bad
git bisect good v1.0.0           # v1.0.0 was good
# Git checks out middle commit
# Test and mark as good/bad
git bisect good   # or git bisect bad
# Repeat until bug commit is found
git bisect reset                  # Return to original state
```

## Resources

- [Pro Git Book](https://git-scm.com/book/en/v2) - Comprehensive Git reference
- [Git Documentation](https://git-scm.com/doc) - Official documentation
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Fix common Git mistakes
- [Learn Git Branching](https://learngitbranching.js.org/) - Interactive tutorial
- [GitHub Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)

## Related

- [[cli-tricks]]
- [[linux-networking]]
- [[git-cheatsheet]]
- [[synchro-jupyterlab-git]]
- [[de-project-1-1-hello-docker]]
- [[de-project-1-2-postgresql-in-docker]]
