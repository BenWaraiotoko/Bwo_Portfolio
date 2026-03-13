---
title: "Omarchy Auto Setup"
date: 2026-03-08
publish: true
description: Same productive environment on Linux as on macOS. Because good tooling shouldn't be platform-exclusive.
tags: [automation, linux, arch, dotfiles, shell, infrastructure, devtools]
category: project
---

[Omarchy](https://omarchy.org) gives you a great starting point: Arch Linux, Hyprland, Neovim, the full keyboard-driven setup. But a fresh install still needs your personal tooling, your configs, your themes before it actually feels like *your* machine.

Doing that manually every time is exactly as tedious as it sounds.

This project automates it.

## What It Does

A post-install script that runs on top of a working Omarchy installation. One command, and you get:

- 30+ extra CLI tools installed via pacman and AUR
- Personal dotfiles deployed across all editors and the terminal
- Catppuccin Mocha theme applied consistently everywhere
- The same AI-enhanced workflow I run on macOS

It's the Linux counterpart to [BWO-MacAutoSetup](https://github.com/BenWaraiotoko/BWO-MacAutoSetup) — same philosophy, adapted for Arch.

## Quick Start

```bash
git clone https://github.com/BenWaraiotoko/BWO-Omarchy-AutoSetup.git ~/Projects/BWO-Omarchy-AutoSetup
cd ~/Projects/BWO-Omarchy-AutoSetup
./install.sh
```

## The Stack

| Tool | Role |
|------|------|
| Arch Linux + Hyprland | Base OS with tiling compositor |
| pacman + yay (AUR) | Package management |
| Neovim + LazyVim | IDE with Catppuccin Mocha |
| Zed | Fast editor, cross-platform consistent |
| Ghostty | GPU-accelerated terminal |
| AWS CLI v2 / kubectl / Tailscale | Cloud and DevOps tooling |

## The Architecture

```text
Omarchy Base (Arch + Hyprland + Neovim)
          ↓
    install.sh
          ↓
  pacman/AUR (yay) → bwo-packages.txt → CLI tools & apps
          ↓
   dotfiles/ → copy-based deployment → ~/.config/*
          ↓
  Ghostty + Zed + Neovim → Catppuccin Mocha
```

### Why Copy Instead of Symlinks?

The macOS setup uses GNU Stow for symlinks. Omarchy has its own dotfile management approach, so this script uses direct file copying instead — targeting the same standard config paths without conflicting with anything Omarchy manages.

## Dotfile Structure

```text
dotfiles/
├── bash/       → ~/.bashrc.d/ (aliases, exports)
├── vim/        → ~/.vimrc
├── nvim/       → ~/.config/nvim/ (Catppuccin theme)
├── ghostty/    → ~/.config/ghostty/
└── zed/        → ~/.config/zed/
```

## Catppuccin Mocha, Everywhere

One aesthetic decision applied consistently:

- **Neovim** — colorscheme via LazyVim plugin
- **Ghostty** — terminal colors
- **Zed** — editor theme

It's a small thing, but visual consistency across tools matters more than it should for focus and flow.

Side note: the whole setup is built around staying on the keyboard. Hyprland, Neovim, fzf, vi mode everywhere. The philosophy is solid. My Neovim skills, on the other hand, are still very much a work in progress. I'm learning. Slowly. I can do the basics without Googling, which I'm choosing to count as a win.

## The Interesting Problems

### Additive, Not Destructive

Unlike the macOS setup that bootstraps from zero, this script assumes Omarchy is already installed. It extends the base system — adds tools, deploys configs, applies themes. It doesn't touch what Omarchy set up. If you run it on a machine with existing configs, it overwrites only the files it manages.

### AUR Reliability

AUR packages occasionally break between installs. The solution is `bwo-packages.txt` — a versioned, human-readable list of every package. Easy to audit, easy to update, easy to selectively comment out if something breaks.

### Cross-Platform Parity

Maintaining the same productive environment on macOS and Linux requires deliberate tool choices. Neovim, Zed, Ghostty, and Claude Code all run on both platforms. The configs live in separate repos but stay in sync. Same muscle memory, same workflow, regardless of which machine I'm on.

## Numbers

- **Base system**: Omarchy (Arch + Hyprland + Neovim)
- **Extra packages**: 30+ CLI tools and applications
- **Dotfiles deployed**: 5+ configurations
- **Theme**: Catppuccin Mocha, applied across all editors and terminal

## Project

**GitHub**: [BWO-Omarchy-AutoSetup](https://github.com/BenWaraiotoko/BWO_Omarchy_AutoSetup)

**Related**: [BWO-MacAutoSetup](https://github.com/BenWaraiotoko/BWO-MacAutoSetup)

## Why This Matters

Same thing as the macOS setup, but the cross-platform angle adds something: the ability to spin up the same environment on any machine — different OS, different hardware — and have it just work.

That's reproducibility. That's the same thinking behind good data pipelines: define the desired state, automate the path to it, make it repeatable anywhere.

The domain is developer environments. The principle transfers everywhere.

---

*Built with Bash, pacman/yay, and Catppuccin Mocha. Runs on Arch Linux + Hyprland via Omarchy.*
