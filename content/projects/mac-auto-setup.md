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

> **V2 (Oct 2026):** the setup got a subtraction pass — AeroSpace and Warp are gone, the Brewfile is reorganized into 12 labeled sections (~92 packages), and OpenCode joined the AI toolkit. Same one-command promise, tighter toolset. Details in the [V2 write-up](/posts/mac-autosetup-v2).

## What It Does

One command turns a factory-fresh Mac into a fully configured, keyboard-friendly development environment. Modern shell, Neovim as a full IDE, all dotfiles in place, ~92 tools installed.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/BenWaraiotoko/BWO-MacAutoSetup/main/bootstrap-nogit.sh)
```

That's it. Go make coffee. Come back to a working setup.

## The Stack

| Tool | Role |
|------|------|
| Homebrew + Brewfile | Declarative package management — one file, all dependencies, 12 labeled sections |
| GNU Stow | Symlink-based dotfile deployment |
| Zsh + Oh-My-Zsh + Powerlevel10k | Shell that doesn't make you sad |
| Neovim + LazyVim | Full IDE, keyboard-first |
| Zed | Fast editor for when you want something lighter |
| Ghostty | The terminal (Warp retired in V2) |
| opencode | Open-source AI coding agent for the terminal |

## The Architecture

```text
Bootstrap Script → Homebrew → Brewfile → Packages & Apps
                      ↓
                 GNU Stow → Dotfiles → ~/.config/*
                      ↓
               Ghostty + Neovim + Zed → Keyboard workflow
```

The bootstrap handles two scenarios:

1. **Fresh macOS** — No Git, no Xcode CLI tools, nothing. A curl-able script installs prerequisites, then hands off to the main setup.
2. **Existing system** — Clone the repo, run directly. Safe to re-run as many times as you want.

## Dotfile Structure

```text
dotfiles/
├── zsh/           → ~/.zshrc, ~/.zprofile
├── vim/           → ~/.vimrc, ~/.vim/
├── nvim/          → ~/.config/nvim/
├── ghostty/       → ~/.config/ghostty/
├── superclaude/   → ~/.claude/
├── sublime-text/  → Sublime Text config
├── zed/           → ~/.config/zed/
└── obsidian/      → Obsidian config (copied into the vault, not stowed)
```

GNU Stow creates symlinks from the repo to the right home directory locations. Change a config in the repo — it's live everywhere, instantly.

## The Keyboard-First Philosophy

The whole workflow is optimized for staying on the keyboard:

- **Ghostty + Zed** — fast native apps, keyboard-first by design
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
- **Packages managed**: ~92 (55 CLI tools, 37 apps) + 56 VS Code extensions
- **Brewfile**: 12 labeled sections — reads like a menu, not a junk drawer
- **Dotfiles tracked**: 7 stow packages + Obsidian config
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
