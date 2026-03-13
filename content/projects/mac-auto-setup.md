---
title: "Mac Auto Setup"
date: 2026-03-08
publish: true
description: Fresh Mac to fully configured dev environment in one command. Because doing it manually twice is once too many.
tags: [automation, macos, dotfiles, shell, infrastructure, devtools]
category: project
---

You know that feeling when you get a new machine and spend two days reinstalling everything, hunting for config files, wondering why your terminal looks wrong?

I got tired of that. So I automated it.

## What It Does

One command turns a factory-fresh Mac into a fully configured keyboard-driven development environment. Tiling window manager, modern shell, Neovim as a full IDE, all dotfiles in place, 60+ tools installed.

```bash
curl -fsSL https://raw.githubusercontent.com/BenWaraiotoko/BWO-MacAutoSetup/main/bootstrap.sh | bash
```

That's it. Go make coffee. Come back to a working setup.

## The Stack

| Tool | Role |
|------|------|
| Homebrew + Brewfile | Declarative package management — one file, all dependencies |
| GNU Stow | Symlink-based dotfile deployment |
| Aerospace | Tiling window manager with i3-style keyboard navigation |
| Zsh + Oh-My-Zsh + Powerlevel10k | Shell that doesn't make you sad |
| Neovim + LazyVim | Full IDE, keyboard-first |
| Zed | Fast editor for when you want something lighter |
| Ghostty / Warp | Terminals worth using |

## The Architecture

```text
Bootstrap Script → Homebrew → Brewfile → Packages & Apps
                      ↓
                 GNU Stow → Dotfiles → ~/.config/*
                      ↓
               Aerospace + Ghostty + Neovim → Keyboard workflow
```

The bootstrap handles two scenarios:

1. **Fresh macOS** — No Git, no Xcode CLI tools, nothing. A curl-able script installs prerequisites, then hands off to the main setup.
2. **Existing system** — Clone the repo, run directly. Safe to re-run as many times as you want.

## Dotfile Structure

```text
dotfiles/
├── aerospace/      → ~/.config/aerospace/
├── nvim/           → ~/.config/nvim/
├── zsh/            → ~/.zshrc, ~/.zprofile
├── git/            → ~/.gitconfig
├── ghostty/        → ~/.config/ghostty/
├── zed/            → ~/.config/zed/
├── sublime-text/   → Sublime Text config
├── obsidian/       → Obsidian config
└── claude/         → ~/.claude/
```

GNU Stow creates symlinks from the repo to the right home directory locations. Change a config in the repo — it's live everywhere, instantly.

## The Keyboard-First Philosophy

The whole workflow is optimized for staying on the keyboard:

- **Aerospace** — Switch workspaces, resize windows, move apps. No mouse required.
- **Neovim** — Modal editing with LSP, fuzzy finding, completions. Full IDE, no Electron.
- **fzf** — Fuzzy finding for files, command history, anything.
- **Vi mode in Zsh** — Because consistency matters.

It sounds extreme until you try it. Then going back feels slow.

Full disclosure though: I'm still actively learning Neovim. The config is there, the keybindings are set up, the plugins are loaded — and I still occasionally stare at the screen wondering how to exit a buffer. So "keyboard-driven" is the goal, not the current reality. Ask me again in six months (or more 😜).

## The Interesting Problems

### Bootstrapping From Zero

A brand new Mac has no Git, no package manager, no developer tools. The bootstrap script can only use what macOS ships with (`curl`, `bash`). It installs Xcode CLI tools, then Homebrew, then clones the repo and hands off. The rest runs from there.

### Idempotency

A setup script that fails halfway and leaves your system in an unknown state is worse than no script at all. Every step checks if it's already done before running. Re-running the script after an interruption picks up where it left off without breaking anything.

### Dotfile Portability

Hardcoded paths break across machines with different usernames or directory structures. GNU Stow's relative symlinks sidestep this entirely — same repo works everywhere.

## Numbers

- **Setup time**: ~15 minutes (mostly downloads)
- **Packages managed**: 60+ CLI tools and applications
- **Dotfiles tracked**: 10+ configurations
- **Re-run safe**: Yes, fully idempotent
- **Documentation**: `docs/TOOLS.md` — full categorized reference for every tool in the Brewfile

## Project

**GitHub**: [BWO-MacAutoSetup](https://github.com/BenWaraiotoko/BWO-MacAutoSetup)

Setup guide, customization options, and troubleshooting docs included.

## Why This Connects to Data Engineering

Infrastructure as code. Declarative configuration. Idempotent automation.

Those aren't just DevOps buzzwords — they're the same principles behind reliable data pipelines:

- Define the desired state, not the steps to get there
- Make it reproducible from any starting point
- Automate the path, document the decisions
- Version control everything

The difference between a good setup script and a good data pipeline is mostly just the domain. The thinking is the same.

---

*Built with shell scripting, GNU Stow, and a strong preference for keeping hands on the keyboard. Runs on Apple Silicon.*
