---
title: "Immich vs PhotoPrism: Why I Picked the One That Broke on Me"
date: 2026-05-26
publish: true
category: posts
tags:
  - homelab
  - immich
  - photoprism
  - docker
  - self-hosted
  - photos
description: Two self-hosted photo managers. One broke during migration, the other was boring. Here's why I chose the broken one anyway.
---

You know what nobody tells you about self-hosting your photo library? The hardest part isn't setting up the software. It's migrating 5,700 photos without losing your mind.

I evaluated both Immich and PhotoPrism. I picked Immich. Not because it was easier — it absolutely wasn't. But because of what happened when things went wrong.

Let me explain.

## The Contenders

### PhotoPrism

- **Mature** — Started in 2018, stable, well-documented
- **Go backend** — Fast, low memory footprint
- **TensorFlow** — For face detection and image classification
- **Single binary** — Simple deployment
- **Conservative approach** — Fewer features, but what's there works

### Immich

- **Young** — Started in 2022, rapid development, breaking changes between versions
- **TypeScript + Flutter** — Modern stack, mobile-first design
- **Machine learning** — Smart search, face detection, object tagging
- **Microservices** — Multiple containers (server, microservices, ML, Postgres, Redis)
- **Move fast** — Frequent updates, features ship quickly, sometimes at the cost of stability

## The Comparison That Actually Matters

I could give you a feature matrix, but honestly? Most comparisons miss the point. Here's what I actually care about:

| Factor | PhotoPrism | Immich |
|--------|-----------|--------|
| Mobile app | Web-only (PWA) | Native iOS + Android |
| Upload experience | Manual or WebDAV | Background auto-upload |
| Search quality | Good (tags + location) | Great (semantic + CLIP embeddings) |
| Face detection | Yes | Yes, with grouping |
| Map view | Basic | Full timeline map |
| Shared albums | Limited | Full sharing with external users |
| Memory usage | ~500MB | ~2-4GB (ML is hungry) |
| Setup complexity | Easy | Moderate (5 containers) |
| Migration pain | Low | High (version changes) |
| Development pace | Slow and steady | Fast, sometimes breaking |

### The Deciding Factor: The Mobile App

This is the thing that tipped the scale for me. PhotoPrism has a PWA. It works. It's fine.

Immich has a native mobile app that auto-uploads photos in the background. Open the app, take a photo, it's on your server. No thinking required.

My partner needs to back up photos too. She's not going to open a PWA and manually upload files. She wants it to Just Work™. Immich does that.

PhotoPrism+ [Photoprism Mobile](https://github.com/photoprism/photoprism-mobile) exists, but it's third-party and unofficial. Immich's app is first-party and actively maintained.

## Why Immich Broke on Me (And Why That's Okay)

I already wrote about [the full migration disaster](/posts/fixing-immich-installation). Short version:

1. Lost my config files. Had to start fresh.
2. New install: connection refused (hostname mismatch)
3. Port changed from 3001 to 2283 between versions
4. Volume mount path changed from `/usr/src/app/upload` to `/data`
5. 5,700 photos to re-import, NFS timeouts, had to script folder-by-folder uploads

Total time to recover: about 6 hours. Not fun.

Here's the thing though: **every one of those issues was documented**. The changelog mentioned the port change. The docs explained the new volume paths. The CLI had a proper upload command. I just... didn't read them first.

With PhotoPrism, this probably wouldn't have happened — they rarely make breaking changes. But PhotoPrism also wouldn't have given me:
- Semantic search that finds "sunset at the beach" from CLIP embeddings
- Auto-uploading mobile app that my non-technical family uses
- Shared albums that actually work for external viewers
- A development team shipping new features every month

The breaks are the price of velocity. I accept that tradeoff.

## The PhotoPrism Advantage (And Why I Still Didn't Switch)

PhotoPrism is boring in the best way. It works. It's been working for years. The UI is clean and fast. Memory usage is minimal — you can run it on a Raspberry Pi if you want.

If your priorities are:

- **Stability over features** — PhotoPrism wins
- **Low resource usage** — PhotoPrism wins
- **Simple deployment** — PhotoPrism wins (single container vs 5)
- **"Set it and forget it"** — PhotoPrism wins

I almost switched after the migration disaster. But then I realized: I'd be trading occasional breaks for permanent feature gaps. PhotoPrism might never break, but it also might never get a native mobile app or semantic search.

## The Real Answer: It Depends On Who You Are

**Choose PhotoPrism if:**
- You want something that works and stays working
- You don't need a mobile app (or PWA is enough)
- Your server has limited RAM
- You value stability over new features
- You're running on a Raspberry Pi or VPS

**Choose Immich if:**
- You need a mobile app with auto-upload
- You want semantic/CLIP search
- You share photos with non-technical people
- You don't mind reading changelogs before upgrading
- You have 2-4GB RAM to spare
- You enjoy living on the edge a little

## My Setup (For Reference)

```
Machine: Intel NUC8i7BEH1 (ubu-immich)
RAM: 32GB (overkill, 16GB would be fine)
Storage: 500GB SSD for OS + 1TB for photos
Docker: 5 containers (server, microservices, ML, Postgres, Redis)
Photos: 5,742 files / 62GB
Backup: rsync to NAS nightly
```

```yaml
# docker-compose.yml (simplified)
name: immich
services:
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    command: ["start.sh", "immich"]
    volumes:
      - /srv/immich:/data
    ports:
      - 2283:2283  # NOT 3001. Learned this the hard way.
    env_file: .env
    restart: always

  immich_postgres:
    image: tensorchord/pgvecto-rs:pg14-v0.2.0
    volumes:
      - /srv/immich/postgres:/var/lib/postgresql/data
    restart: always

  immich_redis:
    image: redis:7.2
    restart: always
```

## Lessons From Running Both

1. **Read the changelog before upgrading** — This applies to any self-hosted software, but especially Immich.
2. **Test upgrades on a copy first** — I now have a test Immich instance on a throwaway Docker network.
3. **Back up before every update** — `sudo rsync -av /srv/immich/ /srv/immich-backup-$(date +%Y%m%d)/`
4. **Pin your image tags** — `:release` is convenient but risky. Consider pinning to a specific version.
5. **The best software is the one people actually use** — If my partner won't upload photos, the "better" software doesn't matter.

## The Verdict

I chose Immich because it fits *my* life. The mobile app means photos actually get backed up. The semantic search means I can find that one photo from 3 years ago. The sharing means my family sees albums without me manually sending files.

PhotoPrism is objectively more stable. But "stable and unused" is worse than "occasionally broken and indispensable."

Your mileage will vary. That's kind of the whole point of self-hosting — you pick what works for you, not what some blog post tells you to pick.

Even if that blog post is mine.

---

**Running one of these?** I'm genuinely curious about your experience — especially if you chose PhotoPrism and are happy with it. Drop me a comment.

Now if you'll excuse me, I need to check if there's a new Immich release. And read the changelog this time. 📸