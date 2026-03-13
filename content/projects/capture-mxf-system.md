---
title: "Broadcast SDI Capture System"
date: 2025-12-24
publish: true
description: Real-time SDI video capture to MXF OP1a on Apple Silicon — because editors shouldn't wait for transcoding.
tags: [video, broadcast, ffmpeg, automation, infrastructure, macos]
category: project
---

If you've worked in broadcast, you know the drill: capture card in the rack, video coming in, and someone needs to edit it *right now*. Not after a 45-minute transcode. Now.

Standard tools either don't support the right codecs, produce formats that break in professional editors, or require post-processing that kills the workflow. So I built my own.

## What It Does

A custom FFmpeg-based capture system for Apple Silicon Macs that:

- Captures 1080i50 SDI video in real-time from Blackmagic devices
- Encodes directly to DNxHD 120 Mb/s (broadcast-grade compression)
- Outputs MXF OP1a containers (what editors actually want)
- Writes partial indexes during capture so editors can start working within 30 seconds
- Handles embedded timecode and PCM audio properly

The pipeline in one line:

```text
SDI Source → Blackmagic UltraStudio → FFmpeg (arm64 + DeckLink) → DNxHD 120 → MXF OP1a → SSD
```

54GB per hour. Zero dropped frames. Editors happy.

## The Stack

| Component | Why |
|-----------|-----|
| FFmpeg 7.1 | Custom build with DeckLink SDK — no off-the-shelf binary has this |
| Blackmagic DeckLink SDK | SDI device integration and timecode extraction |
| DNxHD codec | 120 Mb/s, professional compression, Avid's standard |
| MXF OP1a | Industry-standard broadcast container |
| Shell scripting | Automation, validation, launcher |

## The Hard Parts

### Apple Silicon + DeckLink

Standard FFmpeg builds don't include DeckLink support for arm64. There's no pre-built binary for this. The solution is compiling FFmpeg from source with architecture-specific flags and the DeckLink SDK linked in.

It's the kind of thing you do once, document carefully, and never want to do again.

### Live Editing During Capture

MXF files normally need a complete index before any NLE can open them. That means you wait for the capture to finish before editing starts.

The fix: FFmpeg's `-write_index` flag writes partial index metadata during capture. Editors can open the file 30 seconds after you hit record, while it's still being written to disk.

This matters a lot in live broadcast environments where turnaround time is measured in minutes.

### Broadcast Format Compliance

Wrong codec + wrong container = file that opens in one tool and silently breaks in another. MXF OP1a with DNxHD needs specific muxing parameters and correct field ordering for interlaced video (top field first for 1080i50).

I validated against Adobe Premiere Pro, Avid Media Composer, and DaVinci Resolve before calling it production-ready.

## Performance Numbers

- **Storage throughput**: 54GB/hour (15MB/s sustained write)
- **Capture latency**: <100ms from SDI input to file write
- **Edit-ready**: 30 seconds from capture start
- **Reliability**: Zero dropped frames across 8-hour continuous captures
- **Compatibility**: Premiere Pro, Avid, DaVinci Resolve

## Real-World Use

This runs in production, handling live broadcast archival and multi-camera ingest. The automated launcher wraps it in a macOS application bundle — one click for operators who don't want to touch a terminal.

## Project

**GitHub**: [capture-mxf-system](https://github.com/BenWaraiotoko/capture-mxf-system)

Full setup guide, validation scripts, and troubleshooting docs included.

## Why This Matters for Data Engineering

This is the project that made me realize broadcast infrastructure and data engineering are solving the same problems.

Building a reliable video pipeline requires the same thinking as building a data pipeline:

- Understanding data flow architecture end-to-end
- Optimizing for throughput and latency under real constraints
- Ensuring format compatibility across downstream systems
- Building validation to catch failures before humans notice
- Automating everything that can be automated

The difference is scale and tooling. Data engineering operates at larger scales with more interesting abstractions. But the fundamentals — **move data reliably, handle failures gracefully, automate the boring parts** — are identical.

---

*Built with FFmpeg, Blackmagic SDK, and a lot of shell scripting. Runs on Apple Silicon (M1–M4).*
