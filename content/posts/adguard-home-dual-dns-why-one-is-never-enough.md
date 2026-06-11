---
title: "AdGuard Home Dual DNS: Why One Is Never Enough"
date: 2026-05-26
publish: true
category: posts
tags: [homelab, dns, adguard, networking, self-hosted]
description: "When your DNS goes down, everything goes down. Here's how I run two AdGuard Home instances in sync — and the pitfalls that almost drove me to /etc/hosts."
---

Here's a fun fact about DNS: when it stops working, you don't get a nice error message. You get the internet looking at you like you're not connected, except you are. Everything's fine except nothing works.

I learned this the hard way when my single AdGuard Home instance decided to take a nap during a firmware update. Every device in my house. Dead. Simultaneously.

My partner was not amused.

So I built a dual DNS setup. Two AdGuard Home instances, synchronized, with automatic failover. And it only took me three attempts to get the sync working.

Let me save you the first two attempts.

## Why AdGuard Home (Not Pi-hole)?

I've used both. Here's the short version:

| Feature | Pi-hole | AdGuard Home |
|---------|---------|--------------|
| DNS-over-HTTPS upstream | Manual config | Built-in, one click |
| DNS-over-QUIC | No | Yes |
| DNSSEC validation | No (validates upstream) | Yes (validates + verifies) |
| Per-client settings | Limited | Full (client IDs, rules) |
| Encrypted DNS for clients | No | DoH/DoT/DoQ for clients |
| Web UI | Functional | Cleaner, more modern |
| API | Partial | Full REST API |
| Written in | Bash + PHP | Go (single binary) |

AdGuard Home is a single Go binary. No PHP, no lighttpd, no dependencies. That alone is worth the switch for a homelab — fewer moving parts means fewer things to break.

## The Architecture

```
                ┌─────────────────────┐
                │   Router / DHCP     │
                │   DNS 1: 192.168.1.10:3000  │
                │   DNS 2: 192.168.1.11:3001  │
                └──────────┬──────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
    ┌─────────▼─────────┐    ┌──────────▼────────┐
    │   PRIMARY          │    │   SECONDARY        │
    │   ubu-serv-2       │    │   ubu-serv-3       │
    │   192.168.1.10:3000 │    │   192.168.1.11:3001 │
    │                    │    │                     │
    │   Sync: push ──────┼───►│   Sync: receive     │
    └────────────────────┘    └─────────────────────┘
              │                         │
              └─────────┬───────────────┘
                        │
              ┌─────────▼─────────┐
              │   Upstream DNS     │
              │   Cloudflare DoH   │
              │   Google DoH       │
              │   Quad9 DoH        │
              └───────────────────┘
```

Primary on `ubu-serv-2` (HP Pro Mini 400), secondary on `ubu-serv-3` (Dell OptiPlex 7020). Both on different physical machines. If one server dies, the other keeps resolving.

## The Setup

### Primary Instance (ubu-serv-2)

```bash
# Install AdGuard Home
curl -s -S -L https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v

# Or via Docker
docker run -d \
  --name adguard-primary \
  -p 3000:3000/tcp \
  -p 3000:3000/udp \
  -p 443:443/tcp \
  -v /opt/adguardhome/work:/opt/adguardhome/work \
  -v /opt/adguardhome/conf:/opt/adguardhome/conf \
  --restart always \
  adguard/adguardhome
```

### Secondary Instance (ubu-serv-3)

Same thing, different port:

```bash
docker run -d \
  --name adguard-secondary \
  -p 3001:3000/tcp \
  -p 3001:3000/udp \
  -v /opt/adguardhome/work:/opt/adguardhome/work \
  -v /opt/adguardhome/conf:/opt/adguardhome/conf \
  --restart always \
  adguard/adguardhome
```

### DHCP Configuration

On your router (UniFi in my case), set both DNS servers:

```
Primary DNS:   192.168.1.10
Secondary DNS: 192.168.1.11
```

Every device that gets a DHCP lease now knows about both DNS servers. If the primary doesn't respond, the OS automatically falls back to the secondary.

## The Sync: Where Things Got Interesting

This is the part that took three attempts. AdGuard Home has a sync feature, but it's... not straightforward.

### Attempt 1: Manual Sync (Failed)

I thought I could just copy the config file between instances. The YAML config at `/opt/adguardhome/conf/AdGuardHome.yaml`.

Problem: the config contains runtime state (query stats, client IDs, etc.). Copying it overwrites the secondary's state. Worse, the file is read on startup — changes require a restart.

### Attempt 2: API Sync Script (Partial Success)

Wrote a script to sync filter lists and blocklist settings via the API:

```bash
#!/bin/bash
PRIMARY="http://192.168.1.10:3000"
SECONDARY="http://192.168.1.11:3001"
PRIMARY_AUTH="username:password"
SECONDARY_AUTH="username:password"

# Sync filtering rules
RULES=$(curl -s -u "$PRIMARY_AUTH" "$PRIMARY/control/filtering/status" | jq '.rules')
curl -s -u "$SECONDARY_AUTH" -X POST "$SECONDARY/control/filtering/set_rules" \
  -H "Content-Type: application/json" \
  -d "{\"rules\": $RULES, \"whitelist\": false}"
```

This works for rules but misses DNS rewrite rules, client settings, and schedule configurations. Too many gaps.

### Attempt 3: Built-in Sync (The Winner)

AdGuard Home has a built-in sync mechanism since v0.107. It's in the settings UI under "General settings" → "Configuration sync".

But here's the pitfall nobody mentions: **the sync API endpoint uses different parameter names than the UI suggests.**

```bash
# On the SECONDARY instance, configure it to pull from primary
curl -X POST "http://192.168.1.11:3001/control/sync/set_config" \
  -H "Content-Type: application/json" \
  -u "username:password" \
  -d '{
    "sync_url": "http://192.168.1.10:3000",
    "sync_username": "admin",
    "sync_password": "yourpassword",
    "sync_interval": 300,
    "sync_filters": true,
    "sync_rules": true,
    "sync_clients": true,
    "sync_services": true
  }'
```

**The interval is in SECONDS, not minutes.** I set it to 5 thinking it was minutes. It synced every 5 seconds and almost DDoS'd my own server. Set it to 300 for 5 minutes.

What syncs:
- Filter lists and their rules
- DNS rewrite rules
- Blocked services list
- Client settings
- Safe search settings
- Query log settings

What doesn't sync:
- Upstream DNS settings (intentional — each instance can have different upstreams)
- TLS certificates (each instance needs its own)
- Query statistics (each instance tracks its own)

### Cron Verification

Just to be safe, I added a health check:

```bash
# /etc/cron.d/adguard-sync-check
*/10 * * * * root curl -sf http://192.168.1.10:3000/control/status > /dev/null || echo "PRIMARY DNS DOWN" | logger -t adguard
*/10 * * * * root curl -sf http://192.168.1.11:3001/control/status > /dev/null || echo "SECONDARY DNS DOWN" | logger -t adguard
```

If either goes down, it shows up in syslog. Simple, reliable, no alerting subscription needed.

## The Optimizations

After getting sync working, I tuned both instances:

### DNS-over-HTTPS Upstreams

```yaml
# Upstream DNS servers (in AdGuard Home config)
upstream_dns:
  - https://dns.cloudflare.com/dns-query
  - https://dns.google/dns-query
  - https://dns.quad9.net/dns-query
```

Why DoH? Two reasons:
1. Your ISP can't see what domains you're resolving
2. Responses are authenticated — no DNS spoofing on the wire

### DNSSEC

Enable it. Settings → DNS settings → "Enable DNSSEC". This adds cryptographic validation to DNS responses. If someone tries to poison your DNS cache, DNSSEC catches it.

### Disable IPv6 (If You're Not Using It)

My ISP doesn't give me proper IPv6. Having AdGuard try to resolve AAAA records that will never work adds latency. Settings → DNS settings → uncheck "Use IPv6".

This shaved ~20ms off every query. Not dramatic, but noticeable.

### Cache Tuning

```yaml
# In AdGuard Home config
dns:
  cache_size: 4194304        # 4MB cache (default is 1MB)
  cache_optimistic: true     # Return cached results immediately,
                             # verify in background
  cache_min_ttl: 300         # Minimum 5 min cache regardless of TTL
```

`cache_optimistic` is the hidden gem. It returns cached results instantly, then checks if they're still valid in the background. If they're stale, it updates the cache for next time. You get the speed of cache hits with the freshness of live lookups.

### Query Log Retention

Default is 90 days of query logs. For a home lab, that's overkill:

```bash
# Set query log retention to 7 days via API
curl -X POST "http://192.168.1.10:3000/control/querylog_config" \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{"interval": 7, "anonymize_client_ip": true}'
```

**Warning: the `interval` parameter is in DAYS, not milliseconds.** I accidentally set it to 7ms once. The logs cleared immediately. Fun times.

Also enable `anonymize_client_ip` — no need to keep full IP addresses in query logs.

## Testing Failover

Don't wait for a real outage to find out if failover works. Test it.

```bash
# Stop the primary
docker stop adguard-primary

# From another machine, test DNS resolution
nslookup google.com 192.168.1.10  # Should timeout (primary down)
nslookup google.com 192.168.1.11  # Should work (secondary up)

# Check from a client device
dig @192.168.1.11 google.com
# Should return an IP address

# Restart primary
docker start adguard-primary

# Verify sync caught up
curl -s http://192.168.1.10:3000/control/filtering/status | jq '.rules | length'
curl -s http://192.168.1.11:3001/control/filtering/status | jq '.rules | length'
# Both should return the same number
```

If the numbers match, sync is working. If they don't, check the sync logs:

```bash
docker logs adguard-secondary 2>&1 | grep -i sync
```

## The Results

| Metric | Before (single DNS) | After (dual DNS) |
|--------|---------------------|-------------------|
| DNS uptime | ~99.5% | ~99.99% |
| Query latency (cached) | ~5ms | ~5ms |
| Query latency (uncached) | ~45ms | ~40ms (DoH + optimistic cache) |
| Blocked queries | ~18% | ~18% |
| Partner complaints | 2/month | 0/month |

That last metric is the one that matters.

## What I Learned

1. **DNS is critical infrastructure** — Treat it like critical infrastructure. Redundancy is not optional.
2. **Read the API docs carefully** — "interval" means different things in different endpoints. This is a Vogon poem waiting to happen.
3. **Test failover before you need it** — The time to discover your backup DNS doesn't work is not during an outage.
4. **DoH + DNSSEC + optimistic cache** — This combination gives you privacy, authenticity, and speed. Use all three.
5. **Two AdGuard instances on two physical machines** — Not two Docker containers on the same server. That defeats the purpose.

---

**Running dual DNS?** I'd love to hear your setup. Still on a single Pi-hole? Do yourself a favor and add a second one. Your partner will thank you during the next firmware update.

Now if you'll excuse me, I have some DNS queries to optimize. 🌐