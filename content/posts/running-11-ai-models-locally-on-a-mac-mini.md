---
title: Running 11 AI Models Locally on a Mac Mini (No, I Won't Pay per Token)
date: 2026-05-26
publish: true
category: posts
tags:
  - homelab
  - ai
  - ollama
  - local-llm
  - macos
description: Cloud APIs are great until you see the bill. Here's how I run 11 models locally on an M2 Pro — including a vision model and an agent that manages my lab.
---

So here's the thing about cloud AI: it's fast, it's convenient, and one day you check your API usage and realize you've spent €47 on tokens for a script that summarizes your grocery lists.

That was me. So I bought a Mac Mini M2 Pro and decided to run everything locally.

No, I'm not rich. Yes, the Mac paid for itself in API savings within two months. Let me show you how.

## Why Local AI in a Home Lab?

Three reasons:

1. **Cost** — After the hardware investment, inference is free. Forever.
2. **Privacy** — My data stays on my network. No API logs, no training on my prompts.
3. **Latency** — No network round-trip. Models respond in milliseconds, not seconds.

And one bonus reason that surprised me: **reliability**. When your internet goes down (and it will), your local models don't care.

## The Hardware

| Component | Spec |
|-----------|------|
| Machine | Apple Mac Mini M2 Pro |
| CPU | 12-core (8 performance + 4 efficiency) |
| RAM | 32GB unified memory |
| GPU | 19-core Metal |
| Storage | 512GB SSD |

The key spec: **32GB unified memory**. This is what makes it all work. Apple's unified memory means the GPU and CPU share the same memory pool — models load once and both can access them. No VRAM bottleneck like on traditional GPUs.

Total power draw: ~15W idle, ~50W under heavy inference. My electricity meter has stopped complaining.

## The Stack: Ollama

[Ollama](https://ollama.ai) is the simplest way to run LLMs locally. One binary, one command, models just work.

```bash
# Install
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull qwen3.5

# Run it
ollama run qwen3.5
# >>> Tell me about homelabs
# (instant response, no API key needed)
```

That's it. No Docker, no Python environments, no dependency hell. Just a binary and some model files.

## The Models

Here's what I'm running and why:

| Model | Size | Why I Keep It |
|-------|------|---------------|
| qwen3.5 | 6.6GB | Daily driver. Fast, smart enough for most tasks |
| mistral-small3.2 | 15GB | When I need better reasoning. Slower but worth it |
| qwen2.5:14b | 9.3GB | Alternative general-purpose model |
| qwen2.5-coder:14b | 9.3GB | Code-specific. Better at programming tasks |
| llama3.1:8b | 4.9GB | Meta's model. Good baseline for comparison |
| qwen3:4b | 2.4GB | Lightweight. Runs on literally anything |
| devstral-small-2 | 8.2GB | Mistral's coding model |
| gpt-oss:20b | 12GB | Experimental. For when I'm feeling adventurous |
| moondream | 1.7GB | Vision model. Can "see" images |
| gemma4:12b | 7.6GB | Vision + text. My go-to for image analysis |
| nomic-embed-text | 274MB | Embedding model. Powers RAG and search |
| bge-m3 | 1.2GB | Multilingual embeddings. French-friendly |
| glm-ocr | 800MB | OCR specialist. Reads screenshots and docs |

**Total disk usage: ~70GB.** Fits comfortably on the 512GB SSD alongside everything else.

### The Strategy

You don't need 11 models. You need 3:

1. **A fast general model** (qwen3.5 or qwen3:4b) — for quick questions, summaries, everyday tasks
2. **A strong reasoning model** (mistral-small3.2 or qwen2.5-coder:14b) — for code, analysis, complex tasks
3. **A vision model** (gemma4:12b or moondream) — for image analysis

The rest are for experimentation. Which is the whole point of a home lab.

## The Real Magic: Hermes Agent

Here's where it gets interesting. I don't just chat with models — I have an agent that uses them.

[Hermes Agent](https://hermes-agent.nousresearch.com/) is an AI assistant that runs locally and can:
- Execute shell commands on my servers
- Manage Docker containers
- Read and write files
- Control my smart home via Home Assistant
- Write and deploy Ansible playbooks
- Schedule recurring tasks (cron jobs)
- Remember things across sessions

And it does all this using my local Ollama models. No API keys. No cloud dependency.

### The Setup

```yaml
# In Hermes config
model: qwen3.5:397b  # Main model (cloud for complex tasks)
auxiliary:
  vision: gemma4:12b        # Image analysis
  compression: mistral-small3.2  # Summarizing long outputs
  skills_hub: qwen3:4b      # Quick skill lookups
  approval: qwen3:4b        # Safety checks
```

Hermes routes tasks to the right model. Vision tasks go to gemma4. Code review goes to qwen2.5-coder. Quick lookups use the lightweight qwen3:4b. Complex reasoning hits the big model.

Pretty neat, right? It's like having a team of specialists, all running on hardware I own.

### What It Actually Does

Here's a real example. Last week:

```
Me: "Check disk usage on all servers and warn me if anything is above 80%"

Hermes: SSH'd into 6 servers, ran df -h, parsed the output, 
        found ubu-immich at 82%, and sent me a notification.
        Total time: 8 seconds.
```

Another one:

```
Me: "Update Plex on the ZimaBoard"

Hermes: SSH'd into zima-ubu-serv-1, pulled the new Plex image, 
        restarted the container, verified it was responding, 
        and reported success.
```

All local. All private. All mine.

## The Numbers: Local vs Cloud

Let's do the math. I use these models approximately:

| Model | Daily requests | Cloud equivalent cost | Monthly (cloud) |
|-------|---------------|----------------------|-----------------|
| qwen3.5 (general) | ~200 | $0.002/1K tokens | ~€24 |
| mistral-small3.2 (reasoning) | ~50 | $0.008/1K tokens | ~€18 |
| gemma4:12b (vision) | ~30 | $0.005/1K tokens | ~€6 |
| Embeddings | ~100 | $0.0001/1K tokens | ~€2 |

**Cloud total: ~€50/month.**

My Mac Mini M2 Pro cost €1,400. It paid for itself in 7 months. Everything after that is free inference.

## The Honest Limitations

Let me be real. Local AI is not a perfect replacement for cloud:

1. **No GPT-4/Claude-level reasoning** — The best local models are good, but they're not frontier. Complex reasoning tasks still benefit from cloud models.

2. **Memory limits** — 32GB is a lot, but you can't run a 70B parameter model at full speed. Quantized models trade quality for size.

3. **No multimodal magic** — Local vision models work, but they're not GPT-4V. Don't expect to analyze complex diagrams perfectly.

4. **Setup friction** — Ollama is simple, but orchestrating multiple models with an agent takes work. It's not "sign up and go."

But for 90% of what I actually do? Local is enough. More than enough.

## Quick Start: Run Your First Local Model

```bash
# 1. Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Pull a model (start small)
ollama pull qwen3:4b

# 3. Chat
ollama run qwen3:4b
# >>> Write a haiku about Docker containers
# Layers stacked with care,
# Images wait in the dark,
# Compose brings them life.

# 4. Try a bigger model
ollama pull mistral-small3.2
ollama run mistral-small3.2

# 5. API mode (for scripts and agents)
ollama serve  # Already running if you installed it
curl http://localhost:11434/api/generate -d '{
  "model": "qwen3:4b",
  "prompt": "Explain VLANs in one paragraph"
}'
```

That's it. You're running AI locally. No API key. No credit card. No usage limits.

## What I Learned

- **Start with one model** — Don't download 11 at once. Pick qwen3:4b or llama3.1:8b and learn how you actually use it.
- **RAM is king** — More RAM means bigger models means better output. 16GB minimum, 32GB comfortable, 64GB dreamy.
- **Quantization is your friend** — Q4_K_M quantized models are 60% smaller with maybe 5% quality loss. The tradeoff is worth it.
- **Use a model router** — Don't use a 14B model for a yes/no question. Route tasks to appropriately-sized models.
- **Local AI + agent = superpower** — Chatting with a model is fun. Having an agent that uses models to manage your infrastructure is a game changer.

---

**Running local models?** I'd love to hear what hardware you're using and which models you keep coming back to. Still paying per token? Grab a Mac Mini and pull qwen3:4b — you'll see the difference in 5 minutes.

Now if you'll excuse me, I have some embeddings to index. 🧠