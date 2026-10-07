import Lenis from 'lenis';
import { gsap } from "gsap";

export const initSmoothScrolling = () => {
  // 모션 민감 사용자는 관성(lerp) 스크롤 자체가 멀미를 유발할 수 있어 아예 초기화하지 않음 —
  // Lenis가 없으면 브라우저 네이티브 스크롤로 자동 폴백됨 (Footer 등에서 window.__lenis 존재 여부로 분기)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({ lerp: 0.15 });

  // Header 등 다른 컴포넌트에서 Lenis 이벤트를 구독할 수 있도록 전역 노출
  /** @type {any} */ (window).__lenis = lenis;

  gsap.ticker.add(time => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
};
