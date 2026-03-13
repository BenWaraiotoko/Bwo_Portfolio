---
title: "Migrating 5,700 Photos to Immich (And Fixing Every Possible Issue)"
date: 2025-12-30
publish: true
description: Connection refused, wrong ports, lost configs, and 62GB of photos to migrate. Here's what actually worked.
tags: [docker, self-hosted, immich, linux, homelab]
category: posts
---

I had Immich running. Then I lost the config files. The photos were still there — 5,700 of them, 62GB, sitting on a NAS — but the setup was gone.

New Immich install: connection refused. Classic.

Here's everything I broke and how I fixed it.

## The Connection Refused Rabbit Hole

### Problem 1: Missing Hostname Variables

`docker compose up` ran fine. The web interface didn't load. Logs said:

```bash
docker compose logs immich-server
# Error: getaddrinfo EAI_AGAIN database
```

The containers were looking for a host called `database`. My PostgreSQL container was named `immich_postgres`.

**Fix:** Two lines in `.env`:

```bash
DB_HOSTNAME=immich_postgres
REDIS_HOSTNAME=immich_redis
```

### Problem 2: Wrong Port (v1.x Habits Die Hard)

Still getting connection resets. Turns out I was using the old port config:

```yaml
ports:
  - 2283:3001  # Outdated. Will break silently.
```

Immich v2.4+ changed the internal port from 3001 to 2283:

```yaml
ports:
  - 2283:2283  # This is what you want.
```

If you're coming from an older install, this one will absolutely catch you.

### Problem 3: Volume Paths Changed Too

Same version, same surprise:

```yaml
# Before
volumes:
  - /srv/immich:/usr/src/app/upload

# After (v2.4+)
volumes:
  - /srv/immich:/data
```

The cool part is that once you've fixed all three of these, everything works. The frustrating part is finding all three.

## The Working Config

Here's the full `docker-compose.yml` that actually runs:

```yaml
name: immich
services:
  immich-server:
    container_name: immich_server
    image: ghcr.io/immich-app/immich-server:release
    command: ["start.sh", "immich"]
    volumes:
      - /srv/immich:/data
      - /etc/localtime:/etc/localtime:ro
    env_file:
      - .env
    depends_on:
      - immich_redis
      - immich_postgres
    ports:
      - 2283:2283
    restart: always
    networks:
      - immich_network

  immich-microservices:
    container_name: immich_microservices
    image: ghcr.io/immich-app/immich-server:release
    command: ["start.sh", "microservices"]
    volumes:
      - /srv/immich:/data:ro
      - /etc/localtime:/etc/localtime:ro
    env_file:
      - .env
    depends_on:
      - immich_redis
      - immich_postgres
    restart: always
    networks:
      - immich_network

  immich-machine-learning:
    container_name: immich_machine_learning
    image: ghcr.io/immich-app/immich-machine-learning:release
    volumes:
      - /srv/immich/ml-cache:/cache
    env_file:
      - .env
    restart: always
    networks:
      - immich_network

  immich_postgres:
    container_name: immich_postgres
    image: tensorchord/pgvecto-rs:pg14-v0.2.0
    environment:
      POSTGRES_PASSWORD: YourSecurePassword
      POSTGRES_USER: postgres
      POSTGRES_DB: immich
    volumes:
      - /srv/immich/postgres:/var/lib/postgresql/data
    restart: always
    networks:
      - immich_network

  immich_redis:
    container_name: immich_redis
    image: redis:7.2
    restart: always
    networks:
      - immich_network

networks:
  immich_network:
    driver: bridge
```

And the `.env`:

```bash
UPLOAD_LOCATION=/usr/src/app/upload
DB_HOSTNAME=immich_postgres
DB_PASSWORD=YourSecurePassword
DB_USERNAME=postgres
DB_DATABASE_NAME=immich
REDIS_HOSTNAME=immich_redis
POSTGRES_PASSWORD=YourSecurePassword
POSTGRES_DB=immich
POSTGRES_USER=postgres
TZ=Europe/Paris
IMMICH_VERSION=release
```

## Now For the Fun Part: 62GB of Photos

Immich is running. Time to get 5,742 photos back into it.

### Step 1: Mount the NAS

Photos were on a Synology NAS over NFS:

```bash
showmount -e NAS-IP

sudo mkdir -p /mnt/old-immich
sudo mount -t nfs4 NAS-IP:/volume1/FOLDER /mnt/old-immich
```

### Step 2: Know What You're Dealing With

```bash
find /mnt/old-immich/IMMICH/library -type f \
  \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \
     -o -iname "*.heic" -o -iname "*.mp4" -o -iname "*.mov" \) | wc -l
# 5,742 files

du -sh /mnt/old-immich/IMMICH/library
# 62GB
```

**Breakdown:** 2,658 JPG, 1,476 HEIC, 1,186 MOV, 405 MP4, 15 PNG.

### Step 3: Don't Just Copy Files (I Did, It Doesn't Work)

First instinct: `rsync` everything into `/srv/immich/library`. Reasonable, right?

```bash
sudo rsync -avh --progress /mnt/old-immich/IMMICH/library/ /srv/immich/library/
```

Problem: Immich ignores files dropped directly into the library folder. It only manages content it imported itself. The `/data/library` path is for External Libraries — a different thing entirely.

You need the **Immich CLI**.

### Step 4: Use the CLI Properly

The CLI handles everything the right way: hashes files, creates database entries, generates thumbnails, extracts EXIF.

**Get an API key:** Open `http://127.0.0.1:2283` → Account Settings → API Keys → New API Key.

**Authenticate:**

```bash
docker exec immich_server immich login-key http://localhost:2283 YOUR_API_KEY
```

**The problem with uploading 5,700+ files at once:** it hung on "Crawling for assets..." over NFS and never moved.

**The fix:** upload folder by folder.

Testing a single folder:

```bash
docker exec immich_server immich upload --recursive /data/library/admin/2024/2024-09-25
# Successfully uploaded 9 new assets (92.1 MB)
```

That worked fine.

### Step 5: Script the Bulk Upload

532 folders to process. Time for a loop:

```bash
#!/bin/bash

LOG_FILE="/tmp/immich-upload-progress.log"

echo "=== Starting Immich Upload ===" | tee -a "$LOG_FILE"
echo "$(date): Starting" | tee -a "$LOG_FILE"

docker exec immich_server find /data/library/admin -type d -mindepth 2 -maxdepth 2 | while read -r folder; do
    echo "$(date): Uploading $folder" | tee -a "$LOG_FILE"
    docker exec immich_server immich upload --recursive "$folder" 2>&1 | tee -a "$LOG_FILE"

    if [ $? -eq 0 ]; then
        echo "$(date): ✅ Success for $folder" | tee -a "$LOG_FILE"
    else
        echo "$(date): ❌ Failed for $folder" | tee -a "$LOG_FILE"
    fi
done

echo "$(date): Upload completed!" | tee -a "$LOG_FILE"
```

Run it in the background and watch the log:

```bash
chmod +x /tmp/immich-bulk-upload.sh
nohup /tmp/immich-bulk-upload.sh > /tmp/immich-upload.log 2>&1 &

tail -f /tmp/immich-upload-progress.log
```

About 1.5-2 hours for 532 folders. Go touch grass.

## Cleanup

Once you've verified everything landed correctly:

```bash
sudo rm -rf /srv/immich/library/admin/   # Recovers 62GB
sudo umount /mnt/old-immich
sudo rmdir /mnt/old-immich
```

Total recovered: ~124GB (original + the temporary copy).

## Quick Reference

```bash
# Container status
docker compose ps

# Server logs
docker compose logs immich-server --tail 50

# Test API
curl http://127.0.0.1:2283/api/server/ping
# Expected: {"res":"pong"}

# Check version
curl http://127.0.0.1:2283/api/server/version

# Monitor upload
tail -f /tmp/immich-upload-progress.log

# Disk usage
df -h /srv/immich
```

## What I Learned

1. **Check the changelog when upgrading** — ports and paths changed between v1.x and v2.4. Old configs will break quietly.
2. **Environment variables matter** — Missing `DB_HOSTNAME` is an easy one to miss, a painful one to debug.
3. **Use the CLI for imports** — Don't drop files directly. The CLI handles metadata, hashing, and deduplication properly.
4. **Batch large uploads** — 5,700 files over NFS at once will time out. Folder by folder is the move.
5. **Verify before deleting** — Obvious in hindsight, painful if skipped.

## Resources

- [Immich Documentation](https://docs.immich.app/)
- [Docker Compose Guide](https://docs.immich.app/install/docker-compose)
- [CLI Documentation](https://docs.immich.app/features/command-line-interface/)

---

Immich is solid once you get past the version migration landmines. The folder-by-folder upload approach is what made the difference. If you're migrating a large library, don't try to do it all at once.

**Immich Version:** v2.4.1 — **Platform:** Docker Compose on Ubuntu Server
