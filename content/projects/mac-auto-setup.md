---
title: 🖥️ Mac Auto Setup
date: 2026-01-14
publish: true
description: Automated macOS development environment with keyboard-driven workflow, tiling window manager, and declarative dotfile management
tags:
  - automation
  - macos
  - dotfiles
  - shell
  - infrastructure
  - devtools
category: project
---

## The Problem

Setting up a new Mac for development is tedious. Installing tools manually, configuring preferences, symlinking dotfiles—it takes hours of repetitive work. And when something breaks or you get a new machine, you start from scratch.

The challenge: **automate the entire macOS setup process so a fresh machine becomes a fully configured development environment in one command.**

## The Solution

I built a two-tier bootstrap system that configures a keyboard-driven macOS workflow. It installs a tiling window manager, modern shell environment, Neovim as a full IDE, and manages all dotfiles through GNU Stow. Everything is declarative and version-controlled.

### Key Features

- **One-command setup** — Fresh Mac to productive environment in minutes
- **Tiling window manager** — Aerospace with i3-inspired keyboard navigation
- **Modern shell** — Zsh + Oh-My-Zsh + Powerlevel10k for enhanced terminal UX
- **Neovim IDE** — LazyVim configuration with LSP, completions, and fuzzy finding
- **Declarative dependencies** — Brewfile manages all packages and applications
- **Dotfile management** — GNU Stow for symlink-based configuration deployment
- **SuperClaude Framework** — 30+ slash commands for Claude Code enhancement

### Technical Architecture

```text
Bootstrap Script → Homebrew → Brewfile → Packages/Apps
                      ↓
                 GNU Stow → Dotfiles → ~/.config/*
                      ↓
               Aerospace + Ghostty + Neovim → Keyboard-driven workflow
```

### Technologies Used

- **Zsh + Oh-My-Zsh** — Shell framework with plugins and themes
- **Powerlevel10k** — Fast, customizable prompt
- **Aerospace** — Tiling window manager for macOS
- **Neovim + LazyVim** — Modern Vim distribution with IDE features
- **GNU Stow** — Symlink farm manager for dotfiles
- **Homebrew** — Package manager with Brewfile declarative installs
- **Ghostty / Warp** — Modern terminal emulators

## Implementation Details

### Two-Tier Bootstrap

The system handles two scenarios:

1. **Fresh macOS** — No Git, no Xcode CLI tools. A curl-able bootstrap script installs prerequisites then hands off to the main setup.

2. **Existing systems** — Clone the repo and run the bootstrap directly. Idempotent—safe to re-run.

### Dotfile Structure

```text
dotfiles/
├── aerospace/    → ~/.config/aerospace/
├── nvim/         → ~/.config/nvim/
├── zsh/          → ~/.zshrc, ~/.zprofile
├── git/          → ~/.gitconfig
├── ghostty/      → ~/.config/ghostty/
└── claude/       → ~/.claude/
```

GNU Stow creates symlinks from the repo to home directory locations. Change a config in the repo, it's live everywhere.

### Keyboard-Driven Philosophy

The entire workflow optimizes for keyboard navigation:

- **Aerospace** — Window tiling and workspace management without touching the mouse
- **Neovim** — Modal editing with full IDE capabilities
- **fzf** — Fuzzy finding for files, history, and commands
- **Zsh keybindings** — Vi mode in the shell

## Challenges & Learnings

### Challenge: Fresh Mac Bootstrap

New Macs have no Git, no package manager, no developer tools. Solution: A minimal bootstrap script that only uses built-in macOS commands (`curl`, `bash`) to install Xcode CLI tools and Homebrew first.

### Challenge: Dotfile Portability

Hardcoding paths breaks across machines. Solution: GNU Stow's relative symlinks work regardless of username or directory structure.

### Challenge: Idempotency

Setup scripts that fail halfway are painful to debug. Solution: Every step checks if it's already done before executing. Re-running the script is always safe.

## Results

The system sets up a complete development environment in under 15 minutes. Every configuration is version-controlled, so rolling back changes or onboarding new machines is trivial.

**Setup time**: ~15 minutes (mostly download time)
**Packages managed**: 50+ CLI tools and applications
**Dotfiles tracked**: 10+ configurations
**Re-run safe**: Yes, fully idempotent

## Project Links

- **GitHub Repository**: [BWO-MacAutoSetup](https://github.com/BenWaraiotoko/BWO-MacAutoSetup)
- **Documentation**: Setup guide, customization options, troubleshooting

## What This Project Demonstrates

This project shows **automation mindset**, **infrastructure as code**, and **developer experience optimization**—skills that translate directly to data engineering:

- Treating configuration as code
- Building idempotent, reproducible systems
- Declarative dependency management
- Automation over manual processes
- Documentation for future maintainability

The same principles apply to data pipelines: **define the desired state, automate the path to get there, make it repeatable.**

---

*Built with shell scripting, GNU Stow, and a preference for keyboard-driven workflows. Runs on Apple Silicon.*
