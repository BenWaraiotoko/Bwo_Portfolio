---
title: 🐧 Omarchy Auto Setup
date: 2026-03-08
publish: true
description: Post-install customization layer for Omarchy (Arch Linux + Hyprland), extending the base system with personal dotfiles, CLI toolkit, and AI-enhanced workflow
tags:
  - automation
  - linux
  - arch
  - dotfiles
  - shell
  - infrastructure
  - devtools
category: project
---

## The Problem

Omarchy gives you a solid keyboard-driven Linux base — Arch, Hyprland, Neovim — but a fresh install still needs layers of personal tooling, dotfiles, and configurations to become a productive daily driver.

The challenge: **automate the post-install setup so any Omarchy machine gets the same consistent environment in one script.**

## The Solution

A post-install automation layer that runs on top of a working Omarchy installation. It installs extra CLI tools, deploys personal dotfiles via copy-based deployment, applies a consistent Catppuccin Mocha theme across all editors, and brings in the same AI-enhanced workflow I use on macOS.

This project mirrors the [BWO-MacAutoSetup](https://github.com/BenWaraiotoko/BWO-MacAutoSetup) — the same philosophy, adapted for Linux.

### Key Features

- **One-script setup** — Post-Omarchy to fully personalized environment in one command
- **30+ extra CLI tools** — lazysql, git-delta, ranger, csvlens, glow, chafa and more
- **Consistent theming** — Catppuccin Mocha across Neovim, Zed, and Ghostty
- **Cross-platform parity** — Same tools and workflow as the macOS setup
- **SuperClaude Framework** — 30+ slash commands for Claude Code enhancement
- **Cloud/DevOps tooling** — AWS CLI v2, kubectl, Tailscale pre-configured
- **AI tooling** — Claude Code with SuperClaude Framework integration

### Technical Architecture

```text
Omarchy Base (Arch + Hyprland + Neovim)
          ↓
    install.sh
          ↓
  pacman/AUR (yay) → bwo-packages.txt → CLI tools & apps
          ↓
   dotfiles/ → copy-based deployment → ~/.config/*
          ↓
  Ghostty + Zed + Neovim → Catppuccin Mocha theme
```

### Technologies Used

- **Arch Linux + Hyprland** — Base OS with tiling compositor
- **Bash** — Shell and scripting environment
- **Neovim + LazyVim** — IDE with Catppuccin Mocha theme
- **Zed** — Fast, collaborative code editor
- **Ghostty** — GPU-accelerated terminal emulator
- **pacman / yay (AUR)** — Package management
- **SuperClaude Framework** — AI workflow enhancement for Claude Code
- **AWS CLI v2 / kubectl / Tailscale** — Cloud and DevOps tooling

## Implementation Details

### Post-Install Approach

Unlike the macOS counterpart which bootstraps from zero, this script assumes Omarchy is already installed. It extends the base system rather than replacing it — additive, not destructive.

```bash
git clone https://github.com/BenWaraiotoko/BWO-Omarchy-AutoSetup.git ~/Projects/BWO-Omarchy-AutoSetup
cd ~/Projects/BWO-Omarchy-AutoSetup
./install.sh
```

### Dotfile Structure

```text
dotfiles/
├── bash/       → ~/.bashrc.d/ (aliases, exports)
├── vim/        → ~/.vimrc (minimal Vim config)
├── nvim/       → ~/.config/nvim/ (Catppuccin theme)
├── ghostty/    → ~/.config/ghostty/
└── zed/        → ~/.config/zed/
```

Deployment uses file copying rather than symlinks, compatible with Omarchy's own config management approach.

### Keyboard-Driven Philosophy

```text
Super+T           → Launch Ghostty
Super+Shift+T     → Open Alacritty
```

The full workflow stays keyboard-first: Hyprland for window/workspace management, Neovim for editing, fzf and ranger for navigation.

### Theming Consistency

Catppuccin Mocha applied uniformly:

- **Neovim** — colorscheme via LazyVim plugin
- **Ghostty** — terminal colors
- **Zed** — editor theme

One aesthetic, everywhere.

## Challenges & Learnings

### Challenge: macOS → Linux Parity

The macOS setup uses GNU Stow for symlinks; Omarchy has its own dotfile management. Solution: copy-based deployment instead of symlinks, targeting the same standard config paths.

### Challenge: AUR Package Reliability

AUR packages can break between installs. Solution: `bwo-packages.txt` as a versioned package list — easy to audit, update, or selectively install.

### Challenge: Cross-Platform Workflow

Maintaining the same productive environment across macOS and Linux requires deliberate tool choices. Solution: prioritize tools available on both platforms (Neovim, Zed, Ghostty, Claude Code) and keep configs in sync across both repos.

## Results

A fresh Omarchy install becomes a fully personalized development environment with one command. The same tools, same themes, and same AI-enhanced workflow as the macOS setup.

**Base system**: Omarchy (Arch + Hyprland + Neovim)
**Extra packages**: 30+ CLI tools and applications
**Dotfiles deployed**: 5+ configurations
**Theme**: Catppuccin Mocha, consistent across all editors and terminal

## Project Links

- **GitHub Repository**: [BWO-Omarchy-AutoSetup](https://github.com/BenWaraiotoko/BWO_Omarchy_AutoSetup)
- **Related project**: [BWO-MacAutoSetup](https://github.com/BenWaraiotoko/BWO-MacAutoSetup)

## What This Project Demonstrates

This project shows the same **infrastructure as code** mindset as the macOS setup, extended to Linux:

- Cross-platform environment parity
- Treating configuration as code, version-controlled and reproducible
- Package management on Arch (pacman + AUR)
- Consistent developer experience across operating systems
- Automation over manual post-install tinkering

The ability to spin up the same productive environment on any machine — macOS or Linux — reflects the same thinking behind reproducible data pipelines.

---

*Built with Bash, pacman/yay, and Catppuccin Mocha. Runs on Arch Linux + Hyprland via Omarchy.*
