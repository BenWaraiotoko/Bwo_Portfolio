# 🚀 Data Engineering Portfolio - Ben Warai Otoko

> **Broadcast Infrastructure Specialist Expanding into Data Engineering**
> Developing expertise in Python, SQL, and ETL pipelines to enhance data-driven workflows in broadcast technology.

[![Live Portfolio](https://img.shields.io/badge/Portfolio-Live-brightgreen?style=for-the-badge)](https://bwo-portfolio.pages.dev/)
[![Codecademy Progress](https://img.shields.io/badge/Codecademy-8%25-blue?style=for-the-badge)](https://www.codecademy.com/learn/paths/data-engineer)

---

## 👋 About Me

I'm **Benjamin**, a broadcast infrastructure specialist with 15+ years of experience in video production and broadcast technology. I'm expanding my skillset into **Data Engineering** to better leverage data-driven approaches in modern broadcast workflows.

**Current Focus:**
- 📚 Codecademy Data Engineer Career Path (15% complete)
- 🏗️ Building hands-on ETL projects for media data workflows
- 🐍 Deepening Python and SQL skills for broadcast automation
- 📊 Exploring data pipeline architectures for media infrastructure

**Goal:** Enhance my broadcast infrastructure expertise with modern data engineering capabilities to optimize media workflows and infrastructure management.

---

## 📂 Portfolio Structure

```
📁 Bwo_Portfolio/
├── 📝 Blog - Learning journey, tutorials, insights
├── 💼 Projects - ETL pipelines, data engineering showcases, and other projects
├── 📊 Learning Logs - Weekly progress tracking
├── 🌐 Knowledge Graph - Interactive tech stack visualization
└── 👤 About - Background, skills, timeline
```

**Live Site:** [bwo-portfolio.pages.dev](https://bwo-portfolio.pages.dev/)

---

## 🛠️ Built With

### Tech Stack

**Frontend:**
- [Hugo](https://gohugo.io/) - Static site generator (v0.139.0)
- [LoveIt Theme](https://github.com/dillonzq/LoveIt) - Customized with Kanagawa colors
- [D3.js](https://d3js.org/) - Interactive knowledge graph visualization

**Deployment:**
- [Cloudflare Pages](https://pages.cloudflare.com/) - Automatic deployment from `main` branch
- Custom domain with SSL

**Design:**
- Kanagawa color scheme (dark #1F1F28, coral pink #E46876, cyan #7FB4CA)
- System fonts for clean, modern typography
- Fully responsive design

---

## 📝 Recent Content

### Latest Blog Posts

*Coming soon! First post scheduled for next week.*

**Upcoming Topics:**
- Python Fundamentals for Broadcast Data Workflows
- ETL Pipelines for Media Asset Management
- Automating Broadcast Infrastructure with Data Engineering

### Learning Journey Highlights

- ✅ **Week 1 (Dec 22-28):** Launched portfolio, started Codecademy, completed Python basics
- 🚧 **Week 2 (Dec 29-Jan 4):** Python fundamentals module, ETL pipeline exploration

[📚 View All Learning Logs →](https://bwo-portfolio.pages.dev/learning-logs/)

---

## 📚 Learning Path

### Current Training

| Platform | Course | Progress | Focus Area |
| --- | --- | --- | --- |
| **Codecademy** | Data Engineer Career Path | 8% | Professional Development |
| **Self-Study** | ETL Pipeline Projects | Active | Hands-on Practice |
| **Documentation** | Media Workflow Automation | Ongoing | Technical Writing |

### Skills Developing

**Programming:**
- Python (pandas, NumPy, data manipulation)
- SQL (PostgreSQL, DuckDB, query optimization)
- Bash/Shell scripting

**Data Engineering:**
- ETL pipeline design & implementation
- Data transformation & quality checks
- Database design & management
- Docker containerization

**Tools & Technologies:**
- Git & GitHub version control
- VS Code development environment
- PostgreSQL & DuckDB databases
- Docker & Docker Compose

---

## 🎯 Projects

### Current Projects

#### 1. **Data Engineering Portfolio** (This Site!)
- Hugo static site with custom Kanagawa theme
- Interactive D3.js knowledge graph
- Automated deployment via Cloudflare Pages
- [View Live](https://bwo-portfolio.pages.dev/) | [Source Code](https://github.com/BenWaraiotoko/Bwo_Portfolio)

#### 2. **CSV to PostgreSQL ETL Pipeline** *(Coming Soon)*
- Extract data from CSV files
- Transform and clean data with Python/pandas
- Load into PostgreSQL database
- Docker-based development environment

### Planned Projects

- Media asset metadata ETL pipeline
- Broadcast workflow automation with Python
- Real-time monitoring dashboard for broadcast infrastructure
- Video encoding job queue optimization

---

## 🗓️ Learning Roadmap

### Professional Development Goals

**2024 Q4** ✅ Started Codecademy Data Engineer path
- Built portfolio website
- Setup development environment
- Completed Python fundamentals

**2025 Q1-Q3** 🚧 Expanding Data Engineering Skills
- Complete Codecademy course modules
- Build 3-5 production-ready ETL projects
- Document learnings through technical blog posts
- Apply skills to broadcast workflow optimization

**2025-2026** 🎯 Advanced Applications
- Implement data engineering solutions in broadcast infrastructure
- Build automated media workflow pipelines
- Contribute to broadcast technology modernization
- Share knowledge through technical writing

---

## 🔗 Connect With Me

[![Portfolio](https://img.shields.io/badge/Portfolio-bwo--portfolio.pages.dev-brightgreen?style=flat-square)](https://bwo-portfolio.pages.dev/)
[![GitHub](https://img.shields.io/badge/GitHub-BenWaraiotoko-181717?style=flat-square&logo=github)](https://github.com/BenWaraiotoko)
[![Email](https://img.shields.io/badge/Email-bwonews@proton.me-blue?style=flat-square&logo=protonmail)](mailto:bwonews@proton.me)

**Open to:**
- Collaboration on broadcast technology and data engineering projects
- Networking with media technology and data professionals
- Knowledge sharing about ETL pipelines and media workflows
- Study groups and technical discussions on Codecademy topics

---

## 📧 Contact

**Email:** bwonews@proton.me
**Languages:** French (native), English (fluent)

---

## 🚀 Quick Start

### Running This Portfolio Locally

```bash
# Clone the repository
git clone https://github.com/BenWaraiotoko/Bwo_Portfolio.git
cd Bwo_Portfolio

# Initialize theme submodule
git submodule update --init --recursive

# Start Hugo development server
hugo server -D

# Visit http://localhost:1313
```

### Creating New Content

```bash
# New blog post (uses blog archetype)
hugo new posts/my-new-post.md

# New project showcase (uses project archetype)
hugo new projects/my-project.md

# New learning log (uses learning-log archetype)
hugo new learning-logs/week-2-jan-5-11.md --kind learning-log
```

### Deployment

Push to `main` branch → Cloudflare Pages automatically builds and deploys.

---

## 🎨 Kanagawa Color Palette

| Color | Hex | Usage |
| --- | --- | --- |
| sumiInk | `#1F1F28` | Background (dark mode) |
| fujiWhite | `#DCD7BA` | Text (dark mode) |
| waveRed | `#E46876` | Accent color, titles |
| crystalBlue | `#7FB4CA` | Links |
| springGreen | `#98BB6C` | Code highlighting |
| carpYellow | `#E6C384` | Tags, graph edges |

---

## 📊 Interactive Knowledge Graph

The knowledge graph uses D3.js to visualize connections between skills, technologies, and projects.

**Configuration:** Edit `/static/data/graph.json`

**Usage in pages:**
```markdown
{{< knowledge-graph >}}
```

---

## 📁 Project Structure

```
Bwo_Portfolio/
├── archetypes/          # Content templates
│   ├── blog.md          # Blog post template
│   ├── project.md       # Project showcase template
│   └── learning-log.md  # Weekly log template
├── assets/css/          # Custom CSS (Kanagawa theme)
│   └── kanagawa.css     # Theme colors and styles
├── content/
│   ├── posts/           # Blog articles
│   ├── projects/        # Project showcases
│   ├── learning-logs/   # Weekly learning logs
│   ├── about.md         # About page
│   └── graph.md         # Knowledge graph page
├── layouts/
│   ├── partials/        # Theme overrides
│   └── shortcodes/      # Custom shortcodes
│       ├── knowledge-graph.html
│       └── article-graph.html
├── static/
│   ├── images/          # Images and assets
│   ├── js/              # JavaScript (D3.js graph)
│   │   └── knowledge-graph.js
│   └── data/            # JSON data
│       └── graph.json   # Graph data
├── config.toml          # Hugo configuration
└── deploy.sh            # Deployment script
```

---

## 📝 License

This portfolio is open source under the MIT License. Feel free to use this as inspiration for your own portfolio, but please don't copy content verbatim.

---

## 🙏 Acknowledgments

- **LoveIt Theme** by Dillon Zq - Beautiful Hugo theme foundation
- **Codecademy** - Structured learning path for Data Engineering
- **Kanagawa Color Scheme** - Beautiful terminal colors adapted for web
- **ssp.sh** by Simon Späti - Design inspiration
- **Broadcast Technology Community** - For continuous learning and knowledge sharing

---

**Last Updated:** December 23, 2025
**Version:** 1.0.0
**Status:** 🟢 Active Development

---

<div align="center">

### ⭐ If you found this portfolio helpful, please star the repo!

**Building in public. Learning in public. Growing in public.**

</div>
