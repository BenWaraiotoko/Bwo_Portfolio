---
title: I Fired Git From My Obsidian Vault. My Notes Never Synced Better.
date: 2026-09-08
publish: true
category: posts
tags:
  - obsidian
  - self-hosted
  - couchdb
  - homelab
  - wireguard
description: From a YouTube video to four devices syncing in real time in one day — the five decisions every LiveSync tutorial skips, including the iOS HTTPS problem nobody warns you about.
---

So here's the thing: my Obsidian vault has been syncing through a git plugin for years. Free, versioned, battle-tested. And like every git-based Obsidian sync, it had one fatal flaw — **my iPhone was never invited to the party.**

Then a YouTube video crossed my feed about Self-hosted LiveSync — the CouchDB-backed sync plugin that hit 1.0 after five years of near-daily releases. Real-time sync, end-to-end encrypted, runs on your own hardware, zero subscription. Sounds great, right?

Here's what actually made it interesting: the migration took one Saturday, and the hard part wasn't the install. The install is three commands. The hard part was the **five decisions** the tutorials skip entirely. That's this article.

## Decision 1: Kill Your Old Sync Before the New One Breathes

Every guide says "back up first." Fine. But the part they rush through is this: the moment LiveSync starts, nothing else can be writing to that vault. Not the old git plugin, not iCloud, not Syncthing, nothing. Two sync engines fighting over the same files is how vaults get corrupted — not *if*, *when*.

So the actual order of operations was:

1. Final commit, pushed. The GitHub repo becomes a frozen archive — a restoration point, nothing more.
2. Full zip of the vault **and** the `.git` folder, stashed outside the vault.
3. And here's the step that separates the adults from the tourists: **I restored the zip into a temp folder and diffed it against the original.** Byte-for-byte. A backup you haven't restored is a hope, not a backup.
4. Only then: disable the git plugin.

Not uninstall — disable. If everything went sideways, one toggle and I'm back on git like nothing happened. The repo stays frozen with a dated commit that says exactly what it is. We didn't break up; we're just seeing other people.

## Decision 2: The Server Is Not a Backup (Say It Until It Stops Being Funny)

This is the conceptual trap everyone falls into with LiveSync, and it's worth three minutes of your life.

CouchDB is a **replication hub**, not storage. Your notes live on each device — full local copies. The hub is just encrypted chunks coordinating them. Delete a note on one device, and that deletion replicates everywhere. Your hub being "backed up" doesn't save you from yourself.

Two consequences:

- Your vault's backup story has to be independent of the sync. A zip on another machine, a scheduled export, whatever — just not "the server has it."
- The hub itself holds **zero readable data**. The database admin sees chunks starting with `h:+` and, if you toggle "Obfuscate Properties," not even your file names. I checked, because of course I checked. Reading my own database felt like staring at a wall of license plates.

## Decision 3: iOS Doesn't Care About Your Clever LAN Setup

Here's where every tutorial shrugs and says "use Tailscale, it's magic."

I have opinions about that. I already migrated my whole lab off Tailscale to native WireGuard on my UniFi gateway — [a DNS saga for another day](https://benwaraiotoko.dev/posts/why-i-let-ansible-run-my-homelab). So the question became: **how do you give an iPhone a valid HTTPS certificate for a server that has zero open ports and no public DNS record?**

Because that's the catch nobody mentions: Obsidian mobile *requires* HTTPS with a certificate the OS trusts. Not on 4G — on your own Wi-Fi. Your `http://192.168.1.10:5984` works beautifully on desktop and gets shown the door by an iPhone.

The answer is a three-piece puzzle:

**Piece 1: A reverse proxy with a real certificate.** Caddy, one container, pointed at the CouchDB port. Certificates come from Let's Encrypt via the **DNS-01 challenge** — which means the certificate gets issued by proving I control the domain's DNS, and *nothing gets exposed to the internet*. No port forwarding. My gateway still has exactly zero NAT rules. The domain doesn't even resolve publicly — the challenge record is created and deleted within seconds.

**Piece 2: Local DNS rewrite.** Inside the house, my AdGuard instance resolves `sync.example.com` to the proxy's internal IP. Every device on the LAN reaches the hub through its proper name, real certificate included.

**Piece 3: WireGuard for the road.** The tunnel that already existed on the phone, with one line that matters: `DNS = <my AdGuard IP>` inside the client config. WireGuard does not push DNS to clients — if it's not baked into the config file, your phone keeps using whatever DNS it had, and the domain stops resolving the moment you leave the house. That single line is the difference between "works everywhere" and "mystery timeout in the parking lot."

Total infrastructure added: one CouchDB container, one Caddy container, one DNS rewrite, zero attack surface. The same proxy is now my template for every future service that needs clean HTTPS without showing up on the internet.

## Decision 4: When Your Devices Won't Stop Asking to Restart

First real bug, about an hour after the fourth device joined: every machine started asking to restart every three minutes. Classic distributed systems behavior — something was oscillating.

The culprit? `graph.json` — the file where Obsidian stores your graph view's pan and zoom state. LiveSync's "Hidden File Sync" feature (which syncs your plugins and settings across devices — genuinely excellent, by the way) was happily replicating my graph view position to all four devices. Every time I moved the graph, three other machines received "the graph changed!" and politely asked to restart to apply it.

The fix is one ignore pattern — `/graph.json$` — but the *lesson* is a general rule for any sync system: **state files don't travel well.** Workspace layouts, window positions, view states: they're per-device by nature. Sync the configuration, never the furniture.

## Decision 5: If You Can't Measure the Migration, It Didn't Happen

I have a personal rule from years of broadcast infrastructure: a system isn't migrated until you've verified it from the *destination*, not the source. So the whole day was receipts:

- **The upload**: the database went from 1 document to 3,919 to 8,240 documents, ~23 MB of encrypted chunks. Watching doc_count climb is the least glamorous progress bar you'll ever love.
- **The propagation**: a test note created on one device, confirmed arriving via the server's changes feed. Then the full loop — a note created *on the iPhone* appearing on three desktops. That's the moment you stop holding your breath.
- **The frozen archive**: local commit hash equals remote hash, checked, not assumed.
- **The monitoring**: two uptime monitors — one on the hub directly, one through the HTTPS proxy. The direct one answers 200 in 7ms with basic auth. The HTTPS one answers 401 in 20ms, and that 401 is *correct* — it's CouchDB refusing anonymous requests, which is exactly what I want it doing. A few days later, when a note edit "wasn't showing up" on another machine, the hub's traffic logs told the truth in one look: the edit had simply never left the source device yet, because I'd closed the lid. The sync wasn't broken; my laptop was asleep. Diagnosis by data, not vibes.

## What It Actually Cost

One Docker container running CouchDB. One running Caddy. A Cloudflare API token scoped to DNS-only. A passphrase in the password manager (lose it and the data is *gone* — that's not a bug, that's the encryption working). And zero monthly fees, forever, on storage that's a rounding error of a disk I already owned.

Was it more work than a $5/month subscription? Obviously. Is it better? For me — yes, because of what it *isn't*: no third party, no storage cap, no "we're changing our pricing," and an iPhone that finally syncs my notes in real time, over infrastructure where I can read every log line.

The GitHub repo is still there, frozen and dated, like a message in a bottle. I hope I never need it. I'm glad I know exactly where it is.

Now if you'll excuse me, I have a graph view to reposition — on exactly one device, as nature intended.