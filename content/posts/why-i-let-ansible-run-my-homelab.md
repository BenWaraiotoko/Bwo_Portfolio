---
title: "Why I Let Ansible Run My Home Lab (And You Should Too)"
date: 2026-05-26
publish: true
category: posts
tags: [homelab, ansible, automation, infrastructure, docker]
description: "Manual SSH into 6 servers is how homelabs die. Here's how I automated everything with Ansible — including the mistakes I made along the way."
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

Terraform handles the cloud side (Cloudflare, DNS records). Ansible handles the servers. They complement each other — this isn't a turf war.

## The Setup

### Directory Structure

```
homelab-iac/
├── ansible/
│   ├── inventory.yml
│   ├── ansible.cfg
│   ├── site.yml              # Main entry point
│   ├── group_vars/
│   │   ├── all.yml           # Variables for every host
│   │   └── docker_hosts.yml  # Docker-specific vars
│   ├── playbooks/
│   │   ├── docker-setup.yml
│   │   ├── immich.yml
│   │   ├── nextcloud.yml
│   │   ├── monitoring.yml
│   │   ├── plex.yml
│   │   └── adguard.yml
│   └── roles/
│       ├── docker/
│       ├── common/
│       └── ...
└── terraform/
    └── ...
```

### The Inventory

```yaml
# inventory.yml
all:
  hosts:
    ubu-serv-2:
      ansible_host: 10.10.37.32
      role: primary
    ubu-serv-3:
      ansible_host: 10.10.37.33
      role: monitoring
    ubu-immich:
      ansible_host: 10.10.37.34
      role: photos
    zima-ubu-serv-1:
      ansible_host: 10.10.37.31
      role: media
    mac-mini:
      ansible_host: 10.10.37.35
      role: ai
    rpi5:
      ansible_host: 10.10.37.36
      role: homeassistant

  children:
    docker_hosts:
      hosts:
        ubu-serv-2:
        ubu-serv-3:
        ubu-immich:
        zima-ubu-serv-1:
    ubuntu_hosts:
      hosts:
        ubu-serv-2:
        ubu-serv-3:
        ubu-immich:
        zima-ubu-serv-1:
```

### The Quick Win: Common Setup

This is the playbook that makes every new machine ready in 5 minutes:

```yaml
# playbooks/common-setup.yml
---
- name: Common setup for all hosts
  hosts: all
  become: true
  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes
        cache_valid_time: 3600

    - name: Install essentials
      apt:
        name:
          - htop
          - tmux
          - curl
          - git
          - python3
          - python3-pip
          - fail2ban
          - ufw
        state: present

    - name: Set timezone
      timezone:
        name: Europe/Paris

    - name: Enable UFW with defaults
      ufw:
        state: enabled
        default: deny
        direction: incoming

    - name: Allow SSH
      ufw:
        rule: allow
        port: "22"
        proto: tcp
```

Run it once, every machine gets the same baseline. No more "wait, does this one have htop?"

## The Real Power: Docker Deployments

Here's where Ansible stops being "nice" and starts being essential.

### Deploying Immich

```yaml
# playbooks/immich.yml
---
- name: Deploy Immich on ubu-immich
  hosts: ubu-immich
  become: true
  vars:
    immich_dir: /opt/immich
    immich_port: 2283
    immich_data_dir: /srv/immich

  tasks:
    - name: Ensure immich directory exists
      file:
        path: "{{ item }}"
        state: directory
        mode: '0755'
      loop:
        - "{{ immich_dir }}"
        - "{{ immich_data_dir }}"

    - name: Deploy docker-compose.yml
      template:
        src: immich/docker-compose.yml.j2
        dest: "{{ immich_dir }}/docker-compose.yml"
        mode: '0644'
      notify: restart immich

    - name: Deploy .env file
      template:
        src: immich/env.j2
        dest: "{{ immich_dir }}/.env"
        mode: '0600'
      notify: restart immich

    - name: Start Immich services
      community.docker.docker_compose_v2:
        project_src: "{{ immich_dir }}"
        state: present
        pull: always

  handlers:
    - name: restart immich
      community.docker.docker_compose_v2:
        project_src: "{{ immich_dir }}"
        state: present
        restarted: true
```

The cool part? Templates. Your `.env.j2` and `docker-compose.yml.j2` use variables, not hardcoded values. Change a port? Change it in `group_vars`, not in 3 different files.

### The Template Trick

```yaml
# templates/immich/docker-compose.yml.j2
name: immich
services:
  immich-server:
    container_name: immich_server
    image: ghcr.io/immich-app/immich-server:{{ immich_version | default('release') }}
    command: ["start.sh", "immich"]
    volumes:
      - {{ immich_data_dir }}:/data
      - /etc/localtime:/etc/localtime:ro
    env_file:
      - .env
    ports:
      - {{ immich_port }}:{{ immich_port }}
    restart: always
    networks:
      - immich_network
# ... rest of the compose file
```

Now when Immich v3 drops and changes the port again (they wouldn't dare... right?), I change one variable and re-run. No SSH. No manual edits. No "which file was that again?"

## The Master Playbook

```yaml
# site.yml
---
- import_playbook: playbooks/common-setup.yml
- import_playbook: playbooks/docker-setup.yml
- import_playbook: playbooks/immich.yml
- import_playbook: playbooks/nextcloud.yml
- import_playbook: playbooks/monitoring.yml
- import_playbook: playbooks/plex.yml
- import_playbook: playbooks/adguard.yml
```

One command to rule them all:

```bash
# Deploy everything
ansible-playbook -i inventory.yml site.yml

# Just one server
ansible-playbook -i inventory.yml -l ubu-immich site.yml

# Dry run (check mode)
ansible-playbook -i inventory.yml site.yml --check --diff
```

The `--check --diff` flags are your best friend. They show what *would* change without actually changing it. Because "just run it and see" is how production dies.

## The Mistakes I Made (So You Don't Have To)

### 1. Hardcoding Secrets in Playbooks

First week: API keys and passwords right there in the YAML. Committed to git. Pushed to GitHub.

Don't do this. Use Ansible Vault:

```bash
# Create encrypted vars file
ansible-vault create group_vars/vault.yml

# Edit it later
ansible-vault edit group_vars/vault.yml

# Run playbooks with vault
ansible-playbook -i inventory.yml site.yml --ask-vault-pass
```

### 2. Not Using `--diff`

Without `--diff`, Ansible says "changed" and you're left wondering *what* changed. With it, you see the exact before/after of every file modification.

```bash
ansible-playbook -i inventory.yml site.yml --diff
```

Add it to your `ansible.cfg`:

```ini
[defaults]
diff = true
```

Now you'll never run blind again.

### 3. Ignoring Idempotency

Early on, I wrote tasks that used `shell: docker compose up -d`. Every run showed "changed" even when nothing changed. Use the proper modules:

```yaml
# BAD - always reports changed
- name: Start containers
  shell: docker compose up -d

# GOOD - only reports changed when something actually changes
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

## What This Looks Like Day-to-Day

```bash
# Monday morning: update everything
ansible-playbook -i inventory.yml site.yml --tags update

# New service? Write a playbook, test with --check, deploy
ansible-playbook -i inventory.yml -l zima-ubu-serv-1 plex.yml

# Something broke? Re-run the playbook (idempotent, remember)
ansible-playbook -i inventory.yml -l ubu-immich immich.yml

# Check what's different across the fleet
ansible all -i inventory.yml -m setup | grep ansible_docker_version
```

No more SSH. No more manual anything. Just YAML and trust.

## The Honest Take

Ansible isn't perfect. The YAML syntax can feel verbose. Error messages sometimes read like they were written by someone who hates you personally. And yes, sometimes a quick SSH + manual fix is faster.

But for a homelab with more than 2 machines? It's the difference between maintaining infrastructure and being maintained *by* your infrastructure.

Start small. One playbook. One service. Let it grow organically. You don't need the perfect directory structure on day one — you need *something* that's not SSH and hope.

And honestly? The first time you type `ansible-playbook site.yml` and watch 6 machines configure themselves in parallel — that's the kind of stuff I live for.

---

**Already using Ansible?** I'd love to hear what your playbooks look like. Still SSH-ing into everything? Give it a shot — start with the common setup playbook above and build from there.

Now if you'll excuse me, I have some idempotence to verify. 🎭