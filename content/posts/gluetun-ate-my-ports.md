---
title: "When Gluetun Eats Your Ports: A VPN Container Debugging Story"
date: 2026-08-17
publish: true
category: posts
tags:
  - docker
  - vpn
  - gluetun
  - networking
  - homelab
  - debugging
description: Your VPN container is up, your services are up, and nothing works. A debugging story about Gluetun firewall and port bindings.
aliases:
  - /posts/gluetun-ate-my-ports
---

You know that feeling when everything is green and nothing works?

Yeah. That.

Last week my homelab decided to give me a free lesson in Docker networking, firewall internals, and the true meaning of the word "up." I'm still recovering. Pour yourself a coffee, this one's a ride.

## The Setup

Like anyone with a homelab and a privacy streak, I run a few services that need to reach the internet without broadcasting my home IP to every server they touch. A web monitor that pings external sites to check if they're up. A notification relay that fires webhooks to third-party services. Standard self-hosted stuff — the kind of setup that looks great in a docker-compose file and makes you feel like a sysadmin god at 2 AM.

The twist: all of that traffic goes through a VPN container. Gluetun, specifically. It acts as a network gateway — you set `network_mode: "container:gluetun"` on your services, and suddenly their outbound traffic exits through a tunnel instead of your home connection. Your ISP stops seeing every request. The services you're polling stop seeing your residential IP. Life is good.

Gluetun handles the VPN connection, the DNS, the kill switch, everything. You configure it once, you pat yourself on the back, and you forget about it for months.

Which is exactly the problem.

## The Problem

My VPN provider did maintenance. Or Gluetun updated. Or the server rebooted. Honestly, I don't remember which — the point is, Gluetun restarted.

No big deal. Containers restart all the time. That's the whole pitch. "It just works." Famous last words.

I opened my browser to check on my monitoring dashboard. Nothing. The page just... hangs. Connection timeout. I tried the notification relay's API. Same thing. Dead.

I ssh'd into the server. `docker ps`. Everything green. Monitor? Up. Relay? Up. Gluetun? Up. All running, all healthy, all absolutely unreachable from the outside world.

Cool. Cool cool cool.

## The Debugging Journey

### Stage 1: It's Docker's Fault

First instinct: restart everything. If in doubt, reboot, right? I `docker restart`'d the monitor and the relay. Waited. Tried again.

Still dead.

Okay, so it's not a stale-container thing. Good to know. Also, terrible to know, because that was my easiest theory.

### Stage 2: It's the Service's Fault

Next: check the monitor logs. Maybe it crashed on startup. Maybe the config is corrupted. Maybe there's a database lock from the reboot.

`docker logs monitor`. Clean startup. No errors. Listening on its port. Everything fine internally. The service is sitting there, fully operational, just... nobody can reach it.

It's like a restaurant with the lights on, the kitchen staff ready, and the front door bricked over.

### Stage 3: It's the VPN's Fault (But Not How You Think)

I checked the Gluetun logs. VPN connected. Tunnel up. IP assigned. DNS resolving. Everything in the Gluetun log said "I'm fine, why are you asking?"

And that's when I started to get suspicious. Because Gluetun was fine. The monitor was fine. The relay was fine. And yet.

### Stage 4: The Aha Moment

I ran `docker exec gluetun iptables -L`. And there it was.

Gluetun doesn't just connect a VPN tunnel. It runs a full firewall. iptables rules, chains, the works. By default, its firewall policy is `DROP` for everything except the VPN tunnel itself. Inbound traffic? Blocked. Unless you've explicitly told Gluetun which ports to allow.

And here's the thing: when Gluetun restarts, it recreates all its firewall rules from scratch. If you haven't declared your inbound ports in its environment variables, it starts up with a firewall that says "no" to everything.

It doesn't matter that your service is running. It doesn't matter that the port is bound. The packets never reach the container. Gluetun's firewall eats them before they get there.

You've been telling Gluetun about your ports this whole time, right? ...Right?

### The Fix (Part 1)

One environment variable:

```
FIREWALL_VPN_INPUT_PORTS=8080,8081
```

That's whatever your services listen on — your monitor's web UI on 8080, your relay's API on 8081, whatever else you need through the tunnel. Add it to your Gluetun container's environment, restart, and your ports come back to life.

I did that. Restarted. Tried the dashboard.

It worked.

I felt like a genius for about forty-five seconds.

## The Second Problem

Then Gluetun restarted again. And everything broke again.

Same symptoms. Same green Docker statuses. Same dead ports. I checked iptables — the rules were there this time. The ports were declared. What now?

Here's what: a race condition.

When Gluetun restarts, it doesn't set up its firewall instantly. It takes a few seconds. First it connects to the VPN, then it writes the firewall rules. There's a window — maybe two seconds, maybe five — where the firewall is wide open.

Now, if your services start during that window, they bind their ports just fine. The port is open, the container is listening, everything looks great. Then Gluetun finishes initializing, the firewall kicks in, and... your port bindings are gone. Not gone from Docker's perspective — the container is still listening. But from the network's perspective, the door just slammed shut.

Docker says up. The container says up. The port says up. The firewall says no.

### The Fix (Part 2)

You need ordering. The services behind Gluetun should only start after Gluetun's firewall is fully configured, not just after the container is "running."

**Option A: `depends_on` with a healthcheck.** Gluetun supports a Docker healthcheck. If you set up `depends_on` with `condition: service_healthy` on your dependent containers, they won't start until Gluetun reports healthy — which means the firewall is in place.

```yaml
services:
  gluetun:
    image: qmcgaw/gluetun
    healthcheck:
      test: ["CMD", "/gluetun-entrypoint", "healthcheck"]
      interval: 10s
      timeout: 5s
      retries: 3

  monitor:
    depends_on:
      gluetun:
        condition: service_healthy
```

**Option B: A watchdog script.** If you can't use `depends_on`, write a small script that checks Gluetun's health endpoint before allowing dependent services to restart. Poll the healthcheck, wait for green, then restart the service. Cron it or wrap it around your update process.

Either way: don't let services bind ports while the firewall is still mid-construction. You'll get a port binding that exists in Docker's ledger and nowhere else.

## The Lesson

Docker says `Up`. That word does not mean what you think it means.

"Up" means the process is running. It does not mean the port is reachable. It does not mean the network path is clear. It does not mean the firewall isn't eating your packets for breakfast.

A VPN container with a built-in firewall is a black box. It looks like one service, but it's actually two: the tunnel and the firewall. They don't come up atomically. There's a window where one is ready and the other isn't, and if you're unlucky — or if you just restarted at the wrong moment — your services will bind into that window and get silently firewalled a second later.

So: declare your ports. Healthcheck your gateway. Order your startups. And next time Docker says everything is "Up," remember that "Up" is a statement about process state, not a statement about reality.

The firewall doesn't care about your Docker status. The firewall cares about its rules. And if you didn't tell it yours, it already decided you don't need them.