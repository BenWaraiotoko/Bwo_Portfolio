---
title: CLI Tricks & Power User Commands
date: 2025-12-28
description: Essential command-line tricks, shortcuts, and productivity enhancers for working efficiently in the terminal
tags:
  - linux
  - cli
  - productivity
  - cheatsheet
category: second-brain
publish: true
---
## Summary

Essential command-line tricks, shortcuts, and productivity enhancers for working efficiently in the terminal. These techniques help reduce typing, improve workflow speed, and leverage the full power of the shell.

## Key concepts

- **History manipulation**: Quickly recall and reuse previous commands
- **Keyboard shortcuts**: Navigate and edit command lines efficiently
- **Piping and redirection**: Chain commands and control output flow
- **Process management**: Control running processes and background jobs
- **Text processing**: Manipulate text streams with built-in tools

## Details

### History manipulation

**Command history navigation:**
- `!!` - Repeat last command
- `!$` - Last argument of previous command
- `!*` - All arguments of previous command
- `!n` - Execute command number n from history
- `!string` - Execute most recent command starting with "string"
- `^old^new` - Replace "old" with "new" in previous command

**History search:**
- `Ctrl+R` - Reverse search through command history
- `Ctrl+R` again - Cycle through matches
- `history | grep keyword` - Search command history

### Keyboard shortcuts

**Navigation:**
- `Ctrl+A` - Jump to beginning of line
- `Ctrl+E` - Jump to end of line
- `Ctrl+U` - Clear line before cursor
- `Ctrl+K` - Clear line after cursor
- `Alt+B` - Move back one word
- `Alt+F` - Move forward one word

**Editing:**
- `Ctrl+W` - Delete word before cursor
- `Alt+D` - Delete word after cursor
- `Ctrl+Y` - Paste previously deleted text
- `Ctrl+L` - Clear screen (same as `clear`)
- `Ctrl+C` - Cancel current command
- `Ctrl+Z` - Suspend current process

### Piping and redirection

**Output control:**
- `command > file.txt` - Redirect output, overwrite file
- `command >> file.txt` - Redirect output, append to file
- `command 2> error.log` - Redirect stderr only
- `command &> all.log` - Redirect both stdout and stderr
- `command 2>&1` - Redirect stderr to stdout

**Piping:**
- `cmd1 | cmd2` - Pipe output of cmd1 to input of cmd2
- `cmd1 | tee file.txt` - Show output and save to file
- `cmd1 && cmd2` - Run cmd2 only if cmd1 succeeds
- `cmd1 || cmd2` - Run cmd2 only if cmd1 fails
- `cmd1; cmd2` - Run both commands sequentially

### Process management

**Background jobs:**
- `command &` - Run command in background
- `jobs` - List background jobs
- `fg %n` - Bring job n to foreground
- `bg %n` - Resume job n in background
- `disown %n` - Detach job from current shell

**Process control:**
- `ps aux | grep process_name` - Find process by name
- `pgrep process_name` - Get PID by process name
- `pkill process_name` - Kill process by name
- `kill -9 PID` - Force kill process
- `top` or `htop` - Interactive process viewer

### Text processing

**Quick text manipulation:**
- `grep pattern file` - Search for pattern in file
- `sed 's/old/new/g' file` - Replace text in file
- `awk '{print $1}' file` - Print first column
- `cut -d',' -f1 file.csv` - Extract first field from CSV
- `sort file | uniq` - Sort and remove duplicates
- `wc -l file` - Count lines in file

## Examples

**Navigate to previous directory:**
```bash
cd -
```

**Create directory and enter it:**
```bash
mkdir new-project && cd $_
```

**Download file and show progress:**
```bash
wget -c URL  # or
curl -O URL
```

**Find and replace in multiple files:**
```bash
grep -rl "old_text" . | xargs sed -i 's/old_text/new_text/g'
```

**Monitor log file in real-time:**
```bash
tail -f /var/log/syslog
```

**Disk usage of directories, sorted:**
```bash
du -h --max-depth=1 | sort -hr
```

**Find large files:**
```bash
find / -type f -size +100M 2>/dev/null
```

**Extract, transform, load pattern:**
```bash
cat data.txt | grep "ERROR" | awk '{print $3}' | sort | uniq -c
```

**Quick backup of file before editing:**
```bash
cp config.yml{,.backup}
# Creates config.yml.backup
```

**Run command with timeout:**
```bash
timeout 10s command
```

## Resources

- [The Linux Command Line (book)](https://linuxcommand.org/tlcl.php)
- [ExplainShell](https://explainshell.com/) - Explain shell commands
- [ShellCheck](https://www.shellcheck.net/) - Script analysis tool
- [tldr pages](https://tldr.sh/) - Simplified man pages

## Related

- [[git]]
- [[linux-networking]]
- [[git-cheatsheet]]
- [[vim-learning-guide]]
- [[proxmox]]
- [[install-jupyterlab-vm]]
- [[fixing-immich-installation]]
