---
title: Ollama with Claude Code
date: 2026-01-24
publish: true
category: second-brain
tags:
  - ai
  - claude-code
  - homelab
  - tools
  - ollama
  - anthropic
  - coding-assistant
  - cli
  - api
  - guide
description: This guide walks you through installing and using **Claude Code**—Anthropic’s agentic coding tool—via Ollama’s Anthropic‑compatible API.
---
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.ollama.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Claude Code

Claude Code is Anthropic's agentic coding tool that can read, modify, and execute code in your working directory.

Open models can be used with Claude Code through Ollama's Anthropic-compatible API, enabling you to use models such as `glm-4.7`, `qwen3-coder`, `gpt-oss`.

![Claude Code with Ollama](https://files.ollama.com/claude-code.png)

## Install

Install [Claude Code](https://code.claude.com/docs/en/overview):

<CodeGroup>
  ```shell macOS / Linux theme={"system"}
  curl -fsSL https://claude.ai/install.sh | bash
  ```

  ```powershell Windows theme={"system"}
  irm https://claude.ai/install.ps1 | iex
  ```
</CodeGroup>

## Usage with Ollama

### Quick setup

```shell  theme={"system"}
ollama launch claude
```

To configure without launching:

```shell  theme={"system"}
ollama launch claude --config
```

### Manual setup

Claude Code connects to Ollama using the Anthropic-compatible API.

1. Set the environment variables:

```shell  theme={"system"}
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_API_KEY=""
export ANTHROPIC_BASE_URL=http://localhost:11434
```

2. Run Claude Code with an Ollama model:

```shell  theme={"system"}
claude --model gpt-oss:20b
```

Or run with environment variables inline:

```shell  theme={"system"}
ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_BASE_URL=http://localhost:11434 ANTHROPIC_API_KEY="" claude --model qwen3-coder 
```

**Note:** Claude Code requires a large context window. We recommend at least 64k tokens. See the [context length documentation](/context-length) for how to adjust context length in Ollama.

## Recommended Models

* `qwen3-coder`
* `glm-4.7`
* `gpt-oss:20b`
* `gpt-oss:120b`

Cloud models are also available at [ollama.com/search?c=cloud](https://ollama.com/search?c=cloud).


