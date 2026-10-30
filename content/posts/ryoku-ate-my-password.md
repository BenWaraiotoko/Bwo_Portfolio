---
title: Ryoku Ate My Password — Twice
date: 2026-10-30
publish: true
category: posts
tags:
  - linux
  - arch
  - ryoku
  - debugging
  - lockscreen
description: Two installs of a three-day-old distro, two lockouts with the password I set myself. The issue tracker explained everything — after I stopped reinstalling and started reading.
aliases:
  - /posts/ryoku-ate-my-password
---

So here's the thing — I installed my new Linux distro, set a strong password during the installer, opened it with confidence. And the lockscreen refused it.

So I reinstalled. Set the password again, more carefully this time, watching every keystroke like a cat watching a laser pointer.

The lockscreen refused it again.

Same machine, same password policy, same failure. Two clean installs of [Ryoku](https://ryoku.dev) — the indie Arch desktop I [left Omarchy for last week](/posts/leaving-omarchy) — and I'm locked out of a machine I personally configured. Twice.

This is the story of why that happened, what the issue tracker knows that the installer doesn't tell you, and the 60-second diagnostic I should have run *before* pressing reinstall the second time.

(There's an ending, too: the third install took. But I'm getting ahead of myself.)

## First suspect: me

Let's be honest about the hierarchy of blame. When a password fails, the odds say it's you: finger slip, muscle memory, NumLock, that one character you always type in the wrong layer. I've been typing passwords since before some Ryoku contributors were born (probably).

But here's the thing about human error: it's *random*. Different sessions, different moods, different typing rhythms — you'd expect occasionally correct inputs. What I had was the opposite: **a deterministic, perfectly reproducible failure across two independent installs.**

A bug you can't reproduce is an anecdote. A bug that reproduces twice with different typing moods is a bug report — and mine was one, being filed in real time against myself.

## Where I went wrong: I deleted the evidence

The second install was my actual mistake.

Reinstalling *feels* productive — fresh state, clean slate, surely it'll work this time. But every reinstall wiped the one thing debugging needs: the crime scene. What keyboard layout was the shell actually in? What the lockscreen did with my keystrokes? Whether NumLock was on, whether the layout was captured at install time in a different language?

Deleted. Twice. On purpose. By me.

The uncomfortable lesson: **diagnose before reinstalling.** The reinstall costs fifteen minutes. The diagnosis costs sixty seconds. I spent thirty doing the expensive one, twice.

## The 60-second playbook I should have run

Here it is, for the next person locked out of Ryoku (or really, any homegrown-shell distro) at boot:

**1. The A-test.** At the lockscreen, type `a` in whatever field takes text. Watch what appears. If a `q` shows up, your shell is running a QWERTY layout while your fingers type AZERTY — the classic physical-key swap, before you're even logged in. [#224](https://github.com/Ryoku-dev/ryoku/issues/224) reported exactly this shape: a US keyboard layout *on the greeter screen, before login*.

**2. The NumLock test.** Type a letter that sits on a numpad column. If it produces a digit, NumLock is forced on — and your password is being silently mutated. This one has its own fan club: [#177](https://github.com/Ryoku-dev/ryoku/issues/177) and [#321](https://github.com/Ryoku-dev/ryoku/issues/321), "Lockscreen forced numlock".

**3. The TTY escape.** `Ctrl+Alt+F2`. Log in at a real console prompt — no greeter, no shell, no Opinions between you and PAM. If the TTY accepts your password, your credentials are fine and your problem lives entirely in the lockscreen layer. If the TTY refuses it too, *now* you reinstall with confidence.

**4. The re-key trick.** If the installer captured your password under a different layout, the corruption is deterministic in a useful way: type the same physical keys as your QWERTY positions and the lock may open. It's a weird feeling — your password unlocking with the *wrong* password — and it tells you precisely which layer lied to you.

## Reading the receipts

After the second failure I finally did what I should have done first: searched the Ryoku issue tracker. Guess how many issues match "password".

Thirty-three.

Not a pile of one-off typos — a *family*. Walking the timeline like a crime novel:

- **Sep 11–22**: the foundation years. [#177](https://github.com/Ryoku-dev/ryoku/issues/177) (NumLock), [#224](https://github.com/Ryoku-dev/ryoku/issues/224) (US layout at the greeter before login), and [PR #239](https://github.com/Ryoku-dev/ryoku/pull/239) — fingerprint and password run as *parallel PAM conversations*, which is exactly the kind of race where a typed password gets swallowed mid-entry. The release notes called it that verbatim.
- **Sep 23**: [#243](https://github.com/Ryoku-dev/ryoku/issues/243) — the lockscreen loops red fingerprint failures forever when `fprintd` holds a stale claim after suspend/resume.
- **Oct 19**: [PR #461](https://github.com/Ryoku-dev/ryoku/pull/461) — *"[global] lockscreen: back off when PAM fails before prompting"* — a polite way of saying the lockscreen sometimes didn't stop asking.
- **Oct 26**: the two big ones, reported and closed *that same day*: [#581](https://github.com/Ryoku-dev/ryoku/issues/581) — the Orbital lockscreen's digits render **behind the password box**, so your PIN input is visually lying to you — and [#596](https://github.com/Ryoku-dev/ryoku/issues/596) — *"[bug] Session leak: qylock loops on dead logind sessions → stacked lock screens + black screen on VT return"*. Stacked lock screens that refuse the correct password. Read that again. It's my weekend, described by a stranger, in a bug title.

See the pattern? Authentication in Ryoku doesn't go through a battle-tested greeter stack. It lives inside the homegrown Quickshell shell — qylock, Orbital, Shima — which runs *its own* PAM conversations, its own input handling, its own rendering of what you typed. New code, security boundary, ten days of public life. Of course that's the busiest bug family in the tracker. And it's precisely the layer you meet when you have zero local tools to help yourself.

## The dev is faster than my reinstall

Here's where this story stops being a complaint and starts being a compliment.

Issues #596 and #581 were closed within roughly a day of being reported. The [1.6.0 unstable release](https://github.com/Ryoku-dev/ryoku/releases) shipped a few hours later carrying the fixes almost verbatim: *"Orbital's dial and numbers cross the password pill again"* and *"Repeated locking no longer stacks clients for expired sessions."* If English could blink knowingly, those changelog lines would be blinking at me.

But note which line got them: **unstable**. The stable line — 1.0.0 cut October 24, then 1.0.3 (Oct 25), 1.0.4 (Oct 25 evening), 1.0.5 (Oct 26, the current stable) — doesn't have them yet. `ryoku update` will hand you 1.0.5, not the fix. On a solo project moving this fast, the gap between "fixed" and "fixed in stable" is measured in days, and day-one adopters live inside that gap.

Two honest options from there:

- Run `ryoku update` and land on the latest stable — the right move if my failure was the layout/NumLock family (mostly patched pre-1.0), less so if it's the #596/#581 pair.
- Or wait for the next stable cut that absorbs the 1.6.0 fixes. Boring. Correct. The kind of advice that is useless mid-lockout and gold afterwards.

Meanwhile the beta line had this fight before: 0.73.5-beta.20 (September 25) shipped *"a fresh install with a non-default keyboard layout now materializes its config instead of coming up bare"* — which tells you the install-time layout bug family has a history of coming back for encores.

## Epilogue: the third install

How does a story like this end? The evening of October 26, around nine, I ran the install a third time. This one took. The lockscreen greets my password like an old friend, the machine boots like a civilized distro, and by the end of the evening I was already laying down my post-install layer — packages, dotfiles, the whole declarative furniture set.

Which version am I on? 1.0.5 — the stable line as of that evening, cut the same morning at 03:17, so the install media was hours old, not days. And no, there is no 1.0.6: the stable line stops at 1.0.5 and the numbers jump straight to the 1.5/1.6 unstable line — which is why "am I on 1.0.5 or 1.0.6" is a real sentence I said out loud the next morning, and why takeaway #4 exists.

Why did the third install work when the first two refused me? I'd love to tell you. I can't — the second reinstall deleted the evidence, and the third one didn't come with an autopsy. What I can tell you is the timeline: 1.0.5 landed hours before my last attempt, the greeter family had been under active surgery all week, and my lockscreen luck improved in direct proportion to how fresh the ISO was. Correlation isn't causation — but at nine in the evening, with a laptop that finally unlocked, I wasn't asking follow-up questions.

## The takeaway

1. **Diagnose before you reinstall.** The reinstall deletes your only evidence. Sixty seconds of A-test, NumLock check and TTY escape answer more than a second install ever will — and the A-test alone tells you which *layer* is lying.
2. **The greeter is a translation layer with opinions.** It captures, renders and races your inputs in its own code. Trust the TTY; distrust the shell — *especially* one younger than the milk in your fridge.
3. **On a brand-new distro, the issue tracker is part of the installer.** Searching "password" before my second install would have saved me thirty minutes and a small existential crisis. Thirty-three hits is not a fluke, it's a map.
4. **Know which line you're on.** Stable and unstable in a fast-moving solo distro are different products wearing the same name. Check which fixes are in *your* branch before deciding whether the bug is real, fixed, or just not shipped yet.

And Ryoku itself? Still the distro I chose on purpose. Different values in the defaults, solid values in the engineering — and an issue tracker that closes auth bugs in hours. I can live with a lockscreen that had a rough childhood. I'd have trouble forgiving one that never grew up.

*If you're locked out right now: start with the TTY test. Then read the tracker. Then — and only then — reinstall.*

---

## Related

- [[leaving-omarchy]]
- [BWO-Ryoku-AutoSetup](https://github.com/BenWaraiotoko/BWO-Ryoku-AutoSetup)

**Resources:**
- [Ryoku releases](https://github.com/Ryoku-dev/ryoku/releases)
- [Issue search: password](https://github.com/Ryoku-dev/ryoku/issues?q=password)