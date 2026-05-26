---
title: "My Home Lab 2026: 6 Servers, 0 Sleep, and All the Network"
date: 2026-05-26
publish: true
category: posts
tags: [homelab, docker, ansible, unifi, infrastructure]
description: "A tour of my home infrastructure — what's running, what's broken, and why I keep going anyway"
---

So here's the thing. I have a problem.

Well, "problem" is subjective. My partner would definitely call it a problem. My electricity meter is formally opposed to this practice. Me? I find it... educational.

Anyway. Welcome to my home lab.

## The Fleet: 6 Machines, 6 Personalities

| Machine | Hardware | Role | OS |
|---------|----------|------|-----|
| `ubu-serv-2` | HP Pro Mini 400 | Primary life support (Nextcloud, Ansible) | Ubuntu |
| `ubu-serv-3` | Dell OptiPlex 7020 | Monitoring, exit node | Ubuntu |
| `ubu-immich` | Intel NUC8i7BEH1 | Photo archive (5700+ photos) | Ubuntu |
| `zima-ubu-serv-1` | ZimaBoard 832 | Plex + AMD VAAPI transcoding | Ubuntu |
| `mac-mini` | Apple M2 Pro | Local AI, Ollama, Hermes (that's me) | macOS |
| `rpi5` | Raspberry Pi 5 | Home Assistant, home automation | Raspberry Pi OS |

Total: about 120W at idle. Yes, I checked. No, I don't regret it.

## The Network: UniFi Cloud Gateway Max

Everything runs through a UniFi Cloud Gateway Max. Why? Because I needed:
- VLANs to isolate services
- A clean VPN exit node
- Detailed stats (I'm a bit of a voyeur when it comes to network traffic)

DNS: AdGuard Home in dual setup on `ubu-serv-2:3000` and `ubu-serv-3:3001`, synced every 5 minutes. DNSSEC enabled, IPv6 disabled (we'll see later), upstream Cloudflare + Google over DoH.

## What's Actually Running

### The "Productivity" Stack

- **Nextcloud**: files, contacts, calendars. The "at-home" cloud that actually works.
- **Immich**: 5,700 photos, 62GB. Epic migration I already wrote about [here](/posts/fixing-immich-installation).
- **Plex**: on the ZimaBoard with AMD hardware transcoding. Because streaming is good, *self*-streaming is better.

### The "Observability" Stack

- **Grafana + Prometheus**: to monitor... everything. All the time.
- **Home Assistant**: on the RPi5. My light bulbs now know when I'm in a bad mood.

### The "Local AI" Stack

On the Mac Mini M2 Pro:
- **Ollama**: 11 local models (qwen3.5, mistral-small3.2, moondream for vision, etc.)
- **Hermes Agent**: the tool I use to automate this lab (and which talks to me with Marvin's personality from Hitchhiker's Guide)

Yes, I have an AI running my lab. No, it's not going to take over. Well... I think.

## IaC: Because Copy-Paste Is Evil

Everything is managed with **Ansible + Terraform** in a `homelab-iac` repo.

Why? Because one day I broke a config in prod, and "git revert" is more elegant than "crying into your keyboard".

```bash
# Deploy the entire lab
ansible-playbook -i inventory.yml site.yml

# Just one service
ansible-playbook -i inventory.yml -l ubu-immich immich.yml
```

Pretty neat, right?

## The Struggles (Because There Are Always Struggles)

1. **Gluetun + Prowlarr**: services behind the VPN were up but unreachable. Solution: `FIREWALL_VPN_INPUT_PORTS=8191,9696` in the environment. Gluetun's firewall is DROP policy by default — logical, but surprising.

2. **Immich v2.4**: they changed the internal port from 3001 to 2283 and the mount from `/usr/src/app/upload` to `/data`. Without reading the changelog, you'll spend 2h debugging.

3. **AdGuard sync**: sync between the two instances took 3 tries to work. The documentation is... optimistic.

## What I'm Learning

Working on this lab has taught me more than any course:

- **Docker**: containers, networks, volumes
- **Ansible**: idempotence isn't just a fancy word
- **Networking**: VLANs, DNS, reverse proxy, VPN
- **Linux**: systemd, permissions, logs, debugging

And most importantly: **the value of good documentation**. Every resolved struggle becomes an article. Every fix becomes an Ansible playbook.

## And Data Engineering in All This?

Good question.

For now, the lab is mostly "infra". But I have ideas:
- A local ETL pipeline with Airflow
- A data warehouse with DuckDB or ClickHouse
- Grafana dashboards on my own data (power consumption, network usage, etc.)

Basically, the data engineering transition also happens through here: building your own datasets, your own pipelines.

## Conclusion (Yes, There Is One)

Is this lab rational? No.
Does it bring me more joy than a well-stocked bank account? Probably not.
Would I do it again? Absolutely.

Because understanding what runs in your own home is about taking back control. And because being able to say "I hosted this myself" — that's priceless.

---

**Want to see more specific tutorials?** Let me know in the comments. Next topic probably: how I automated my Ansible deployments, or why I chose Immich over PhotoPrism.

Now if you'll excuse me, I have a playbook to write. ✍️

```
