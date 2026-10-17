---
title: Ryoku Auto Setup
date: 2026-10-17
publish: true
category: project
tags:
  - automation
  - linux
  - arch
  - ryoku
  - dotfiles
  - shell
  - infrastructure
  - devtools
description: One script on top of Ryoku — the Arch desktop that fits your values. Same philosophy as the Mac setup, recomputed delta, coffee included.
---

# Ryoku Auto Setup

So here's the thing — I left Omarchy. Not for technical reasons; the distro works. I left because of what its creator spends their time writing. The tool was good, the discourse wasn't, and no amount of convenient defaults justifies endorsing that.

So I needed a new Linux home for my setup. Enter [**Ryoku**](https://ryoku.dev) — a hand-built Arch desktop by one indie dev (Carlos/neur0map): a complete Hyprland ⇄ niri shell that runs as a single Go daemon, theming that recolors your entire desktop from your wallpaper, and Hyprland/niri switching without a reinstall. One indie dev, zero discourse, just a distro that's quietly excellent.

And since a fresh install means "wait, which packages did I need again?" — I transposed my setup.

## What It Does

One script on top of a working Ryoku install. You keep Ryoku's base (it already ships ~90 packages: fish, kitty, bat/eza/fzf/ripgrep, neovim, lazygit, yazi, chromium, firefox, zen-browser, go, nodejs, python, mise, ffmpeg, snapper snapshots around every pacman — the works). This adds the delta: what the base lacks, nothing it has.

- ~35 extra packages (docker, lazydocker, kubectl, ansible, hugo, tmux, git-delta, lazysql, glow, csvlens, 1Password, Obsidian, Zed, VS Code, VLC, Discord, Notion, drawio, Proton VPN, ollama, opencode, SuperClaude…)
- Claude Code + 10 npm globals (gemini-cli + MCP servers: playwright, brave-search, filesystem, github, notion)
- 56 VS Code extensions, extracted from the Mac Brewfile
- Fish aliases & exports (Ryoku's default shell — `ls` → `eza`, `cat` → `bat`, git/docker/pacman shortcuts)
- Neovim plugins, Zed config, minimal vim config, Obsidian vault settings
- SuperClaude framework (30+ slash commands for Claude Code)

## Quick Start

```bash
git clone https://github.com/BenWaraiotoko/BWO-Ryoku-AutoSetup.git ~/Projects/BWO-Ryoku-AutoSetup
cd ~/Projects/BWO-Ryoku-AutoSetup
./install.sh
```

Idempotent — re-run it after the 1.0 "Amaterasu" release (Oct 26), it skips everything already in place.

## The Architecture

```text
Ryoku Base (Arch + Hyprland/niri + ~90 packages)
          ↓
    install.sh
          ↓
  yay (pacman + AUR) → bwo-packages.txt → the delta, ~35 pkgs, each commented
          ↓
   npm → claude-code + MCP servers      VS Code → 56 extensions
          ↓
   dotfiles/ → conf.d + editors → ~/.config/*
```

## The Stack

| Tool | Role |
|------|------|
| Ryoku (Arch + Hyprland/niri) | Base OS with a compositor shell that fits |
| pacman + yay (AUR) | Package management, delta-only installs |
| fish (Ryoku default) | Shell with conf.d drop-in aliases |
| Neovim + LazyVim | IDE, keyboard-first (Ryoku ships it, I add plugins) |
| Zed | Fast editor, cross-platform consistent |
| kitty | The terminal (Ryoku ships it — no binding hacks needed here) |
| Docker + Kubernetes | Dev infra tooling |

## The Interesting Problems

### The Delta, Not the Kitchen Sink

The Omarchy version installed ~30 packages on a bare base. The Ryoku version installs ~35 on a **90-package base** — the math changes completely. Most of my old `bwo-packages.txt` is now redundant (Ryoku ships bat, eza, fzf, ripgrep, neovim, the modern CLI layer natively). The new list contains only what the base lacks. Every line is commented with what it's for and why.

### macOS-Only Tools, Honest Goodbye

The Mac Brewfile carries tools with no Linux equivalent (Raycast, Rectangle, mas, OrbStack). `bwo-packages.txt` documents them as deliberately **not** ported. Linux runs real Docker — no virtualization layer needed.

### fish Instead of bash

Ryoku's default shell is fish. The aliases moved from `bwo-aliases.bash` to `bwo-aliases.fish` (`command -v` → `type -q`, `&&` → `;and` inside conditions). Small port, one evening.

### Idempotent by Design

Same rule as both previous setups: the script re-runs safely (`yay -S --needed`, file-exists checks). A setup script you fear re-running is a script you won't run.

## The Family

- **[BWO-MacAutoSetup](https://github.com/BenWaraiotoko/BWO-MacAutoSetup)** — the macOS twin (one curl-pipe, V2 in Oct 2026)
- **This repo** — the Linux/Ryoku twin
- **BWO_Omarchy_AutoSetup** — the predecessor (now private, kept for reference)

## Why This Matters

Three repos now tell the same philosophy story: define the desired state in a declarative file, automate the path to it, keep it idempotent, recompute the delta when the base changes. The distro is a detail; the discipline is the project.

The Omarchy→Ryoku move also proves the setup script earns its keep: I switched distros **for values, not for tools**, and the personal layer ported over in an evening. That's what good abstraction buys you — the philosophy survives the platform.

---

*Built with bash, pacman/yay, and a preference for distros whose creators don't make the news for the wrong reasons. Runs on Arch, via Ryoku.*