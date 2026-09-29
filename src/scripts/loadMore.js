// 목록 그리드 공통 "더보기" — data-load-more="N" 값만큼만 먼저 보여주고,
// 옆의 [data-load-more-btn]을 누르면 나머지를 한 번에 펼침 (실제 페이지네이션 없이 클라이언트에서 토글)
function initLoadMore() {
  document.querySelectorAll("[data-load-more]").forEach(grid => {
    if (grid.dataset.lmInitialized) return;

    const initial = parseInt(grid.dataset.loadMore, 10) || 12;
    const items = Array.from(grid.children);
    const btn = grid.nextElementSibling;

    if (!(btn instanceof HTMLElement) || !btn.hasAttribute("data-load-more-btn")) return;

    if (items.length <= initial) {
      btn.classList.add("lm-hidden");
      grid.dataset.lmInitialized = "true";
      return;
    }

    items.slice(initial).forEach(el => el.classList.add("lm-hidden"));

    btn.addEventListener("click", () => {
      items.forEach(el => el.classList.remove("lm-hidden"));
      btn.classList.add("lm-hidden");
    });

    grid.dataset.lmInitialized = "true";
  });
}

document.addEventListener("astro:page-load", initLoadMore);
