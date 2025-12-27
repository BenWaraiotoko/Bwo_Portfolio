---
title: "Why I'm Learning Data Engineering"
date: 2025-12-23
draft: false
description: "Broadcast infrastructure is basically ETL. Might as well learn the proper tools."
tags: ["data-engineering", "broadcast", "learning"]
categories: ["blog"]
---

## The Realization

I've been doing broadcast infrastructure for years. Managing video streams, metadata pipelines, transcoding workflows, monitoring systems. Turns out, that's all just ETL with different names.

So why not learn how actual data engineers solve these problems?

## What I'm Actually Doing

**Not:** Changing careers
**Yes:** Learning better tools for stuff I already do

Broadcast infrastructure already involves:
- Moving large amounts of data reliably (video files aren't small)
- Transforming data (transcoding, metadata extraction)
- Loading it somewhere useful (archives, CDNs, databases)
- Monitoring everything so you know when it breaks

That's literally Extract-Transform-Load. Just with video instead of CSV files.

## Why This Makes Sense

### I Already Automate Stuff

I've been writing bash scripts and FFmpeg commands for years. Python is just better bash. SQL is just better grep. Might as well level up.

### The Problems Are Similar

How do you move 100GB video files reliably? Same way you move 100GB of database dumps - checksum verification, retry logic, monitoring.

How do you process thousands of files without manual intervention? Same way you process thousands of database rows - automation, orchestration, error handling.

### The Tools Are Better

Broadcast tech moves slow. Data engineering tools are modern, well-documented, and designed for automation. Why write custom bash scripts when I can use pandas?

## The Reality

Learning while working full-time isn't easy. I can't spend 8 hours a day on Codecademy. But I can do 2-hour blocks in the evenings. Small progress beats no progress.

Plus, everything I learn is immediately useful. Python script to parse log files? Helps at work right now. Understanding ETL patterns? Makes broadcast workflows make more sense.

## What This Blog Is

Documentation of learning Python, SQL, and data engineering concepts through the lens of someone who already deals with data pipelines - just the video kind.

Not a motivational journey blog. Not career advice. Just notes on what I'm learning and how it applies to actual work.

---

*If you're doing broadcast tech and wondering if data engineering skills are useful - yes. Very yes.*
