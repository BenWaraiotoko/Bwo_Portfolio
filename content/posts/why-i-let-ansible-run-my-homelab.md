---
title: Why I Let Ansible Run My Home Lab (And You Should Too)
date: 2026-05-26
publish: true
category: posts
tags:
  - homelab
  - ansible
  - automation
  - infrastructure
  - docker
description: Manual SSH into 6 servers is how homelabs die. Here's how I automated everything with Ansible — including the mistakes I made along the way.
---

You know that feeling when you SSH into a server, change a config file, and then realize three weeks later you have no idea what you changed or why?

Yeah. Me too. For about a year.

Then I discovered Ansible, and my homelab went from "hope-driven infrastructure" to something I can actually reproduce. Let me walk you through it.

## The Problem With Manual Everything

My homelab has 6 machines. Every time I wanted to:

- Update Docker containers
- Fix a config
- Deploy a new service
- Check disk space

I'd SSH in, run some commands, maybe write down what I did. Maybe.

The result? Config drift. Servers that looked similar but weren't. Fixes that worked on one machine but not another because "oh right, I changed that one thing that one time."

Sound familiar? Good. You're in the right place.

## Why Ansible (Not Terraform, Not Salt, Not...)

Look, I'm not going to pretend I evaluated every tool with a scoring matrix. Here's why Ansible won:

1. **Agentless** — SSH is all you need. No daemon to install on 6 machines.
2. **YAML** — yes, YAML can be annoying. But it's readable. My future self can understand it.
3. **Idempotent** — run the same playbook 50 times, get the same result. This is the whole point.
4. **Batteries included** — modules for Docker, systemd, apt, files, templates... I rarely need custom code.

Terraform handles the network side (UniFi Cloud Gateway, VLANs, DNS records). Ansible handles the servers. They complement each other — this isn't a turf war.

## The Setup

### Directory Structure

```
homelab-iac/
├── ansible/
│   ├── inventory/
│   │   ├── hosts.yml           # Full inventory (30+ hosts)
│   │   └── group_vars/
│   │       ├── all.yml          # Global vars (VLANs, monitoring, timezone)
│   │       └── vault.yml       # Encrypted secrets (Ansible Vault)
│   ├── ansible.cfg              # Optimized config
│   ├── playbooks/
│   │   ├── site.yml             # Main entry point
│   │   ├── setup-common.yml     # Base packages
│   │   ├── setup-docker.yml     # Docker CE + Compose
│   │   ├── setup-monitoring.yml # Monitoring stack
│   │   ├── gather-info.yml      # Info collection
│   │   ├── unifi-auto-inventory.yml  # UniFi API inventory
│   │   └── unifi-query.yml      # UniFi network queries
│   └── roles/                   # 17 roles (see below)
├── terraform/
│   └── unifi/                   # Network infrastructure
├── scripts/
│   └── generate-docs.py        # Auto-generate Obsidian docs
└── Makefile                     # CLI shortcuts for everything
```

### The Inventory: Not Just Servers

Here's where things get interesting. My inventory doesn't just list servers — it tracks everything on the network:

```yaml
# inventory/hosts.yml (simplified)
all:
  children:
    ubuntu_servers:
      hosts:
        ubu-serv-2:
          ansible_host: 192.168.1.10
          hw_model: "HP Pro Mini 400"
          hw_cpu: "i5-13500T"
          hw_ram: "31 Go"
          host_roles: [ansible-control, nextcloud, baikal]
          docker_services: [nextcloud-aio, paperless, servarr, adguardhome, ...]

        ubu-serv-3:
          ansible_host: 192.168.1.11
          hw_model: "Dell OptiPlex 7020"
          host_roles: [monitoring, homepage]
          docker_services: [alertmanager, grafana, prometheus, loki, ...]

        ubu-immich:
          ansible_host: 192.168.1.12
          hw_model: "Intel NUC8i7BEH1"
          host_roles: [immich]
          docker_services: [immich-server, immich-microservices, ...]
          nfs_mounts: ["192.168.1.5:/volume1/immich:/srv/immich"]

        zima-ubu-serv-1:
          ansible_host: 192.168.1.9
          hw_model: "ZimaBoard 832"
          hw_cpu: "Celeron J3455"
          hw_gpu: "AMD Radeon Pro WX3100"
          host_roles: [plex, jellyfin, glances]

    macos_hosts:
      hosts:
        mac-mini:
          ansible_host: 192.168.1.13
          hw_model: "Apple Mac Mini M2 Pro"
          host_roles: [ollama, glances]

    home_assistant:
      hosts:
        rpi5:
          ansible_host: 192.168.2.20
          hw_model: "Raspberry Pi 5"
          os: "Home Assistant OS 2026.3.3"
          # No SSH on HAOS — metadata only

    nas:
      hosts:
        synology:
          ansible_host: 192.168.1.5
          hw_model: "Synology DS923+"
          os: "DSM 7.3.2"
          nfs_exports: ["/volume1/immich"]

    unifi_network:
      vars:
        unifi_api_url: "https://192.168.1.1"
      hosts:
        ucg-max:
          device_name: "Cloud Gateway Max"
          firmware: "5.1.15"
          host_roles: [gateway, firewall, dns, dhcp]
        usw-pro-max-24:
          device_name: "USW Pro Max 24 PoE"
          firmware: "7.4.1"
          host_roles: [switch]
        # ... 4 more APs and switches

    iot_devices:
      hosts:
        wled-kitchen: { ansible_host: 192.168.2.120, hw: "ESP32" }
        wled-corniche-1: { ansible_host: 192.168.2.121, hw: "ESP32" }
        # ... more WLED, ESPHome, Hue, Bambu Lab, consoles
```

The cool part? I track hardware specs, firmware versions, VLANs, and NFS mounts right in the inventory. When something breaks, I know exactly what I'm dealing with without SSH-ing anywhere.

### The 17 Roles

Every service gets its own role. Clean, reusable, testable:

| Role | What It Deploys | Server |
|------|----------------|--------|
| `common` | Base packages, timezone, locale, UFW, auto-upgrades | All Ubuntu |
| `docker` | Docker CE + Compose plugin, daemon config | All Ubuntu |
| `monitoring` | cadvisor, node-exporter, alloy, glances, docker-socket-proxy | All Ubuntu |
| `adguard` | AdGuard Home (dual instance) | ubu-serv-2, ubu-serv-3 |
| `nextcloud` | Nextcloud AIO | ubu-serv-2 |
| `paperless` | Paperless-ngx | ubu-serv-2 |
| `servarr` | Full *arr stack behind Gluetun VPN | ubu-serv-2 |
| `grafana-stack` | Grafana + Prometheus + Loki + Alertmanager | ubu-serv-3 |
| `homepage` | Homepage dashboard | ubu-serv-3 |
| `uptime-kuma` | Uptime monitoring | ubu-serv-3 |
| `searxng` | Privacy search engine | ubu-serv-3 |
| `it-tools` | IT utilities | ubu-serv-3 |
| `romm` | ROM manager | ubu-serv-3 |
| `wallos` | Subscription tracker | ubu-serv-3 |
| `immich` | Photo archive (5 containers) | ubu-immich |
| `plex` | Plex Media Server | zima-ubu-serv-1 |
| `jellyfin` | Jellyfin Media Server | zima-ubu-serv-1 |
| `tdarr` | Transcoding automation | zima-ubu-serv-1 |

And `unifi-api` runs locally to query the UniFi network state.

### The Optimized ansible.cfg

This isn't the default config. I tuned it:

```ini
[defaults]
inventory = ./inventory/hosts.yml
remote_user = bwo
host_key_checking = False
timeout = 30
retry_files_enabled = False
gathering = smart                    # Only gather facts when needed
fact_caching = jsonfile              # Cache facts to disk
fact_caching_connection = /tmp/ansible_facts
fact_caching_timeout = 3600         # 1 hour cache
inject_facts_as_vars = False        # Cleaner variable namespace
roles_path = ./roles

[ssh_connection]
ssh_args = -o ControlMaster=auto -o ControlPersist=60s
pipelining = True                    # Faster SSH transfers
control_path = /tmp/ansible-ssh-%%h-%%p-%%r
```

The `smart` gathering + fact caching means Ansible only SSHes into machines when facts are stale. Second runs are noticeably faster. And `pipelining = True` reduces SSH round-trips.

## The Real Power: Docker Deployments via Templates

Here's where Ansible stops being "nice" and starts being essential.

Every role follows the same pattern:

```yaml
# roles/<service>/tasks/main.yml
- name: Create directories
  ansible.builtin.file:
    path: "{{ item }}"
    state: directory
    mode: "0755"
    owner: "{{ service_user }}"
  loop:
    - "{{ service_base_dir }}"
    - "{{ service_data_dir }}"

- name: Deploy docker-compose.yml
  ansible.builtin.template:
    src: docker-compose.yml.j2
    dest: "{{ service_base_dir }}/docker-compose.yml"
    mode: "0644"
  notify: restart service

- name: Ensure services are running
  community.docker.docker_compose_v2:
    project_src: "{{ service_base_dir }}"
    state: present
```

Templates use Jinja2 variables, not hardcoded values. Change a port? Change it in `defaults/main.yml`, re-run the playbook, done.

### Example: The Servarr Stack

This is the big one. 13 containers, all templated from one `docker-compose.yml.j2`:

```yaml
# roles/servarr/templates/docker-compose.yml.j2 (excerpt)
services:
  gluetun:
    image: {{ gluetun_image }}:{{ gluetun_tag }}
    cap_add: [NET_ADMIN]
    devices: [/dev/net/tun:/dev/net/tun]
    ports:
      - "{{ prowlarr_port }}:{{ prowlarr_port }}"
      - "{{ flaresolverr_port }}:{{ flaresolverr_port }}"
    environment:
      - VPN_SERVICE_PROVIDER={{ vpn_service_provider }}
      - FIREWALL_VPN_INPUT_PORTS={{ gluetun_vpn_input_ports }}
      # ... VPN credentials from vault

  prowlarr:
    image: {{ prowlarr_image }}:{{ prowlarr_tag }}
    network_mode: service:gluetun    # Behind VPN

  flaresolverr:
    image: {{ flaresolverr_image }}:{{ flaresolverr_tag }}
    network_mode: service:gluetun    # Also behind VPN

  sonarr:
    image: {{ sonarr_image }}:{{ sonarr_tag }}
    ports:
      - "{{ sonarr_port }}:8989"

  # ... radarr, lidarr, bazarr, qbittorrent, jellyseerr,
  #     recyclarr, kometa, tdarr, deunhealth
```

The `FIREWALL_VPN_INPUT_PORTS` variable? That's the one I [learned the hard way](/posts/my-home-lab-2026). Without it, Prowlarr and FlareSolverr are up but unreachable behind Gluetun's DROP policy. Now it's a variable in my defaults, never to be forgotten again.

All VPN credentials live in `vault.yml`, encrypted with Ansible Vault. Never in plain text. Never in git.

### Example: Monitoring on Every Node

Every Ubuntu server runs the same monitoring stack:

```yaml
# group_vars/all.yml
monitoring_stack:
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    port: 8080
  node_exporter:
    image: prom/node-exporter:latest
    port: 9100
  alloy:
    image: grafana/alloy:latest
    port: 12345
  glances:
    image: nicolargo/glances:latest-full
    port: 61208
```

The `monitoring` role templates this out on every node. Same containers, same ports, same config. Prometheus scrapes all of them from ubu-serv-3. No config drift.

## The Master Playbook

```yaml
# playbooks/site.yml
# Base: common + docker + monitoring on ALL Ubuntu servers
- name: Base — Common + Docker + Monitoring
  hosts: ubuntu_servers
  become: yes
  roles: [common, docker, monitoring]

# Per-server roles
- name: ubu-serv-2 — Nextcloud + Paperless + Servarr + AdGuard
  hosts: ubu-serv-2
  become: yes
  roles: [adguard, nextcloud, paperless, servarr, tdarr]

- name: ubu-serv-3 — Grafana Stack + Apps
  hosts: ubu-serv-3
  become: yes
  roles: [grafana-stack, homepage, uptime-kuma, searxng, it-tools, romm, wallos, adguard]

- name: ubu-immich — Immich Photo Archive
  hosts: ubu-immich
  become: yes
  roles: [immich]

- name: zima-ubu-serv-1 — Plex + Jellyfin + Tdarr Node
  hosts: zima-ubu-serv-1
  become: yes
  roles: [plex, jellyfin, tdarr]

# UniFi inventory (runs locally, no SSH)
- name: UniFi Network Inventory
  hosts: localhost
  connection: local
  gather_facts: false
  roles: [unifi-api]
```

One command to rule them all:

```bash
# Deploy everything
make setup-common     # or: ansible-playbook playbooks/site.yml

# Just one server
ansible-playbook playbooks/site.yml --limit ubu-immich

# Dry run (check mode) with diff
ansible-playbook playbooks/site.yml --check --diff
```

## The Makefile: Because Typing Less Is Better

I got tired of typing `cd ansible && ansible-playbook ...` so I wrapped everything in a Makefile:

```bash
make ping            # Test SSH connectivity to all machines
make gather          # Collect system info from all hosts
make setup-common    # Base packages on all servers
make setup-docker    # Install Docker on all servers
make vault-edit      # Edit encrypted secrets
make vault-view      # View encrypted secrets
make lint            # Check syntax (Terraform + Ansible)
make fmt             # Auto-format everything
make status          # Repo + Terraform + Ansible status
make clean           # Remove temp files
```

Quick, consistent, no typos.

## The Mistakes I Made (So You Don't Have To)

### 1. Hardcoding Secrets in Playbooks

First week: API keys and passwords right there in the YAML. Committed to git. Pushed to GitHub.

Don't do this. Use Ansible Vault:

```bash
make vault-edit      # Edit encrypted secrets interactively
make vault-view      # View them (prompts for password)

# Or directly:
ansible-vault edit inventory/group_vars/vault.yml
```

### 2. Not Using `--check --diff`

Without `--diff`, Ansible says "changed" and you're left wondering *what* changed. With it, you see the exact before/after of every file modification.

```bash
ansible-playbook playbooks/site.yml --check --diff
```

This should be in your `ansible.cfg`:

```ini
[defaults]
diff = true
```

Now you'll never run blind again.

### 3. Ignoring Idempotency

Early on, I wrote tasks that used `shell: docker compose up -d`. Every run showed "changed" even when nothing changed. Use the proper modules:

```yaml
# BAD — always reports changed
- name: Start containers
  shell: docker compose up -d

# GOOD — only reports changed when something actually changes
- name: Start containers
  community.docker.docker_compose_v2:
    project_src: /opt/immich
    state: present
```

This is the whole point of Ansible. If you're not using idempotent modules, you're just writing bash scripts in YAML.

### 4. No Health Checks

Deploy and pray is not a strategy. Add verification:

```yaml
- name: Verify Immich is responding
  uri:
    url: "http://{{ ansible_host }}:{{ immich_port }}/api/server/ping"
    return_content: yes
  register: result
  until: '"pong" in result.content'
  retries: 5
  delay: 10
```

Now your playbook fails loudly if something's wrong instead of silently succeeding while your service is down.

### 5. Not Caching Facts

Without fact caching, Ansible gathers system facts on every run. That's an SSH connection per host just to ask "what OS are you running?" every single time.

```ini
# ansible.cfg
gathering = smart
fact_caching = jsonfile
fact_caching_connection = /tmp/ansible_facts
fact_caching_timeout = 3600
```

First run: slow. Second run: facts loaded from disk. Noticeably faster.

## What This Looks Like Day-to-Day

```bash
# Monday morning: update everything
make setup-common

# New service? Write a role, test with --check, deploy
ansible-playbook playbooks/site.yml --limit ubu-serv-3 --check --diff
ansible-playbook playbooks/site.yml --limit ubu-serv-3

# Something broke? Re-run the playbook (idempotent, remember)
make setup-docker

# Quick health check
make ping

# Check what's different across the fleet
make gather

# Edit secrets safely
make vault-edit
```

No more SSH. No more manual anything. Just YAML, templates, and trust.

## The Honest Take

Ansible isn't perfect. The YAML syntax can feel verbose. Error messages sometimes read like they were written by someone who hates you personally. And yes, sometimes a quick SSH + manual fix is faster.

But for a homelab with more than 2 machines? It's the difference between maintaining infrastructure and being maintained *by* your infrastructure.

My repo has 17 roles, 30+ hosts in inventory, and a Makefile that wraps everything into 2-letter commands. Start small. One role. One service. Let it grow organically. You don't need the perfect directory structure on day one — you need *something* that's not SSH and hope.

And honestly? The first time you type `make setup-common` and watch 4 machines install the same packages in parallel — that's the kind of stuff I live for.

---

**Already using Ansible?** I'd love to hear what your roles look like. Still SSH-ing into everything? Give it a shot — start with a `common` role and build from there.

Now if you'll excuse me, I have some idempotence to verify. 🎭