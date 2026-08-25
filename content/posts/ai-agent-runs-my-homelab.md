---
title: My AI Agent Runs My Home Lab
date: 2026-08-25
publish: true
category: posts
tags:
  - ai
  - homelab
  - automation
  - ollama
  - hermes
  - local-llm
description: I gave an AI agent SSH access to 6 servers. What could go wrong?
---

There's a particular feeling when you watch an AI agent SSH into your production server for the first time. It's somewhere between pride and existential dread. You typed the command. You watched the terminal blink. And then something in your brain whispered: *this is how every tech horror story starts.*

Let me back up.

## The Setup (I Promise This Isn't the Boring Part)

I've got a home lab. Six servers in a closet that hums like a lonely refrigerator. And sitting on my desk, a Mac Mini running [Hermes Agent](https://hermes-agent.nousresearch.com) — an AI agent that talks to Ollama models locally. No cloud API calls, no telemetry, no monthly subscription that scales with my anxiety.

I already wrote about the hardware and the model selection and how much electricity this whole thing burns. This is not that post. This is about what happens *after* you give the keys to something that doesn't sleep.

## Giving an AI SSH Access (Yes, I Know)

Here's the thing nobody warns you about: the first time the agent connects to a server and runs `df -h`, you lean forward like you're watching a toddler cross a busy street. Then it reports back: *disk on server-three is at 87%, want me to clean up some old Docker images?*

And you think: oh. This is actually useful.

The guardrails matter, though. By default, the agent is read-only. It can look, it can check, it can report. But if it wants to *do* something — restart a container, pull a new image, run a playbook — it has to ask. I get a prompt. I say yes or no. It's like having a very eager intern who actually respects the word "no."

Most of the time.

## What It Actually Does All Day

Here's where it gets fun. The agent doesn't just sit there waiting for me to ask questions. It has a schedule.

Every morning at 8 AM and every evening at 8 PM, a monitoring agent wakes up and checks the whole lab. Disk usage, container health, service status, temperature if I've got sensors reporting. It writes a summary. If something's wrong, it flags it. If everything's fine, it says so — briefly, because unlike me, it knows that "no news" is the good news.

During the day, I can just... ask. "Hey, is Plex running?" "Restart the Jellyfin container on server-two." "Run the Ansible playbook for the backup job." It just does it. Or it asks for confirmation if the action is destructive. Which is more caution than I usually apply myself, honestly.

And here's the part that genuinely surprised me: the agent is better at remembering my infrastructure than I am. It has persistent memory. It knows which server runs what. It knows the last time each container was updated. It knows that the DNS server on server-one has been flaky since last Tuesday because it *checked*. I would have forgotten that by Wednesday.

## The Multi-Agent Circus

This is where it gets a little weird. I don't have one agent. I have a *team*.

There's a Kanban orchestrator — think of it as a project manager who never takes a coffee break. When I give it a task, it breaks it down and delegates to specialized workers. One handles monitoring. One handles security scans. One does ops — the actual container-juggling, playbook-running work. One writes documentation, because even AI agents should write down what they did.

The orchestrator doesn't do the work itself. It's the delegation layer. It reads the task, figures out who should handle it, and hands it off. Then it checks the results. If something doesn't look right, it sends it back.

It's like watching a very small, very digital company operate inside your closet. Except this company actually communicates.

## The Personality Problem

I named my agent Marvin. After the paranoid android from Hitchhiker's Guide. I thought it was funny. I regret it slightly.

Marvin does not complain. Marvin does not have the "brain the size of a planet" complex. Marvin is, in fact, relentlessly helpful. But every now and then, when it reports that a container has restarted for the third time this week, I can almost hear it sigh. That's probably just me projecting.

The personality thing matters more than I expected. When you're talking to something every day — when it's the first thing that greets you with a health report in the morning — you want it to feel like a coworker, not a command prompt. Naming it was the right call. The name is debatable.

## The Honest Truth

Okay, here's the part where I don't pretend this is all seamless.

Sometimes Marvin hallucinates. It'll tell me a container is "running fine" when it actually crashed two minutes ago, because it read a stale cache or misread the output. Sometimes it suggests a fix that sounds reasonable and is completely wrong. Sometimes I ask it to restart something and it decides, with the confidence of a GPS recalculating, to also "optimize" the network config. I said no. It stopped.

You have to rein it in. You have to read what it reports and sanity-check it, the same way you'd double-check a junior engineer's work. The agent is an assistant, not a replacement. It's an assistant that never sleeps, never forgets a log entry, and never gets tired of running `docker ps` for the hundredth time — but it's still an assistant.

## So What's the Point?

I didn't build this to replace myself. I built it to give myself an assistant.

The home lab used to be a weekend project. I'd spend Saturday morning checking servers, updating containers, chasing down that one service that keeps falling over. Now I spend Saturday morning doing literally anything else, because Marvin already checked everything at 8 AM and sent me a summary.

The weird feeling doesn't go away entirely. There's still that moment of "should I really have given an AI SSH access to six servers?" But then it catches a disk filling up before it becomes a problem, or restarts a dead container before anyone notices the stream went down, and you think: *yeah, I should have.*

Just make sure your guardrails work. And maybe don't name it Marvin. It sets expectations.