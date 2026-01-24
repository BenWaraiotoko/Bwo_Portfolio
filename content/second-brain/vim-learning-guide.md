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
## Complete Guide: Learn Vim, Neovim, and LazyVim Quickly

**Total Duration:** 4‑6 weeks to reach solid productivity  
**Time Investment:** 30‑45 minutes per day

---

## 🎯 The Optimal 80/20 Strategy

Vim has a **J‑shaped learning curve**: painful for the first 2‑3 days, then exponential progress. The key is to understand that **Vim isn’t a collection of commands**; it’s a **composition language**.

### Core Concept: Vim Grammar

```
Vim operates with a simple grammar:
Operator + Motion [+ Text Object] = Action

Examples:
d     +  w                         = dw   (delete word)
d     +  $                         = d$   (delete to end of line)  
d     +  ip                        = dip  (delete inner paragraph)
c     +  i"                        = ci" (change inside quotes)
y     +  5j                        = y5j (yank 5 lines down)
```

**Multiplicative Effect:** Mastering 10 operators and 15 motions lets you perform **~300+ actions** with a single composition!

---

## 📅 6‑Week Plan

### **Weeks 1‑2: Fundamentals + Grammar (14 days)**

#### Days 1‑3: Interactive Learning  
**Goal:** Muscle‑memory for basic movements

1. **Run `vimtutor`** (the built‑in Vim tutorial)
   ```bash
   vimtutor
   ```
   - Complete at least 2 full runs
   - Duration: 30‑45 min per session
   - Focus: `hjkl` → insert mode → delete/change

2. **Play Vim Adventures** (`vim‑adventures.com`)  
   - Gamified learning of motions  
   - Free, ~1‑2 hrs for the basic levels  
   - Great for internalizing `hjkl`

3. **Daily practice:**  
   - Open a simple text file  
   - Practice only: `h`, `j`, `k`, `l`, `i`, `ESC`, `:w`, `:q`  
   - Ban the arrow keys

#### Days 4‑7: Vim Grammar (Operators + Motions)  
**Goal:** Grasp composability

1. **Learn the 3 main operators**  
   - `d` = delete  
   - `c` = change  
   - `y` = yank

2. **Learn ~10 essential motions**  
   ```
   Character‑level: h, l, f, t, %, ^, $, 0
   Word‑level:      w, b, e
   Line‑level:      j, k, gg, G
   Paragraph:       {, }
   ```

3. **Composition practice (30 min/day):**
   ```vim
   dw       " delete word
   cw       " change word
   yw       " yank word
   d$       " delete to end of line
   c^       " change to start of line (first non‑blank)
   y5j      " yank 5 lines down
   ```

#### Days 8‑14: Text Objects (The Power Multiplier)  
**Goal:** Master semantic selection

Text objects = operators applied to **semantic units** instead of motions

```vim
Syntax: operator + a/i + object
        (a = around, i = inner)

Examples:
iw       " inner word (no spaces)
aw       " around word (includes spaces)
ip       " inner paragraph
ap       " around paragraph  
i"       " inside quotes
a"       " around quotes (includes quotes)
i{       " inside braces
a{       " around braces
it       " inside tags (HTML/XML)
```

**Daily practice (45 min):**
```vim
dip      " delete inner paragraph
ciw      " change inner word
ya"      " yank around quotes
di{      " delete inside braces
ci(      " change inside parentheses
```

---

### **Weeks 3‑4: Plugins + Habit Breaking**

#### Install the 3 Learning Plugins

These plugins are **essential** for rapid learning. Add them temporarily, then disable once you’ve built good habits.

1. **hardtime.nvim** – Breaks bad habits  
   - Disables arrow keys and mouse  
   - Forces use of `hjkl` and composed motions  
   - Gives suggestions for inefficient actions  
   *Example:* Pressing `jjj` instead of `5j` triggers:  
   ```
   ❌ Use count or Ctrl+D instead!
   ```

2. **precognition.nvim** – Visualises where your motions will land  
   - Shows real‑time hints  
   - Example: cursor position and where keys will move you

3. **vim‑be‑good** – Gamified practice  
   - Games like “delete this word in 3 keys or less”  
   - Scoring and progression  
   - Very addictive and effective

#### Quick Plugin Installation

You’ll install them with LazyVim in Phase 4, but for now:

If you have vanilla Vim/Neovim, first install a plugin manager (vim‑plug or packer.nvim). For this phase you can also simply **ignore plugins** and practice intensively with standalone vim‑be‑good and web‑based vim‑adventures.

---

### **Weeks 5‑6: LazyVim Setup + Daily Practice**

#### Day 1: Install Neovim and LazyVim

**Prerequisites:**
```bash
# Check Neovim version
nvim --version   # Must be >= 0.11.2

# On Linux (apt, brew, etc.)
sudo apt install neovim     # Ubuntu/Debian
brew install neovim          # macOS  
pacman -S neovim             # Arch
```

**LazyVim Installation (3 steps):**
```bash
# 1. Backup your config (if you have one)
rm -rf ~/.config/nvim
rm -rf ~/.local/share/nvim

# 2. Clone the LazyVim starter config
git clone https://github.com/LazyVim/starter ~/.config/nvim

# 3. Launch Neovim
nvim

# 4. Let lazy.nvim install all plugins (~1‑2 min)
#    Quit with :q

# 5. Check health
nvim
:checkhealth
```

**Result:** Neovim with:
- 40+ pre‑configured plugins  
- LSP for code completion  
- Advanced syntax highlighting  
- Fuzzy finder (Telescope)  
- Git integration  
- File explorer  
- Elegant status bar  

#### Days 2‑3: Basic Configuration

LazyVim stores its config in Lua files:

```
~/.config/nvim/
├── init.lua              # Main entry point
├── lua/
│   ├── config/
│   │   ├── autocmds.lua  # Autocommands
│   │   ├── keymaps.lua   # Your keybindings
│   │   ├── lazy.lua      # lazy.nvim config
│   │   └── options.lua   # Vim/Neovim options
│   └── plugins/
│       ├── spec1.lua     # Your custom plugins
│       └── spec2.lua
```

**Minimal customisation (5 min to start):**

Edit `~/.config/nvim/lua/config/options.lua`:
```lua
-- Your preferences
vim.opt.number = true              -- Line numbers
vim.opt.relativenumber = true       -- Relative numbers (important for Vim!)
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true            -- Tabs = spaces
```

Edit `~/.config/nvim/lua/config/keymaps.lua` to add your personal shortcuts.

#### Days 4‑6: Learning Plugins in LazyVim

Create `~/.config/nvim/lua/plugins/learning.lua`:

```lua
return {
  -- hardtime.nvim – Break bad habits
  {
    "m4xshen/hardtime.nvim",
    dependencies = { "MunifTanjim/nui.nvim", "nvim‑lua/plenary.nvim" },
    opts = {
      disabled_keys = {
        ["<Up>"] = {},
        ["<Down>"] = {},
        ["<Left>"] = {},
        ["<Right>"] = {},
      },
    },
    event = "VeryLazy",
  },

  -- precognition.nvim – Visualise motions
  {
    "tris203/precognition.nvim",
    event = "VeryLazy",
    opts = {},
  },

  -- vim‑be‑good – Learning games
  {
    "ThePrimeagen/vim‑be‑good",
    event = "VeryLazy",
  },
}
```

Save, launch Neovim. Lazy.nvim will install automatically.

#### Weeks 5‑6: Daily Practice + Real‑World Use

**Essential LazyVim commands:**
```vim
<leader>ff   " Find files (Telescope)
<leader>fg   " Find grep (Telescope)  
<leader>fb   " Find buffers
<leader>/    " Search in buffer
<leader>n    " Toggle file explorer
<leader>e    " File explorer at root
```

**Daily workflow:**

1. **Use Vim for ALL your work:**  
   - Editing configs (YAML, JSON, etc.)  
   - Scripting (Python, Bash)  
   - Documentation  
   - Code review

2. **Apply the “no arrow keys” rule:**  
   - You’ll be slow at first (normal!)  
   - 2× faster after 2 weeks  
   - 5× faster after 1 month

3. **Learn one new command per day:**  
   - Day 1 after fundamentals: `/` (search)  
   - Day 2: `n`, `N` (next/prev search)  
   - Day 3: `:%s/old/new/g` (search/replace)  
   - Day 4: macros (if you’re bored)  
   - …

4. **Track progress:**  
   ```vim
   :Hardtime report    " See your worst habits
   :VimBeGood          " Play the games
   ```

---

## 🔥 Learning Accelerators Tailored to Your Profile

You already have:
- Advanced terminal expertise (`systemctl`, `parted`, `lsblk`, etc.)  
- Bash scripting skills  
- Experience with complex config files (Proxmox, VMware)

**How to leverage that:**

1. **Learn Lua alongside:**  
   - Lua is Neovim’s config language  
   - You only need basics (loops, tables, functions)  
   - Quickly become productive in LazyVim

2. **Configure LazyVim for your infra workflow:**  
   - Add snippets for YAML/JSON  
   - Set up LSP for Terraform/Python  
   - Create custom keymaps for recurring tasks

3. **Automate with macros:**  
   - Vim macros are like Bash scripts  
   - Syntax: `qa…q` to record, `@a` to play  
   - Great for bulk transformations

---

## ✅ Learning Checklist

- [ ] Days 1‑2: Complete `vimtutor` twice  
- [ ] Day 3: Play 1‑2 hrs on vim‑adventures  
- [ ] Days 4‑7: Master operators + motions  
- [ ] Days 8‑14: Master text objects  
- [ ] Days 15‑20: Practice with hardtime.nvim  
- [ ] Day 21: Install LazyVim  
- [ ] Days 22‑28: Configure LazyVim + learning plugins  
- [ ] Days 29‑42: Use Vim daily + vim‑be‑good  

---

## 🎓 Recommended Resources

**YouTube (2025):**  
- “How I Would Learn VIM Motions in 2025” (smnatale)  
- “Every Vim Essential Command You Need”  
- “Ultimate Neovim Setup 2: Installing LazyVim from Scratch”

**Docs:**  
- lazyvim.github.io – Official docs  
- `:h usr_01` – Built‑in help (excellent!)

**Games/Tools:**  
- vim‑adventures.com – Free  
- vim‑be‑good – Integrated games  
- vimgenius.com – Flashcards  

---

## 🚀 Tips to Stay Motivated

1. **The first 3 days are the worst.** You’ll feel frustrated – that’s normal.  
2. **Days 4‑5:** You’ll start enjoying the logic.  
3. **Week 2:** You’ll be faster than before on certain tasks.  
4. **Months 2‑3:** You’ll never want to leave Vim.  

**Secret:** Use Vim for **everything**, even if you’re slow. Real‑world practice is 100× better than tutorials.

---

## 🎯 Immediate Next Step

**From today, do this:**

```bash
# 1. Run vimtutor
vimtutor

# 2. Practice 30 min following its instructions
# 3. Go to vim‑adventures.com tomorrow
# 4. Dedicate 45 min per day for the next 2 weeks
```

You’ll be productive in Vim in 2 weeks, an expert in 2‑3 months.

Good luck! 🚀

---

## Related

- [[cli‑tricks]]
- [[git]]
- [[git‑cheatsheet]]
- [[10‑Python‑for‑Data‑Engineering]]
