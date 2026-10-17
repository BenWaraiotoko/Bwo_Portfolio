---
title: "No Thanks, Omarchy — Why I Switched Distros Over Values"
date: 2026-10-17
publish: true
category: posts
tags: [linux, arch, omarchy, ryoku, values, dotfiles, opensource]
description: I read Korben's post, then I read the source. Here's why my Arch layer moved homes — and why leaving was the cheapest infrastructure decision I made all year.
---

So here's the thing — until last week, my Linux desktop was Omarchy.

And honestly? It's a good distro. Arch underneath, Hyprland on top, install in under two minutes, keyboard-first everything. On pure engineering, I had zero complaints. My post-install script on top of it gave me the exact same environment I run on macOS. Muscle memory intact, workflow intact.

Then I read a post by [Korben](https://korben.info/en/omarchy-no-thanks.html) — the French tech blog I've been reading for twenty years — titled, pointedly, ["Omarchy, no thanks"](https://korben.info/en/omarchy-no-thanks.html).

## What the post said

Korben wasn't reviewing the distro. He was saying he could no longer, in good conscience, use or promote a piece of software — because of what its creator, DHH, had been publishing on his own blog for over a year. Not code reviews. Essays about immigration in Europe. The kind of stuff [you can read verbatim in the post](https://korben.info/en/omarchy-no-thanks.html) — "demographic replacement", IQ-based sorting of human beings, deportation as public-space hygiene. Written not in some dark corner, but on the platform DHH owns, under his full name.

Korben's framing stuck with me: this isn't politics. Xenophobia isn't a political position you can agree to disagree with — it's the thing our grandparents built democracies specifically to survive.

I want to be precise here, because the internet loves flattening nuance: **I did not leave because Korben told me to.** I left because his post was a pointer, not an argument I outsourced. I followed the links. I read the actual essays. And I sat with the fact that I was typing my daily work into a desktop assembled by someone who writes, publicly and repeatedly, that people like my neighbors shouldn't be here.

## The reasoning, in one paragraph

Here's the thing about free software: the code isn't poisoned by its author. Omarchy is Arch with a pile of well-organized dotfiles; nothing in my Hyprland config carries an opinion. I could have stayed, forked, silenced the feed. But every day I kept that install, every time I recommended it, every GitHub star, every screenshot with the default wallpaper — that was me voting for a thing whose most visible author had made himself loud on exactly the values I refuse to host. The software is free. So is my attention, and I'd rather spend both somewhere I respect. Tools are never just tools; their defaults are endorsements in disguise.

## Why leaving was nearly free

This is the part that made me smile, in a wry sort of way.

Months ago, I built a post-install layer on top of Omarchy — my packages, my dotfiles, my AI stack, all declarative, all re-runnable. The philosophy: **the repo is the machine**. One `install.sh`, one commented package list.

So when the values problem appeared, the engineering question turned out to be trivial: *how much of my setup is actually mine, and how much is just... his defaults with my wallpaper?* I cloned my old repo, recomputed the delta against a different base, and one evening later the new layer was done.

Leaving a distro should feel like a divorce. Instead it felt like moving apartments where all the furniture is already labeled and boxed.

## The new home: Ryoku

I moved to [**Ryoku**](https://ryoku.dev) — an indie Arch desktop by a solo dev (Carlos, a.k.a. neur0map). No VC raise, no media tour, no essays about anyone's demographics. Just a distro that happens to be quietly excellent:

- A compositor shell (Quickshell) that runs as a single Go daemon instead of the usual pile of polling scripts
- Hyprland and niri, switchable live, without a reinstall
- Theming via matugen — your entire desktop recolors itself from your wallpaper
- Signed packages, and Btrfs snapshots around every pacman — `ryoku update` snapshots before it touches anything, `ryoku rollback` when something goes sideways
- A settings hub with ~200 toggles, because not everything in life needs to be a config file

Different values in the creator's public output, solid values in the engineering. That's the whole requirement.

## The delta, recomputed

The fun engineering bit: Ryoku ships ~90 packages by default. My old layer was built for a thin base; this one needed to answer a different question — *what does the base lack?* Most of my old list turned out to be redundant: bat, eza, fzf, ripgrep, neovim, lazygit, kitty — already in. What survived was the genuinely personal layer: Docker, Ansible, 1Password, Obsidian, git-delta, the AI stack, my 56 VS Code extensions.

Same philosophy as the macOS twin: install what's missing, comment every line, keep the list honest by subtracting as deliberately as you add.

The result is [BWO-Ryoku-AutoSetup](https://github.com/BenWaraiotoko/BWO-Ryoku-AutoSetup), and the project page is [here](/projects/ryoku-auto-setup). Fresh install day is scheduled for the 1.0 release ("Amaterasu", Oct 26) — a rule I keep about not installing betas nine days before their stable cut.

## The takeaway

Two things, one philosophical, one practical:

1. **Your infrastructure choices are votes.** The FOSS cop-out — "the code is apolitical" — is true about the code and false about the ecosystem: attention, stars, recommendations and defaults are all currency, and you're spending them on someone every single day. Spend deliberately.

2. **Keep your exit cost low.** I didn't build declarative, reproducible setup scripts because I planned to leave a distro over ethics. I built them because reinstalling a desktop by hand is miserable. But this week, that discipline paid out double: the same automation that saves me an afternoon on a fresh install saved my *conscience* an afternoon too. When your personal layer is declarative, your base system becomes disposable — and a disposable base is a base that can never hold your values hostage.

To Korben: thanks for the pointer. This article is me doing my own reading after it.

Anyway. Back to my terminal — it looks exactly the same as last week. That's rather the point.

---

*If you're mid-migration yourself, the repo is [BWO-Ryoku-AutoSetup](https://github.com/BenWaraiotoko/BWO-Ryoku-AutoSetup) — delta-only packages, commented line by line. Steal the pattern, not just the packages.*