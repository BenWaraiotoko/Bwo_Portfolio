---
title: "One Command, 92 Packages: My Mac Setup Script Grew Up"
date: 2026-10-16
publish: true
category: posts
tags: [macos, automation, homebrew, dotfiles, devtools]
description: "Nine months later, my one-command Mac setup got a V2 — fewer apps, better tools, and a Brewfile that finally makes sense"
---

You know that feeling when a project works so well you stop touching it? That was me and my Mac auto-setup for most of 2026. One command, blank macOS, coffee, done.

Then last week I opened the Brewfile and realized something embarrassing: it had become a junk drawer. Every shiny CLI tool I'd tried, every app I'd installed once and never used again — all still there, faithfully reinstalling themselves on every fresh machine. Tools I'd added *and* tools I'd stopped using months ago. The script never forgot anything. Unlike me, who apparently forgets Firefox. (There's a commit in that repo literally called "I forgot firefox 😱". I stand by it.)

So I gave it a proper V2. Here's what changed and why.

## V2: The Subtraction Update

The big theme isn't what I added — it's what I removed.

**Goodbye AeroSpace.** When I built V1, I bought the whole "tiling window manager, keyboard-only life" story. AeroSpace went in, I configured workspaces, keybindings, the works. And then I used Rectangle and the mouse like a normal person. The config sat there, maintaining itself, being ignored. V2 removes it and stops pretending.

**Goodbye Warp.** Warp is a genuinely nice terminal. But I already run Ghostty as my daily driver, and keeping two terminal configs in dotfiles means maintaining one for no reason. Ghostty stays. Warp's themes and configs are gone.

The lesson here is the same one that applies to any declarative system: **a Brewfile only stays honest if you subtract as deliberately as you add.** Otherwise "declarative" just means you automate your clutter.

## What Survived the Purge

The core stack is unchanged because it works:

- **Homebrew + Brewfile** — one file, single source of truth for ~92 packages
- **GNU Stow** — symlink-based dotfile deployment, 7 configs managed
- **Zsh + Oh My Zsh + Powerlevel10k** — the shell that doesn't make you sad
- **Neovim + LazyVim** — still my IDE-in-progress (ask me in six months)
- **Ghostty + Zed** — terminal and fast editor, both keyboard-friendly

And the new arrivals earned their place:

- **opencode** — open-source AI coding agent for the terminal, the newest member of the AI toolkit section
- **eza** — `ls` with icons and git status, aliased in my zshrc the moment it installs
- **git-delta** — syntax-highlighted diffs that make `git log -p` readable again
- **btop** — system monitoring that looks like a mission control instead of a spreadsheet
- **glow, csvlens, chafa** — markdown rendering, CSV exploring, and images in the terminal, because modern CLIs are legitimately good now

One sneaky fix worth mentioning: the Claude Code alias. V1 pointed at `~/.claude/local/claude --ide`, a path that only existed if you'd installed it their way. V2 uses the cask binary — one line in the Brewfile, one alias in the zshrc, no special snowflake paths.

## Numbers, Because Numbers

- **92** packages in the Brewfile (55 CLI tools, 37 apps)
- **56** VS Code extensions (don't judge, they're for other people's projects)
- **12** labeled sections — the file finally reads like a menu instead of a pile
- **7** dotfile packages managed by Stow
- **2** apps fired, 1 tiling window manager admitted it was never loved

The Brewfile also got reorganized into those 12 labeled sections: CLI Tools, Terminal & TUIs, GNU Utilities, Languages, Dev & Infra, AI, Media Encoders, Security & Network, Editors, Productivity, Communication, Storage & Sync. Sounds boring. Is boring. But now I can audit "what do I actually install" in ten seconds instead of scrolling 200 lines of flat list.

## Why This Still Matters

The whole point of the project is that a fresh Mac costs me one command and fifteen minutes, not two days. That was true in V1 and it's more true now — because a smaller, tighter toolset reinstalls faster and breaks less.

But the real V2 takeaway is broader, and it's the same rule whether you're managing a Brewfile, a Kubernetes cluster, or a data pipeline:

> Desired state is only honest if you prune it. Otherwise you're not declaring intent — you're archiving your history.

The repo is [on GitHub](https://github.com/BenWaraiotoko/BWO-MacAutoSetup) if you want to steal the setup or just the Brewfile structure. It's idempotent, re-runnable, and now 40% less full of lies about my tiling window manager habits.

Now if you'll excuse me, I have a fresh Mac to set up. In one command. Like a civilized person.