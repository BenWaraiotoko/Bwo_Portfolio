---
title: MinIO Nuked Its Docker Images — Here's What I Replaced Mine With
date: 2026-10-18
publish: true
category: posts
tags:
  - minio
  - s3
  - docker
  - backup
  - selfhosting
description: My backup stack died on a single docker pull. The fix is a community fork called Silo — plus five traps I hit on the way.
---

So here's the thing — my off-site backup stack died on a single `docker pull`.

Not a config error. Not a hardware failure. The image just... stopped existing.

```text
Error response from daemon: pull access denied for minio/minio,
repository does not exist or may require 'docker login': denied
```

If you've seen this error recently: no, you're not crazy. Your compose file was fine yesterday. Here's what happened, and what I ended up running instead.

## MinIO left the building

MinIO archived its open-source community edition and pulled its images from Docker Hub. The `minio/minio` and `minio/mc` repositories are simply gone. No deprecation notice in your feed, no email — just a wall of `pull access denied` for anyone rebuilding a stack that worked fine for years.

And it's not just homelab people. GitHub issues popped up the same day from CI pipelines, dev environments, anything that trusted a tag that had quietly become a 404.

## The dead ends first

Being thorough (stubborn?), I checked every escape route before picking one.

**Route 1 — the frozen images on quay.io.** The last releases still pull from Quay. But they're frozen forever: the final tag carries an unpatched CVE (CVSS 8.1) that will never be fixed, because the project that would fix it is archived. Running an orphaned, known-vulnerable S3 server as a *backup target* felt like installing a fire door made of matches. Pass.

**Route 2 — the "console" fork.** Search results will tempt you with maintained forks of the MinIO *console*. Read carefully: that's just the web UI. A console without a server is a steering wheel without a car. Pass.

## The fix: Silo

The winner is [pgsty/silo](https://github.com/pgsty/silo) — a community-maintained fork of the actual MinIO server, kept alive by the Pigsty folks with builds, security fixes, and the full web console. Multi-arch, on Docker Hub, actively maintained.

Best part: it's a drop-in. Same environment variables, same ports, same command line. If you had a working MinIO compose file, you change the image line and redeploy:

```yaml
services:
  minio:
    image: docker.io/pgsty/silo:latest   # was: minio/minio:latest
    network_mode: host
    environment:
      - MINIO_ROOT_USER=backup-admin
      - 'MINIO_ROOT_PASSWORD=change-me-long-password'
    volumes:
      - /mnt/pool/apps/silo/data:/data
    command: server /data --console-address ":9001"
    restart: unless-stopped
```

API on `:9000`, console on `:9001`, your existing keys and buckets ride over. Health check it the old way:

```bash
curl -s -o /dev/null -w '%{http_code}' http://10.99.99.10:9000/minio/health/live
# 200
```

## Five traps I hit that you'll hit too

Since you're probably wiring this up as a backup target like me, save yourself an evening — these are all real, all from this week:

**1. The "Create Access Key" button lies.** The web console generates and *displays* a key pair before you click Create/Save. Copy it and navigate away, and the key never existed server-side. Your client then fails auth with the world's least helpful error. Create the key from the CLI instead, where "created" means created:

```bash
mcli alias set srv http://10.99.99.10:9000 backup-admin 'change-me-long-password'
mcli admin user add srv backup-client 'a-long-random-secret'
mcli admin policy attach srv readwrite --user backup-client
```

**2. `mcli alias set` proves nothing.** It's a local config write — the server is never contacted. Always validate with `mcli ls srv`. If it lists your buckets, the credentials are real. If you want the full truth, replicate your backup client's exact call with a signed request:

```bash
curl -s --aws-sigv4 'aws:amz:us-east-1:s3' \
  --user 'backup-client:a-long-random-secret' \
  http://10.99.99.10:9000/
```

XML bucket list back = server, network, credentials, and signature all proven in one shot. When a GUI somewhere swears "no response from the destination server", this command is your lie detector.

**3. With an IP address, Path-Style or nothing.** S3 clients offer two request styles. Virtual Hosted-Style rewrites your endpoint into `bucketname.10.99.99.10` — a hostname that resolves nowhere on Earth. If your S3 target is an IP (and for self-hosting, it usually is), set Request Style to **Path-Style**. This one checkbox is the difference between "works" and an error message that blames your network.

**4. Generic errors usually mean specific auth failures.** "No response from destination server" was, in my case, four different problems over two days: an access key that didn't exist, a key ID pasted where the label belonged, the wrong request style, and a client that simply refuses to negotiate. The server's answer is always in the XML — never in the popup.

**5. The label is not the key.** When you name a key "backup-client" in the console, that's a display label. What authenticates is the generated key ID — or, if you create users via CLI like above, the username itself. Label in the app, ID in the config. Never the other way around.

## The takeaway

The self-hosting deal has always been: you own your stack, including its breakage. When a vendor torches their community edition overnight, the community answers — Silo is living proof. But this week taught me the second half of that lesson: when the GUI lies to you, verify with the CLI; when the popup blames the network, interrogate the server directly.

One `docker pull`, five traps, one working off-site backup.

Pretty neat, right?

Now if you'll excuse me — I have a first full backup seed to babysit.