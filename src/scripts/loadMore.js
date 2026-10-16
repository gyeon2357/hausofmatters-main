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
