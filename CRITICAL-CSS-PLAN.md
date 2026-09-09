# Critical CSS Inlining — Implementation Plan

## Problem

Lighthouse flags `Layout.css` and `index.css` as render-blocking resources. In
practice, this means the browser must download and parse these external
stylesheets before it can paint anything — including the Header and Hero,
which are the only things a real user ever sees on first load without
scrolling. Until those files arrive, the page either paints unstyled (FOUC)
or not at all, and once they do arrive, above-the-fold content can visibly
shift/snap into its final styled layout.

The goal: make the first paint of Header + Hero (and, per-page, whatever else
is always visible above the fold) correct from the very first frame, without
giving up the caching benefits of our external, hashed, shared stylesheets.

We are **not** trying to remove or rewrite the external CSS files. We are
duplicating a small, bounded subset of their rules inline so the browser
doesn't need to wait on them for the first paint.

---

## Step 1 — Packages

Everything here operates on already-built output (`dist/`), as a post-build
script run after `astro build`. Needed devDependencies:

- `postcss` — parse the built CSS into an AST.
- `postcss-selector-parser` — break each rule's selector into its component
  tokens (classes, tags, ids, attributes) for matching. Don't hand-roll this
  with regex — combinators, pseudo-classes, and attribute selectors make
  naive string matching unreliable.
- `node-html-parser` (or `linkedom`) — parse the built HTML, walk the DOM
  under `[data-critical]`, collect tokens.
- `sass-embedded` — already a devDependency, not newly needed.

No changes to `astro.config.mjs` or the Vite/SCSS pipeline itself.

---

## Step 2 — Mark critical regions, collect classes per page

Add a `data-critical` attribute directly on the root element(s) of whatever
is always visible above the fold. For the homepage that's `Header` and
`Hero`. Other pages (recipe/blog detail) will have their own critical
regions and will need the attribute added there too — this is a per-page
concern, not a global one.

For each built HTML file:
1. Find all `[data-critical]` elements.
2. Walk every descendant and collect:
   - class names
   - tag names (needed for bare-element rules, see Step 3)
   - **Astro's scoped attribute**, e.g. `data-astro-cid-xxxxxxx` — Astro
     compiles scoped `<style>` rules as `.foo[data-astro-cid-hash]`, so the
     attribute itself must be in the collected token set or every scoped
     component style (Header.scss, Hero.scss, Text.scss, …) will silently
     fail to match anything in Step 3.

This gives one "critical token set" per HTML page.

---

## Step 3 — Match and collect CSS rules

Parse the built CSS with `postcss` + `postcss-selector-parser`. For every
rule, split its selector into tokens and check whether those tokens are a
subset of the page's critical token set collected in Step 2. If so, keep the
rule.

Explicitly excluded for now (approved simplification, revisit later):
- interaction states — `:hover`, `:focus`, `:focus-visible`, `:active`, etc.
- transition/animation-only concerns tied purely to state changes

We still need normal element-selector overrides — bare-tag rules like
`img`, `a`, `h1`, resets/defaults that aren't tied to a class. These won't be
caught by class matching, so element selectors need their own pass (match by
tag name against the collected tag-name set from Step 2, and always include
truly global rules such as `:root`, `html`, `body`, `*`, `@font-face`, and
any `@keyframes` referenced by a matched `animation` declaration — none of
these are reachable through class matching but are needed for a correct
first paint regardless).

Other matching notes:
- `@media` blocks must be preserved as wrapping context when a nested rule
  matches — otherwise responsive Grid/Cell/Flex behavior breaks at
  breakpoints.
- A comma-separated selector list shares one declaration block — if *any*
  branch matches, keep the whole rule rather than trying to split it.
- Bias toward over-inclusion. Approximate cost is ~10 KB/page, which is
  acceptable. Missing a rule causes a visible flash; an extra unnecessary
  rule costs a few bytes.

---

## Step 4 — Inline before the external stylesheet loads

1. Insert the collected CSS as one `<style>` block in `<head>`, placed
   **before** the external `<link>` tag(s). Since content is duplicated
   identically, cascade order between the two doesn't change what's
   rendered — but keeping the external file "later" means it remains the
   tiebreaker of record if the two ever accidentally diverge.
2. Convert the external stylesheet `<link>` itself to non-blocking, e.g.:
   ```html
   <link rel="preload" href="/_astro/Layout.HASH.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
   <noscript><link rel="stylesheet" href="/_astro/Layout.HASH.css"></noscript>
   ```
   This step is required — inlining critical CSS alone does not stop
   Lighthouse from flagging the external `<link>`, since the audit flags
   the blocking resource itself, regardless of what's duplicated inline.
3. Do not touch, rewrite, or remove the external CSS files. Same filenames,
   same bytes, same cache lifetime as today.

---

## Notes / things not to lose track of

- This script only ever reads/writes already-built files in `dist/`. Source
  `.scss`/`.astro` files are untouched.
- Runs once per `astro build`, not per request — matching cost against
  build-time budget is a non-issue at current scale.
- Per-page critical sets will differ once detail pages get their own
  `data-critical` regions — this isn't a single global critical bundle.

---

## Notice: unused CSS still needs a separate pass

We still need to filter out dead classes from `layout.scss`/`utils.scss` —
i.e., collect every class actually used across all built HTML pages, and if
a class defined in the compiled CSS never appears anywhere in the built
output, it shouldn't ship in the CSS file at all. This is a separate concern
from critical-CSS inlining above (it prunes the *external* files rather than
duplicating a subset of them inline).

Open problem to figure out later: dynamically added classes (via GSAP
animations, JS toggles, `Icon`/state-driven components, etc.) won't appear
in the static built HTML, so a naive "not found in dist → delete" pass would
break them. Needs a safelist/allowlist strategy before this is safe to
automate.
