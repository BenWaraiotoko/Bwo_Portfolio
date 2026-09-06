---
title: I Purged My Immich Duplicates. They Came Back With Friends.
date: 2026-09-06
publish: true
category: posts
tags:
  - immich
  - postgres
  - self-hosted
  - docker
  - homelab
description: 797 duplicates deleted on Monday. 1,265 of them back by Thursday. The SQL detective story of finding what was actually creating them.
---

I deleted 797 duplicate photos from my Immich library on a Monday. Felt great. Closed the terminal, made coffee, considered myself a database surgeon.

By Thursday morning, my library had grown **1,265 new duplicates**. Two hundred and eighty-five of them appeared in a single morning.

When your database regrows its own duplicates faster than you can delete them, you're not fixing anything. You're mowing.

Here's the detective story of finding what was actually creating them — because the answer was hiding in a column I'd never looked at.

## Some Context First

A while back I migrated 5,700 photos (62GB) into a fresh Immich install and [broke absolutely everything along the way](/posts/fixing-immich-installation). Since then, the library has grown to about 29,000 assets — family photos, iPhone backups, the usual digital attic.

Then one day the timeline started showing everything twice. Every photo from the phone, doubled. Immich's own duplicate detection? Silent. It saw nothing wrong.

## Act 1: The First Purge (a.k.a. Mowing the Lawn)

The duplicate signature was weird. The twins shared the same `originalPath` — literally the same file — but existed as **two separate rows** in the `asset` table.

So I did what any reasonable person does: I wrote a `DELETE` to remove the twin rows, backed everything up first, and watched the count go to zero. 797 twins gone. Timeline clean.

Three days later, 285 new ones. By the end of the week, 1,265.

Deleting rows is easy. The question that matters is: *what keeps creating them?*

## Act 2: The Column That Cracked the Case

Time to stop deleting and start reading. First query — count assets by checksum algorithm:

```sql
SELECT "checksumAlgorithm", count(*)
FROM asset
WHERE status = 'active'
GROUP BY 1;
```

Result:

```
 sha1       | 28097
 sha1-path  |  1266
```

And there it is. In Immich, **`sha1` means the file was ingested by the app** (mobile upload, web upload). **`sha1-path` means it was imported by an external library scanning a folder.**

Two different algorithms. Same files.

If you've been following: the external library scan computes a different checksum for the same photo than the app upload did. Different checksums → Immich's duplicate detection sees two *different* assets → no flag. Same `originalPath` → same file on disk, twice in the database.

One more query to confirm the overlap — same path, two rows:

```sql
SELECT count(*) FROM (
  SELECT "originalPath"
  FROM asset
  WHERE status = 'active'
  GROUP BY 1
  HAVING count(*) > 1
) t;
```

1,265 twin groups. Every single external row had an internal twin at the same path. That's not coincidence. That's a factory.

## Act 3: The Culprit

The Immich box has an external library set up — you know the drill, point a library at a folder, it scans and imports. The problem: its `importPaths` covered the **exact folder where the app uploads land** (`/data/library/admin` in my case — the default upload directory).

So every single iPhone backup got imported twice:

- once by the app, as an upload (internal row, `sha1`)
- once by the external library, as a folder scan (external row, `sha1-path`)

I had built a duplicate factory. Every backup fed it. The 797 I deleted on Monday were just the first batch of a conveyor belt.

If you're running Immich with **both** app uploads and external libraries, go check that your library's import paths don't overlap the upload folder. This is the whole article, honestly.

## The Fix (Without Burning the Library Down)

Important detail: do **not** delete the external library to fix this. In my case that library owned the internal assets too (same `libraryId` on 25,000+ rows) — deleting it would have been a catastrophe with extra steps.

The surgical fix is to empty its import paths, so the factory stops:

```sql
UPDATE library SET "importPaths" = '{}' WHERE name = 'Admin Library';
```

Then delete the twin rows — external rows that have an internal twin at the same path, keeping the app-ingested original:

```sql
DELETE FROM asset x
WHERE x."isExternal"
  AND EXISTS (
    SELECT 1 FROM asset i
    WHERE i."originalPath" = x."originalPath"
      AND NOT i."isExternal"
      AND i.status = 'active'
  );
```

Note the safety rails on this one:

- I verified every daughter table referencing `asset` was `ON DELETE CASCADE` *before* running it (`SELECT conrelid::regclass, confdeltype FROM pg_constraint WHERE confrelid = 'asset'::regclass;`)
- I counted the victims *before* deleting: exactly 1,265
- I counted the one legitimate external asset (an odd little `.mov` with no twin) and made sure the query wouldn't touch it

## Rule Zero: Three Backups Before One DELETE

You don't run a `DELETE` against your family's photo library on vibes. Before any of this:

1. **Manual `pg_dump`** of the whole database — 295MB, 108MB gzipped
2. **Copy off the server** onto another machine entirely
3. **The automatic nightly dump** on the NAS as a third net

Three copies, two machines, one trigger. Then, and only then, the transaction — with `COMMIT` happening only because the post-delete count matched the prediction exactly: 29,363 − 1,265 = 28,098 active assets.

The math either balances or you restore. There's no third option.

## Aftermath

Deleted 1,265 rows. Restarted the Immich server and microservices containers (the Redis cache still serves deleted assets until you do — that one's fun to discover). Verified:

- Twin count: **0** (and still 0 after the restart)
- One legitimate external asset: preserved
- API healthy, containers happy, timeline clean in the mobile app

And because the import path was emptied, the factory is *off*. New iPhone backups create one row each, like civilized uploads should.

One honest footnote: Immich's duplicate detection *does* work for real content duplicates — I've got about 897 groups (2,554 assets) of genuine "same photo, saved six times over the years" waiting in the admin UI. Those get a human eye and a click-through, not a SQL query. Some decisions you keep for yourself.

## The Takeaway

Deleting rows is not a fix. It's a chore with a recurrence schedule.

The actual fix was asking one better question: *who creates these rows?* — and the answer was sitting in a column called `checksumAlgorithm` that I'd never had a reason to read. `sha1-path` on a row you never imported by hand is always a library scan talking. Same file path plus different checksum algorithms is the signature of an import overlap, and no amount of purging will ever outrun it.

So yeah — if your self-hosted photo library keeps duplicating the same files, stop mowing. Find the factory.

Now if you'll excuse me, I have 897 duplicate groups to click through. Pray for my mouse.