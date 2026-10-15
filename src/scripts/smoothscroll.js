import Lenis from 'lenis';
import { gsap } from "gsap";

export const initSmoothScrolling = () => {
  // 스크롤을 많이 내린 상태에서 다른 페이지로 이동하면, 그 스크롤 위치를 그대로 유지한 채
  // 넘어가는 문제가 있었음. 새 페이지(뒤로가기 제외)로 넘어갈 때마다 맨 위로 리셋하는데,
  // 두 단계로 나눠서 처리함:
  // 1) before-swap: 교체되기 "전" 새 문서 자체의 scrollTop을 미리 0으로 set — 실제 화면에
  //    붙기 전에 이미 맨 위 상태라, 이전 페이지의 스크롤 위치가 잠깐이라도 보이는 걸 원천 차단
  // 2) after-swap: Lenis가 들고 있는 내부 타깃도 0으로 맞춰야, 다음 raf에서 이전 타깃(예: 1008)으로
  //    되돌리려 들지 않음 — 안 그러면 네이티브 스크롤은 0인데 Lenis가 몇백 ms 뒤에 다시 과거
  //    위치로 "정정"하면서 오히려 역순으로 깜빡이는 현상이 생김
  // 해시 링크(About의 #contact-intro 등)는 각 페이지 스크립트가 원하는 위치로 스크롤하므로 제외
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
