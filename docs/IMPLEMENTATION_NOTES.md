# Implementation Notes

Rationale for non-obvious decisions in the codebase. Code comments were
removed in favor of keeping this file up to date — update it instead of
re-adding comments when a similar decision needs explaining.

## View Transitions (page navigation)

Astro's default page-transition animation (crossfade) is disabled across the
site. During the fade, the outgoing and incoming pages overlap, which reads
as a "flicker"/dimming of the screen rather than a smooth transition.
Content swapping immediately on navigation looks more natural for this site,
so no `<ClientRouter />` crossfade is used.

## Header background

The header background is a fixed, opaque `var(--color-bg)` at all times —
it does not toggle between transparent and opaque based on scroll position.
An earlier version toggled the background via scroll detection
(`IntersectionObserver` / scroll / resize / `pageshow` listeners), which
raced against iOS Safari's address-bar collapse/expand animation and
repeatedly caused a visible empty/transparent gap at the top of the page.
Removing the toggle (and the JS driving it) entirely resolved this instead
of further patching the scroll-detection logic.

## `theme-color` meta sync

`<meta name="theme-color">` controls the iOS Safari status bar / toolbar
tint. It must be kept in sync with the page's actual background color, both:
- on first paint (inline script in `BaseLayout.astro`, before anything
  renders, using the saved/system theme), and
- whenever the theme is toggled (`initTheme()`'s `apply()` in
  `Header.astro`).

If these fall out of sync, content can visually bleed through a
mismatched status-bar color during scroll overscroll/bounce.

## Tooltip motion sensitivity

The artist-grid hover tooltip (`src/scripts/tooltip.js`) does not
initialize when `prefers-reduced-motion: reduce` is set. It's a
cursor-following tooltip with slide animations, which can be uncomfortable
for motion-sensitive users, so it's skipped outright rather than just
having its animations shortened.

## Preloader (`src/scripts/preloader.js`)

Uses `sessionStorage.getItem('preloadComplete')` to only show the loading
animation once per session (cleared on `beforeunload`), so repeat
in-session navigations don't replay the full asset-loading screen.
