import Lenis from 'lenis';
import { gsap } from "gsap";

export const initSmoothScrolling = () => {
  document.addEventListener("astro:before-swap", event => {
    if (window.location.hash || event?.direction === "back") return;
    const newDocEl = event?.newDocument?.documentElement;
    if (newDocEl) newDocEl.scrollTop = 0;
  });

  document.addEventListener("astro:after-swap", event => {
    if (window.location.hash) return;
    if (event?.direction === "back") return;
    window.scrollTo(0, 0);
    const lenis = /** @type {any} */ (window).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({ lerp: 0.15 });

  /** @type {any} */ (window).__lenis = lenis;

  gsap.ticker.add(time => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
};
