---
title: "Why I'm Learning Data Engineering (Hint: I Already Was)"
date: 2025-12-23
publish: true
description: Turns out broadcast infrastructure is just ETL with a better wardrobe.
tags: [data-engineering, broadcast, learning]
image: /images/posts/data-engineer-journey.webp
aliases:
  - /posts/why-data-engineer
category: posts
---

So here's the thing — I've been doing data engineering for years. I just didn't know it had a name.

Broadcast infrastructure. Video streams, metadata pipelines, transcoding workflows, monitoring systems. Move files, transform them, load them somewhere. Repeat until something breaks at 2am.

That's ETL. Just with video instead of CSV files.

## The Penny Drop

One day I was debugging a transcoding pipeline — files coming in from one format, getting processed, landing in an archive — and it hit me: this is just a data pipeline. A janky, broadcast-specific one, but a pipeline nonetheless.

The difference? Data engineers have *proper tools* for this. Tools that are documented, maintained, and designed by people who've thought hard about scale, reliability, and automation.

Meanwhile I was cobbling together shell scripts and hoping they'd still work after a software update.

## What Broadcast Already Taught Me

The problems aren't that different:

- Moving 100GB video files reliably? Same as moving 100GB database dumps — checksum verification, retry logic, monitoring.
- Processing thousands of files without touching them manually? Same as processing thousands of database rows — orchestration, error handling, idempotency.
- Knowing when your pipeline breaks *before* someone calls you? Monitoring. Same everywhere.

The skills transfer. The tools are just... nicer on the data side.

## Why Now

Broadcast tech moves slow. Painfully slow. You're often stuck with tools from 2015 because "that's what the broadcast standard requires."

Data engineering tools are modern, open source, actively maintained, and designed for automation. Why hand-roll a file watcher in bash when Airflow exists? Why parse logs manually when I could actually query them?

I like finding better ways to do things. Python and SQL are objectively better tools for most of what I do. Might as well learn them properly.

## The Reality Check

Learning while working full-time isn't glamorous. I'm not doing 8-hour study sessions. I'm doing 2-hour blocks in the evenings, sometimes less.

But here's the upside: everything I learn is immediately useful. A Python script to parse log files? Already helps at work. Understanding ETL patterns? Makes existing broadcast workflows click in a new way.

It's not a leap into the unknown. It's building a bridge from where I already am.

## What This Blog Actually Is

Documentation of learning Python, SQL, and data engineering through the lens of someone who already deals with data pipelines — just the video kind.

Not a motivation blog. Not career advice. Just notes on what I'm figuring out, what broke, and how it connects to real work.

---

*If you're in broadcast tech wondering if data engineering skills translate — yes. Very yes.*
