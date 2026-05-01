import Lenis from 'lenis';
import { gsap } from "gsap";

export const initSmoothScrolling = () => {
  const lenis = new Lenis({ lerp: 0.15 });

  // Header 등 다른 컴포넌트에서 Lenis 이벤트를 구독할 수 있도록 전역 노출
  /** @type {any} */ (window).__lenis = lenis;

  gsap.ticker.add(time => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
};
