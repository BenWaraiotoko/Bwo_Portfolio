---
title: Vim Learning Guide
date: 2025-12-28
description: Complet guide to quickly learn Vim, Neovim and Lazyvim
tags:
  - vim
  - neovim
  - lazyvim
  - productivity
  - editor
category: second-brain
publish: true
---
# 🎓 Vim Learning Guide for Complete Beginners

This guide helps you progress from Vim beginner to LazyVim power user.

## 📍 Where You Are Now

You're a complete Vim beginner - that's perfect! This setup gives you both:
1. **Basic Vim** (`vim` command) - for learning fundamentals
2. **LazyVim** (`nvim` command) - for when you're ready for IDE features

## 🎯 The Learning Path

### Week 1-2: Master the Basics

**Step 1: Run vimtutor (30 minutes)**
```bash
vimtutor
```
This is Vim's built-in tutorial. It teaches you the essentials interactively.

**Step 2: Practice with Basic Vim**
```bash
vim ~/practice.txt
```

**Must-Learn Basics:**
- **Modes**: Normal (default), Insert (typing), Visual (selecting)
- **Movement**: `h` (left), `j` (down), `k` (up), `l` (right)
- **Enter Insert mode**: `i` (before cursor), `a` (after cursor), `o` (new line below)
- **Exit Insert mode**: `Esc`
- **Delete**: `x` (char), `dd` (line)
- **Copy/Paste**: `yy` (copy line), `p` (paste)
- **Save/Quit**: `:w` (save), `:q` (quit), `:wq` (save & quit), `:q!` (quit without saving)
- **Search**: `/searchterm` then `n` (next), `N` (previous)

**Daily Practice (15 minutes):**
- Day 1-3: Movement and modes
- Day 4-7: Editing commands (delete, copy, paste)
- Day 8-14: Search and file operations

### Week 3-4: Build Muscle Memory

**Step 3: Real Work with Basic Vim**
Start using `vim` for actual work:
```bash
vim README.md
vim script.sh
vim config.yaml
```

**New Commands to Learn:**
- `w` - move forward by word
- `b` - move backward by word
- `0` - start of line
- `$` - end of line
- `gg` - top of file
- `G` - bottom of file
- `u` - undo
- `Ctrl-r` - redo
- `v` - visual mode (select text)
- `d` + motion - delete (e.g., `dw` delete word, `d$` delete to end of line)
- `c` + motion - change (delete and enter insert mode)

**The Rule: No Arrow Keys!**
Force yourself to use `h`, `j`, `k`, `l`. Uncomfortable at first, but this is where the power comes from.

### Week 5+: Graduate to LazyVim

**Step 4: Launch Neovim with LazyVim**
```bash
nvim
```

On first launch:
- LazyVim will install plugins (1-2 minutes)
- Don't panic! This is automatic
- You'll see a welcome screen when done

**Step 5: Discover Features Gradually**
Press `Space` and wait - a help menu appears showing available commands!

**Start with These LazyVim Features:**

**File Navigation:**
- `Space ff` - Find files (fuzzy search)
- `Space fg` - Find text in files (grep)
- `Space e` - Toggle file explorer
- `Space fr` - Recent files

**Window Management:**
- `Ctrl-h/j/k/l` - Move between windows
- `Space w` - Window commands

**Git:**
- `Space gg` - Open LazyGit (amazing Git UI)
- `Space gb` - Git blame

**Code Intelligence:**
- `K` - Show documentation
- `gd` - Go to definition
- `Space ca` - Code actions

**Help System:**
- `Space ?` - Show all keybindings
- `Space sk` - Search keymaps
- `:h topic` - Help on any topic

## 🎯 Learning Philosophy

### The Right Way to Learn

1. **Start Slow**: Master basic movement first, then build up
2. **Muscle Memory Over Speed**: Accuracy matters more than speed initially
3. **One Command Per Day**: Learn one new command each day, use it deliberately
4. **No Plugins Until Basics**: Don't jump to LazyVim too early
5. **Embrace the Discomfort**: First 2 weeks are hard - push through!

### Common Beginner Mistakes to Avoid

❌ **Jumping to LazyVim too early** - You'll rely on mouse and IDE features instead of learning Vim
❌ **Using arrow keys** - Defeats the purpose of Vim's efficiency
❌ **Trying to learn everything at once** - Overwhelming and ineffective
❌ **Giving up in week 1** - Everyone struggles initially, stick with it!
❌ **Not using vimtutor** - Best 30 minutes you can invest

### When to Graduate to LazyVim

You're ready for LazyVim when you can:
- ✅ Navigate files without thinking about `h/j/k/l`
- ✅ Switch between modes naturally
- ✅ Delete, copy, paste without looking up commands
- ✅ Search and replace text
- ✅ Work for 30+ minutes without touching the mouse

Usually takes 2-3 weeks of daily practice.

## 🆘 When You Get Stuck

### Stuck in Vim and Can't Exit?
```
Press: Esc
Type: :q!
Press: Enter
```

### Accidentally Entered Command Mode?
```
Press: Esc a few times
```

### Made Changes You Don't Want?
```
Press: Esc
Type: :q!
Press: Enter
```

### Want to Save and Exit?
```
Press: Esc
Type: :wq
Press: Enter
```

## 📚 Resources

**Interactive:**
- `vimtutor` - Built-in tutorial (run in terminal)
- [Vim Adventures](https://vim-adventures.com/) - Learn Vim through a game

**Reading:**
- [OpenVim](https://www.openvim.com/) - Interactive Vim tutorial
- Practical Vim by Drew Neil - Excellent book (recommended after basics)

**LazyVim Specific:**
- [LazyVim Documentation](https://lazyvim.github.io/)
- [LazyVim Keymaps Reference](https://lazyvim.github.io/keymaps)

## 💡 Pro Tips

1. **Configure your terminal** to treat Alt/Option key correctly for Aerospace window management
2. **Keep basic Vim** for quick edits and server work (where LazyVim isn't available)
3. **Use which-key in LazyVim** - Press Space and wait to discover commands
4. **Learn one workflow at a time** - Master file navigation before diving into LSP features
5. **Customize gradually** - LazyVim works great out of the box, only customize when you know what you need

## 🎉 The Payoff

After 2-3 weeks:
- You'll edit text faster than with any GUI editor
- You'll work without touching the mouse
- You'll have a skill that works on every Unix system
- You'll understand why developers love Vim

**Stick with it! The initial learning curve is steep but absolutely worth it.**

---

Need help?
- In Vim: Type `:help`
- In LazyVim: Press `Space` and wait for which-key
- In this repo: Read `dotfiles/nvim/.config/nvim/README.md`
