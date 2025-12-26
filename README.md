# 📺 Ben's Portfolio

> **Broadcast infrastructure tech learning data engineering to automate more stuff**

[![Live Site](https://img.shields.io/badge/Portfolio-Live-brightgreen?style=for-the-badge)](https://bwo-portfolio.pages.dev/)
[![Codecademy](https://img.shields.io/badge/Codecademy-16%25-blue?style=for-the-badge)](https://www.codecademy.com/learn/paths/data-engineer)

---

## What This Is

Portfolio site documenting my journey learning Python, SQL, and data engineering practices to level up my broadcast infrastructure work.

Built with Hugo, styled with Kanagawa colors, deployed on Cloudflare Pages.

**Currently doing:**
- Learning Python and SQL (Codecademy Data Engineer path)
- Building small automation projects
- Writing about what I learn
- Trying not to break production systems while learning 😅

**Why:** Broadcast infrastructure is already ETL in disguise. Might as well learn the proper tools.

---

## What's Inside

**Blog:** Technical posts about Python, OOP, data stuff
**Learning Logs:** Monthly progress updates (the short version)
**Projects:** Things I build while learning
**About:** Who I am and why I'm doing this

**Live:** [bwo-portfolio.pages.dev](https://bwo-portfolio.pages.dev/)

---

## Tech Stack

- Hugo static site generator
- LoveIt theme (heavily customized)
- D3.js for the knowledge graph
- Kanagawa color scheme (dark bg, pink/cyan accents)
- Deployed on Cloudflare Pages (auto-deploy from main branch)

---

## Recent Posts

- [Learning Python OOP Through Baking 🍰](/posts/python-oop-bakery-analogy/) - Classes are cookie cutters, objects are cookies
- [Codecademy: Abruptly Goblins Planner](/learning-logs/codecademy-abruptly-goblins-planner/) - Python dictionaries and scheduling
- [Month 1 Learning Log](/learning-logs/week-1-public/) - First month progress

---

## What I'm Learning

**Currently:**
- Python fundamentals (variables, functions, OOP)
- SQL basics
- Git version control
- Data pipelines (cleaning, wrangling)

**Already know:**
- VMware/vSphere infrastructure
- Docker, Linux, networking
- Broadcast systems and FFmpeg
- Keeping things running at 3am

---

## Projects

**This Portfolio Site**
- Hugo + D3.js knowledge graph
- Kanagawa color scheme
- Auto-deploys from main branch
- [Live](https://bwo-portfolio.pages.dev/)

**Coming Soon:**
- CSV to PostgreSQL ETL pipeline
- Broadcast workflow automation scripts
- Whatever seems useful to build next

---

## The Plan

**Now:** Codecademy Data Engineer path (16% done)
**2026:** Le Wagon bootcamp for hands-on practice
**Beyond:** Apply this stuff to actual broadcast infrastructure work

---

## Get in Touch

- **GitHub:** [BenWaraiotoko](https://github.com/BenWaraiotoko)
- **Email:** bwonews@proton.me
- **LinkedIn:** [Ben Waraiotoko](https://www.linkedin.com/in/benjamin-nardini-b60b9439a/)

Always happy to chat about broadcast tech, data engineering, or Python.

---

## Running Locally

```bash
# Clone and setup
git clone https://github.com/BenWaraiotoko/Bwo_Portfolio.git
cd Bwo_Portfolio
git submodule update --init --recursive

# Start dev server
hugo server -D

# Visit http://localhost:1313
```

## Creating Content

```bash
# New blog post
hugo new posts/my-post.md

# New learning log
hugo new learning-logs/month-2.md

# New project
hugo new projects/my-project.md
```

**Deploy:** Push to main → Cloudflare builds automatically

---

## Project Structure

```
Bwo_Portfolio/
├── content/
│   ├── posts/           # Blog posts
│   ├── learning-logs/   # Monthly logs
│   ├── projects/        # Project showcases
│   └── about.md         # About page
├── static/
│   ├── js/knowledge-graph.js    # D3.js graph
│   └── data/graph.json          # Graph data
├── assets/css/kanagawa.css      # Custom theme
└── config.toml                  # Hugo config
```

---

## Credits

- **LoveIt Theme** - Hugo theme base
- **Kanagawa** - Color scheme
- **ssp.sh** - Design inspiration
- **Codecademy** - Learning path

---

**License:** MIT (use as inspiration, don't copy verbatim)

---

*Last updated: Dec 2025 | Status: Active*
