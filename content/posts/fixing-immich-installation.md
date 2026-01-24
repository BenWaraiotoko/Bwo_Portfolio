---
title: "Migrating 5,700 Photos to Immich (and Fixing Every Possible Issue)"
date: 2025-12-30
tags: ["docker", "self-hosted", "immich", "linux", "homelab"]
publish: true
description: "Connection refused, wrong ports, lost configs, and 62GB of photos to migrate. Here's what actually worked."
aliases:
  - /posts/fixing-immich-installation
---

## The Problem

I had Immich running on my home server. Then I lost the configuration files. But I still had 5,700+ photos sitting on a NAS somewhere, and I needed them back in a working Immich installation.

Also, the new Immich v2.4.1 setup wouldn't connect. Connection refused. Great start.

## Fixing Connection Issues

### Issue #1: Missing Hostname Variables

After running `docker compose up`, the web interface wouldn't load. Checking logs revealed:

```bash
docker compose logs immich-server
# Error: getaddrinfo EAI_AGAIN database
```

The containers were looking for a host called `database`, but my PostgreSQL container was named `immich_postgres`.

**Fix:** Added these to `.env`:

```bash
DB_HOSTNAME=immich_postgres
REDIS_HOSTNAME=immich_redis
```

### Issue #2: Wrong Port Mapping

Still getting connection resets. Turns out I was using the old v1.x port configuration.

**My broken config:**
```yaml
ports:
  - 2283:3001  # WRONG
```

**What actually works in v2.4+:**
```yaml
ports:
  - 2283:2283  # CORRECT
```

Immich v2.4+ changed the internal port from 3001 to 2283. If you're migrating from an older version, this will break things.

### Issue #3: Outdated Volume Paths

Another v2.4+ breaking change:

**Before:**
```yaml
volumes:
  - /srv/immich:/usr/src/app/upload
```

**After:**
```yaml
volumes:
  - /srv/immich:/data
```

New versions use `/data` as the base path. Update your docker-compose.yml or nothing will work.

## Working Configuration

Here's the final setup that actually works:

### docker-compose.yml

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

### .env

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

## Migrating the Photo Library

Now comes the fun part - migrating 62GB of photos from the old installation.

### Step 1: Mount the Old NFS Share

My old photos were on a Synology NAS. First, check what's available:

```bash
showmount -e 10.10.37.10
```

Then mount it:

```bash
sudo mkdir -p /mnt/old-immich
sudo mount -t nfs4 NAS-IP:/volume1/FOLDER /mnt/old-immich
```

### Step 2: Count What You're Dealing With

```bash
find /mnt/old-immich/IMMICH/library -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.heic" -o -iname "*.mp4" -o -iname "*.mov" \) | wc -l
# Result: 5,742 files

du -sh /mnt/old-immich/IMMICH/library
# Result: 62GB
```

**Breakdown:**
- JPG/JPEG: 2,658
- HEIC: 1,476
- MOV: 1,186
- MP4: 405
- PNG: 15

### Step 3: Don't Just Copy Files (I Tried, It Didn't Work)

My first attempt was copying photos directly to `/srv/immich/library`:

```bash
sudo rsync -avh --progress /mnt/old-immich/IMMICH/library/ /srv/immich/library/
```

**Problem:** Immich won't automatically scan these files. The `/data/library` folder is only for External Libraries, which have their own configuration system.

You need to use the **Immich CLI** for proper importing.

### Step 4: Using Immich CLI

The CLI handles everything properly:
- Hashes files to detect duplicates
- Creates database entries
- Generates thumbnails
- Extracts EXIF metadata

#### Get an API Key

1. Open http://127.0.0.1:2283
2. Go to **Account Settings** → **API Keys**
3. Click **"New API Key"**
4. Copy the key

#### Authenticate

```bash
docker exec immich_server immich login-key http://localhost:2283 YOUR_API_KEY
```

#### The Upload Problem

Tried uploading all 5,742 files at once:

```bash
docker exec immich_server immich upload --recursive /data/library/admin
```

It hung on "Crawling for assets..." when scanning 5,700+ files over NFS.

**Solution:** Upload folder by folder instead.

Testing a single folder worked fine:

```bash
docker exec immich_server immich upload --recursive /data/library/admin/2024/2024-09-25
# Successfully uploaded 9 new assets (92.1 MB)
```

### Step 5: Bulk Upload Script

Created a script to upload all 532 folders sequentially:

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

Run it:

```bash
chmod +x /tmp/immich-bulk-upload.sh
nohup /tmp/immich-bulk-upload.sh > /tmp/immich-upload.log 2>&1 &
```

Monitor progress:

```bash
tail -f /tmp/immich-upload-progress.log
```

**Time estimate:** About 1.5-2 hours for 532 folders.

## Cleanup After Migration

Once everything's uploaded and verified:

```bash
# Remove temporary copy (recovers 62GB)
sudo rm -rf /srv/immich/library/admin/

# Unmount NFS share
sudo umount /mnt/old-immich
sudo rmdir /mnt/old-immich
```

**Disk space recovered:** ~124GB (original + temporary copy removed)

## What I Learned

1. **Check documentation for version changes** - Port mappings and paths change between versions. Don't assume your old config will work.

2. **Environment variables matter** - Missing `DB_HOSTNAME` and `REDIS_HOSTNAME` will break everything if your container names aren't the defaults.

3. **Use the CLI for bulk imports** - Direct file copying doesn't work. The CLI handles hashing, metadata extraction, and database entries properly.

4. **Batch large uploads** - Uploading 5,700+ files at once times out. Process folder by folder instead.

5. **Always verify before deleting** - Check that your photos are actually in Immich before removing originals.

## Quick Reference Commands

```bash
# Check container status
docker compose ps

# View logs
docker compose logs immich-server --tail 50

# Test API
curl http://127.0.0.1:2283/api/server/ping
# Expected: {"res":"pong"}

# Check version
curl http://127.0.0.1:2283/api/server/version
# Expected: {"major":2,"minor":4,"patch":1}

# Monitor upload progress
tail -f /tmp/immich-upload-progress.log

# Check disk usage
df -h /srv/immich
```

## Useful Resources

- [Immich Official Documentation](https://docs.immich.app/)
- [Docker Compose Guide](https://docs.immich.app/install/docker-compose)
- [Environment Variables](https://docs.immich.app/install/environment-variables/)
- [CLI Documentation](https://docs.immich.app/features/command-line-interface/)

---

**Bottom line:** Immich is solid once you get past the version migration quirks. Breaking down the upload into smaller chunks made all the difference. If you're migrating a large library, don't try to do it all at once.

**Published:** December 30, 2025
**Immich Version:** v2.4.1
**Platform:** Docker Compose on Ubuntu Server
