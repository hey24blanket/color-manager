# Color Manager

Local-first palette workspace, image color picker and WCAG contrast checker.

## Development

Node 24+, `npm ci`, `npm run dev`. Production: `npm run build`. Tests: `npm test`.

React/TypeScript + Vite. IndexedDB commits are atomic; independent group edits merge, same-group conflicts preserve the pending edits for export. JSON backups are portable; local browser storage is not cross-device sync. Clearing site data may erase palettes. No user image or palette data is sent to the server.

## Features

- Ten languages, country-aware initial route, explicit language dropdown.
- Grid and free canvas, groups, colors, favorites, search, pointer and menu moves.
- HEX/RGB/HSL editing and copying, JSON v5 migration and modern backup import.
- Undo/redo, snapshots, JSON/CSS/PNG download.
- Local image extraction worker and pixel picker; optional browser eyedropper.
- WCAG text contrast with unrounded pass/fail thresholds.
- 30 static localized tool pages, canonical/hreflang, sitemap, structured data, OG image.

## Deployment

Import `hey24blanket/color-manager` in Vercel; framework Vite; build `npm run build`; output `dist`; Node 24. Production branch main. `PUBLIC_SITE_URL` optionally overrides the canonical domain (default `https://color-manager-blanket.vercel.app`). `api/locale.js` uses Vercel's country header at `/` only and a manual language cookie before country. Explicit locale URLs never redirect by country.

Enable Web Analytics on the Vercel project. Client events are restricted to successful copy (`core_action`), first session save, image extraction, export initiation and explicit contrast checking. No color values, user labels, images, searches or filenames are included.

## Limits and browser behavior

50 groups, 100 colors/group, 1000 total, 5 MiB workspace; 20 snapshots/10 MiB. Image input 20 MiB/40MP, resized to 1200px for sampling. PNG export max 100 colors. sRGB opaque values only, not print proofing. EyeDropper availability varies. No remote palette storage, automatic device sync, or filesystem autosave.

Tests cover color conversion, contrast thresholds, legacy import validation, deterministic quantization, locale precedence, translation completeness, concurrent IDB merge and conflicts. Device QA and Search Console ownership are tracked separately from unit tests.
