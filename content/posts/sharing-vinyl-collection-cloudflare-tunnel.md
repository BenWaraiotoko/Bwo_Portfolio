---
title: Sharing My Vinyl Collection Online Without Opening a Single Port
date: 2026-09-30
publish: true
category: posts
tags:
  - docker
  - cloudflare
  - self-hosting
  - homelab
  - music
description: A friend wanted to browse my record shelves. Here's how I let them — through one regex-guarded tunnel, with zero ports opened.
---

So a friend asked me the other day: *"You keep saying you collect vinyl — what do you actually have?"*

And I froze. Not because the answer is embarrassing (okay, a little), but because my collection lives in **MusiVault**, a self-hosted catalogue app that — like everything self-hosted and properly configured — only exists on my home network. My options, as they presented themselves:

- Send 309 photos over WhatsApp like it's 2009
- Open a port on my router and let the entire internet knock on my server's door
- Hand my friend a VPN config and access to my whole network so they can look at... record sleeves

None of those were acceptable. So I built a fourth option: a public link that exposes exactly **one page** of my app, nothing else, through a Cloudflare Tunnel — with a regex doing the bouncer work at the edge.

Pretty neat, right? Let me walk you through the whole thing.

## What MusiVault Actually Is

[MusiVault](https://github.com/Jeanball/Musivault) is an open-source catalogue for vinyl and CD collections. Think of it as the music equivalent of Romm or Kitchenowl: a React frontend, a Node/Express backend, MongoDB behind it, and a Discogs integration that does the heavy lifting.

You type a Discogs release ID, a catalog number, or scan a barcode with your phone's camera, and the album appears — cover art, tracklist, year, format, the works. My collection sits at 309 items these days — 304 vinyl records plus a few box sets — and it took a few evenings, one barcode scan at a time. It also estimates collection value if you're brave enough to look.

What it is **not**: a music streamer. It's a catalogue. Your friend browses shelves, not audio.

## The Install (Docker Compose)

MusiVault ships with a compose file that just works. Three containers: the frontend (Nginx), the backend API, and MongoDB.

```bash
git clone --depth 1 https://github.com/Jeanball/Musivault.git
cd Musivault
```

The upstream `docker-compose.yml` is solid, so I only touched the `.env`. Create it next to the compose file:

```bash
# The port the web UI answers on.
# My server already had Grafana on 3000, so I moved to 3080.
# Rule of thumb: check what's taken BEFORE you pick a port.
PORT=3080
IMAGE_TAG=latest

# Two secrets to generate — never reuse, never commit
SESSION_SECRET=<run: openssl rand -hex 32>
JWT_SECRET=<same command, different output>

# Discogs API keys — free, at https://www.discogs.com/settings/developers
DISCOGS_KEY=your_consumer_key
DISCOGS_SECRET=your_consumer_secret

# Optional: enables collection value estimation
DISCOGS_PAT=
```

Then the magic words:

```bash
docker compose up -d
```

A minute later, `http://192.168.1.11:3080` answers. First user registers from the UI — no admin bootstrap needed, though the compose supports one if you insist.

One warning from the trenches: **MongoDB must stay on local storage.** NFS and WiredTiger locking don't mix. If you're temped to put the data volume on your NAS — don't.

## First Run: Adding Records

Three ways to add an album, and this tripped me up initially:

- **Discogs release ID** — the number in the URL of the exact pressing (`discogs.com/release/553769-...` → `553769`). Most reliable.
- **Catalog number** — printed on the sleeve spine (like `CAD 0006`).
- **Barcode scan** — there's a camera button in the app. It reads the EAN off the back cover. Note: barcode scanning requires HTTPS (camera access is blocked on plain HTTP), and pre-1984 pressings often have no barcode at all.

Typing a barcode into the catalog-number field returns "no release found" — that field only queries IDs and catalog numbers. Ask me how I know.

## The Share Button (and Its Catch)

In MusiVault's preferences, there's a "public collection" toggle. Flip it on, and the app hands you a link:

```
https://vault.example.com/shared/123e4567-e89b-12d3-a456-426614174000
```

Anyone with that link sees your collection — read-only, sorted, with cover art. The UUID *is* the authentication (a capability link). No account creation for your friend, no password to communicate over yet another WhatsApp message.

The catch? I run the app behind HTTPS on my own domain, resolved by my local DNS. From inside my network: perfect. From my friend's phone on 4G: **the domain doesn't even resolve**. NXDOMAIN. The link is a dead end for everyone but me.

## Enter the Cloudflare Tunnel

Three ways to fix that:

1. **Port forwarding** — exposes your home IP, invites every scanner on the internet to probe your app's login. Hard no.
2. **VPN for the friend** — works, but you're granting network-level access to your entire homelab so someone can look at record sleeves. Overkill and bad hygiene.
3. **Cloudflare Tunnel** — a container that dials *out* to Cloudflare's edge. No inbound port, your home IP stays invisible, and Cloudflare's edge handles TLS.

Option 3, obviously. But there's a subtlety, and it's the whole point of this post: **a naive tunnel publishes your entire app** — login page, admin endpoints, everything. That's just port forwarding with extra steps and better suits.

The trick: tunnels route by **path**, not just hostname. We'll publish four routes and starve the rest.

## Setting Up the Tunnel

In the Cloudflare dashboard: **Networking → Tunnels → Create a tunnel**. Name it something meaningful, pick the Docker install method, and copy the token it hands you.

On your server:

```bash
mkdir -p ~/docker/cloudflared && cd ~/docker/cloudflared

cat > docker-compose.yml <<'YAML'
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: unless-stopped
    command: tunnel --no-autoupdate run --token ${CLOUDFLARED_TOKEN}
YAML

echo "CLOUDFLARED_TOKEN=paste-your-token-here" > .env
chmod 600 .env

docker compose up -d
```

The logs should show four `Registered tunnel connection` lines. That's your server holding hands with Cloudflare's edge — four times, for redundancy.

Now, in the tunnel's **Public Hostnames**, add one route:

- **Subdomain:** `vault` (yours will differ)
- **Domain:** your domain
- **Path:** hold that thought — next section
- **Service:** `http://192.168.1.11:3080`

⚠️ One classic Docker trap: the service URL must be your **server's LAN IP**, not `localhost`. From inside the cloudflared container, `localhost` means the container itself. You'd get connection refused and spend an embarrassing amount of time blaming the tunnel.

## One Path Field, Four Allowed Routes

Here's the thing I had to discover the hard way: the dashboard's Path field takes a **regular expression** (RE2, unanchored). One field, but it can hold an alternation.

First, what does the shared page actually need? I read the frontend source — the SPA page calls:

1. `GET /shared/<uuid>` — the page itself
2. `GET /api/public/<uuid>` — the collection as JSON
3. `POST /api/auth/verify` — a harmless "is this visitor logged in?" check
4. The static assets: `/assets/*`, favicon, manifest

And critically, the app *also* has `/api/public/users` — an endpoint that lists **all** public users and their share IDs — plus a login page, admin endpoints, and Discogs API proxies. All of that must stay unreachable.

So the path regex:

```
^/shared/|^/api/public/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^/api/auth/verify$|^/(assets/|icons/|images/|favicon\.ico|manifest\.json|apple-touch-icon\.png|placeholder-[^/]*)
```

Let's decompose:

- `^/shared/` — the SPA route for the share page
- `^/api/public/[0-9a-f]{8}-...` — **the UUID shape is the trick**. Only a well-formed UUID matches. `/api/public/users` and `/api/public/albums/latest` don't look like UUIDs, so they fall through to the catch-all and die at the edge. They never touch my server.
- `^/api/auth/verify$` — one specific POST endpoint, nothing else under `/api/auth/`. The login endpoint? Blocked.
- `^/(assets/|...)` — the static bits. Note `i18n` is bundled into the JS in this build, so no locale JSON to whitelist.

And here's the beautiful part: when you add a Public Hostname, Cloudflare automatically appends a **catch-all rule returning 404** for everything else. Every request that doesn't match my regex gets a 404 *at Cloudflare's edge*, having never reached my network.

My app's login page doesn't exist from the outside. Neither does its API. A scanner hitting the domain gets nothing but a 404 for any path I didn't explicitly allow.

## Testing It Like an Attacker

Trust, but verify. From outside my network (DNS pointed at Cloudflare, not my local resolver):

```
GET  /shared/<uuid>       → 200   ✓ via tunnel
GET  /api/public/<uuid>   → 200   ✓ collection JSON
POST /api/auth/verify     → 200   ✓ the cookie check
GET  /assets/index-*.css  → 200   ✓ static assets

GET  /                    → 404   ✗ main app: invisible
GET  /login               → 404   ✗ no login page outside
GET  /api/auth/login      → 404   ✗ brute-force target: doesn't exist
GET  /api/public/users    → 404   ✗ the endpoint that leaks share IDs: dead
GET  /api/discogs/lookup  → 404   ✗ API proxy: unreachable
```

The 404s come from `server: cloudflare` — they die at the edge, not on my origin. That's the difference between "blocked" and "doesn't exist."

## The Gotcha That Almost Fooled Me

First verification run, every single path returned 403. Even the allowed ones. I nearly spent an evening debugging a regex that was working perfectly.

The culprit: **Bot Fight Mode**. My probe used Python's default User-Agent (`Python-urllib`), and Cloudflare's free bot filter blocks that *before* the tunnel is even consulted. Replay the same requests with a browser User-Agent: everything works.

So if you test your tunnel with `curl` and get uniform 403s — check your User-Agent before blaming your regex. Better: use `curl -A "Mozilla/5.0"`.

Honestly? I ended up keeping Bot Fight Mode on. It's a free anti-scraper layer sitting in front of my share link. My friend uses a browser; scrapers don't.

## Revoking Access

The UUID is a secret, and secrets leak. When it does: flip off the public-collection toggle in MusiVault's preferences. The link returns a 404 from the app itself (`Collection not found`). No tunnel surgery needed.

Rotating the share ID would require a new one from the app — revocation is the lever you'll actually use.

## What I Learned

- **A tunnel with a catch-all is just port forwarding with extra steps.** Path-scoped routing is what makes exposure safe.
- **The UUID-shape regex is cleaner than a blocklist.** "Only things shaped like this may pass" beats "everything except these three paths" — you can't forget a path you never had to enumerate.
- **Cloudflare's free bot filter will gaslight your curl.** 403-everything means "you look like a bot," not "your config is broken."
- **Read the app's source before exposing it.** Knowing that `/api/public/users` existed — and leaked share IDs — is the only reason it's not public right now.

Your friend gets a link, your server stays invisible, your router keeps its ports closed, and the whole bouncer is one line of regex.

And here's the proof it works — my actual collection, served straight through that regex-guarded tunnel: **[come browse my shelves](https://musivault.benwaraiotoko.dev/shared/484905f0-ee37-4a57-9019-e20bd302c1e0)**. 309 records, read-only, zero open ports. If you can read this, the bouncer let you in.

That's it for now. Go share your shelves.