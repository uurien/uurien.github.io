# ugaitz.info

Personal site — a visual archive of things I make outside work. Built with
[Astro](https://astro.build), deployed as a fully static site to GitHub Pages
at **www.ugaitz.info**.

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve dist/ locally
npm run check    # TypeScript / Astro diagnostics
```

## Adding a Thing

A "Thing" is one project, print, game, experiment — anything I made.

### 1. Create the file

Add a Markdown or MDX file in `src/content/things/`. The filename becomes the
URL: `src/content/things/hand-wired-keyboard.mdx` → `/things/hand-wired-keyboard`.

### 2. Put its photos next to it

Create a folder with the same name as the file and drop the photos in:

```
src/content/things/
  hand-wired-keyboard.mdx
  hand-wired-keyboard/
    cover.jpg
    wiring.jpg
    finished.jpg
```

Images in `src/` go through Astro's image pipeline: responsive sizes, modern
formats, no layout shift. Reference them with **relative paths** (`./folder/photo.jpg`).

Only use `public/` for files that must keep an exact URL (like `CNAME`).

### 3. Minimal example

```mdx
---
title: "Hand-wired keyboard"
date: 2026-06-22
description: "Built from scratch with a Raspberry Pi Pico, diodes and a lot of patience."
cover: "./hand-wired-keyboard/cover.jpg"
coverAlt: "Hand-wired keyboard with colourful wiring exposed"
tags: ["hardware"]
featured: true
---

The write-up goes here. Plain Markdown: headings, links, code, images.

![Wiring in progress](./hand-wired-keyboard/wiring.jpg)
```

### 4. Optional frontmatter

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | **Required** |
| `date` | date | **Required** — sorting + year grouping on `/things` |
| `description` | string | **Required** — the card text |
| `cover` / `coverAlt` | image / string | Card + page hero |
| `externalUrl` | url | "Visit →" link |
| `githubUrl` | url | "Source →" link |
| `tags` | string[] | First tag shows as the coloured label on the card |
| `textPosition` | enum | Where the text sits over the cover (see below) |
| `featured` | boolean | Eligible for the homepage selection |
| `draft` | boolean | Hidden from listings (still builds at its URL) |
| `gallery` | array | Extra photos rendered at the bottom of the page |

Gallery entries look like:

```yaml
gallery:
  - src: "./hand-wired-keyboard/wiring.jpg"
    alt: "Wiring in progress"
    caption: "Optional caption"
```

Prefix a filename with `_` (e.g. `_wip.mdx`) to exclude it from the build entirely.

### 5. Placing the text on the cover

The card text is always overlaid on the photo. Put it wherever the photo has
empty space with `textPosition` (default `bottom-left`):

```
top-left       top-center      top-right
middle-left                    middle-right
bottom-left    bottom-center   bottom-right
```

The darkening gradient follows the text automatically, so it only shades the
side that needs it.

The repo ships one example Thing per demonstrated position, named after it
(`bottom-left.mdx`, `top-left.mdx`, …). They all carry `example: true`, so
they never appear on the homepage or in the archive, but they stay reachable
at their own URL (e.g. `/things/bottom-left`) as a live reference. Delete them
whenever they stop being useful.

## Homepage selection

The homepage shows up to 6 Things marked `featured: true`, newest first. If
nothing is marked featured it falls back to the 6 newest. Everything ever
published stays on `/things`, grouped by year.

## Replacing the history icons

The six icons beside "About me" are configured in
[`src/config/history.ts`](src/config/history.ts) and the files live in
[`public/history/`](public/history/). To replace one, drop the real logo into
`public/history/` and point the entry at it:

```ts
{ name: 'Eurohelp', icon: '/history/eurohelp.svg' }
```

## Editing the copy

Name, bio lines, location, social links and the About text all live in
[`src/config/site.ts`](src/config/site.ts).

## Latest Activity

Bluesky posts and meaningful GitHub activity (releases, newly public repos) are
fetched **at build time** in [`src/lib/activity/`](src/lib/activity/) and baked
into the HTML — visitors' browsers never call those APIs.

If a source is unavailable the build logs a warning and simply omits that
source. An API outage never blocks a deploy.

Configurable via environment variables (all optional):

- `BLUESKY_HANDLE` — defaults to `uurien.bsky.social`
- `GITHUB_ACTIVITY_USER` — defaults to `uurien`
- `GITHUB_TOKEN` — raises the GitHub API rate limit (CI passes the built-in one)

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and
publishes to GitHub Pages on:

1. **push to `main`** — new Things, photos, copy, styling
2. **manual run** — `workflow_dispatch` from the Actions tab
3. **schedule** — `23 */3 * * *`, so Latest Activity stays fresh

No secrets to configure: the workflow uses the built-in `GITHUB_TOKEN`.
Nothing is committed back to the repo by CI.

## Archive

`archive/photos/` holds the photo galleries from the previous Hugo site. They're
kept in the repo for reference but are not part of the build.
