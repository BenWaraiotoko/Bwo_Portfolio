# Portfolio Usage Guide

Complete guide to using your Hugo Data Engineering Portfolio

---

## Table of Contents

1. [Creating New Content](#creating-new-content)
2. [Using Archetypes](#using-archetypes)
3. [Customizing Your Portfolio](#customizing-your-portfolio)
4. [Knowledge Graph](#knowledge-graph)
5. [Deployment](#deployment)
6. [Tips & Best Practices](#tips--best-practices)

---

## Creating New Content

### Blog Posts

Use the blog archetype for learning posts, tutorials, and insights:

```bash
hugo new posts/python-fundamentals.md
```

This creates a new post with the blog template structure including:
- Introduction section
- Key Learnings
- Code Examples
- Challenges Faced
- Resources
- Next Steps

### Project Showcases

Use the project archetype for portfolio projects:

```bash
hugo new projects/etl-pipeline.md
```

This creates a project showcase template with:
- Project Overview
- Features list
- Architecture diagram
- Implementation details
- Setup & usage instructions
- Future improvements

### Weekly Learning Logs

Use the learning-log archetype for weekly reviews:

```bash
hugo new learning-logs/week-2-dec-29-jan-4.md --kind learning-log
```

**Naming Convention:** `week-X-[start-date]-[end-date].md`

Example: `week-2-dec-29-jan-4.md`

This creates a comprehensive weekly log template with:
- Progress tracking (Codecademy, professional development)
- Projects worked on
- Blockers & solutions
- Metrics & analytics
- Goals for next week
- Reflection section

---

## Using Archetypes

### What Are Archetypes?

Archetypes are content templates that provide a consistent structure for your posts. They save time and ensure all your content follows the same format.

### Available Archetypes

1. **blog.md** - For learning posts and tutorials
2. **project.md** - For project showcases
3. **learning-log.md** - For weekly progress reviews

### How Hugo Uses Archetypes

When you run `hugo new posts/my-post.md`, Hugo:
1. Looks in `/archetypes/` for a matching archetype
2. Copies the template structure
3. Fills in front matter variables (title, date, etc.)
4. Creates the new file in `/content/posts/`

### Front Matter Variables

Front matter is the YAML configuration at the top of each Markdown file:

```yaml
---
title: "Post Title"
date: 2025-12-23
draft: true  # Set to false to publish
tags: ["python", "sql", "data-engineering"]
categories: ["Blog"]
description: "Brief description for SEO"
---
```

**Important:** Set `draft: false` when you're ready to publish!

---

## Customizing Your Portfolio

### Adding New Menu Items

Edit `/config.toml`:

```toml
[[menu.main]]
  identifier = "learning-logs"
  name = "Learning Logs"
  url = "/learning-logs/"
  weight = 4
  [menu.main.params]
    icon = "fa-solid fa-book"
```

### Changing Colors

Edit `/assets/css/kanagawa.css`:

```css
:root {
  --kanagawa-accent: #E46876;  /* Change accent color */
  --kanagawa-link: #7FB4CA;    /* Change link color */
}
```

### Updating About Page

Edit `/content/about.md` with your personal information, background, and skills.

---

## Knowledge Graph

### What Is It?

The interactive knowledge graph visualizes connections between your skills, technologies, and projects using D3.js.

### Configuration

Edit `/static/data/graph.json`:

```json
{
  "nodes": [
    {
      "id": "python",
      "label": "Python",
      "category": "language",
      "description": "Primary programming language for data engineering",
      "url": "/tags/python/"
    }
  ],
  "links": [
    {
      "source": "python",
      "target": "pandas"
    }
  ]
}
```

### Node Categories

- `central` - Your main profile node (pink)
- `language` - Programming languages (cyan)
- `tool` - Tools and frameworks (cyan)
- `database` - Database technologies (cyan)
- `skill` - Soft skills (cyan)
- `learning` - Currently learning (yellow)

### Adding the Graph to Pages

Use the shortcode in any page:

```markdown
{{< knowledge-graph >}}
```

### Mini Graph for Articles

For a smaller graph in blog posts:

```markdown
{{< article-graph >}}
```

---

## Deployment

### Cloudflare Pages (Automatic)

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add new blog post about Python fundamentals"
   git push origin main
   ```

2. **Cloudflare Pages automatically:**
   - Detects the push
   - Runs `hugo --minify`
   - Deploys to production
   - Updates in ~1-2 minutes

### Manual Build (Local Testing)

```bash
# Build for production
hugo --minify

# Output goes to /public/ directory
# Upload /public/ to any static hosting
```

### Testing Before Deploy

Always test locally before pushing:

```bash
# Start development server
hugo server -D

# Visit http://localhost:1313
# Check that everything looks correct
# Fix any issues
# Then commit and push
```

---

## Tips & Best Practices

### Content Creation Workflow

1. **Create draft:**
   ```bash
   hugo new posts/my-post.md
   ```

2. **Write content locally**
   - Use VS Code or your favorite editor
   - Keep Hugo server running for live preview
   - Check formatting and code highlighting

3. **Set `draft: false`** when ready to publish

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add post: Python Fundamentals"
   git push origin main
   ```

### Weekly Learning Log Routine

**Every Sunday evening:**

1. Create new weekly log:
   ```bash
   hugo new learning-logs/week-2-dec-29-jan-4.md --kind learning-log
   ```

2. Fill in the template:
   - Review your Codecademy progress
   - List projects worked on
   - Document challenges and solutions
   - Set goals for next week

3. Publish:
   ```bash
   git add content/learning-logs/
   git commit -m "Week 2 learning log"
   git push
   ```

### Blog Post Best Practices

- **Code Examples:** Always include working code examples
- **Screenshots:** Add visual examples when helpful
- **External Links:** Link to documentation and resources
- **Tags:** Use consistent tags for easy filtering
- **Categories:** Use categories to organize content types

### SEO Tips

- Write descriptive titles
- Use the `description` front matter for meta descriptions
- Include relevant keywords naturally
- Add alt text to images
- Use proper heading hierarchy (H2, H3, H4)

### Image Management

Save images in `/static/images/`:

```bash
/static/images/
├── projects/          # Project screenshots
├── blog/              # Blog post images
└── avatar.jpg         # Profile picture
```

Reference in Markdown:

```markdown
![ETL Pipeline Architecture](/images/projects/etl-architecture.png)
```

### Version Control Best Practices

- Commit frequently with meaningful messages
- Don't commit `public/` or `resources/` directories (already in `.gitignore`)
- Use branches for major changes
- Keep main branch production-ready

---

## Common Commands Reference

### Content Creation

```bash
# Blog post
hugo new posts/post-name.md

# Project showcase
hugo new projects/project-name.md

# Learning log
hugo new learning-logs/week-X-dates.md --kind learning-log
```

### Development

```bash
# Start server with drafts
hugo server -D

# Start server without drafts (production preview)
hugo server

# Build for production
hugo --minify

# Clean build cache
rm -rf public/ resources/
```

### Git Workflow

```bash
# Status
git status

# Stage changes
git add .

# Commit
git commit -m "Descriptive message"

# Push to GitHub (triggers Cloudflare deploy)
git push origin main

# View commit history
git log --oneline -10
```

### Troubleshooting

```bash
# Check Hugo version
hugo version

# Validate config
hugo config

# List all content
hugo list all

# Check for errors
hugo --debug
```

---

## Next Steps

Now that you have all the tools set up:

1. ✅ **Write your first blog post**
   - Choose a topic you've learned recently
   - Use the blog archetype
   - Include code examples

2. ✅ **Create your first project showcase**
   - Document the ETL pipeline project
   - Add architecture diagram
   - Include setup instructions

3. ✅ **Update your weekly learning log**
   - Fill in Week 1 with actual progress
   - Set specific goals for Week 2
   - Make it a Sunday evening routine

4. ✅ **Customize your About page**
   - Add your photo
   - Update your background story
   - Highlight your skills

5. ✅ **Push to GitHub**
   - Commit all your changes
   - Push to main branch
   - Watch it deploy to Cloudflare Pages

---

## Getting Help

- **Hugo Documentation:** https://gohugo.io/documentation/
- **LoveIt Theme Docs:** https://hugoloveit.com/
- **D3.js Documentation:** https://d3js.org/
- **Markdown Guide:** https://www.markdownguide.org/

---

**Happy building! 🚀**

*Remember: Building in public, learning in public, growing in public.*
