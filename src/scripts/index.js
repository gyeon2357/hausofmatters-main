import gsap from 'gsap';

let lines;
let textSliders;
let gridContainer;
let gridItems;
let hasPreloaderComponent;
let animationTimeline;

const initializeVariables = () => {
  lines = document.querySelectorAll('hr');
  textSliders = document.querySelectorAll('header .oh > .oh__inner');
  gridContainer = document.querySelector('[data-grid]');
  gridItems = gridContainer ? Array.from(gridContainer.children) : [];
  hasPreloaderComponent = document.querySelector('.loading');
};

const animateHomepageElements = () => {
  if (!gridContainer || !gridItems.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(gridContainer, { autoAlpha: 1 });
    gsap.set(gridItems, { autoAlpha: 1 });
    document.dispatchEvent(new CustomEvent('gridRendered'));
    return;
  }

  animationTimeline = gsap.set(gridContainer, { autoAlpha: 0 });

  gsap.timeline({
    defaults: {
      duration: 1,
      ease: 'power4',
    },
    onComplete: () => {
      const event = new CustomEvent('gridRendered');
      document.dispatchEvent(event);
    },
  })
  .set(gridContainer, { autoAlpha: 1 }, '<+=1')
  .from(gridItems, { ease: 'sine', autoAlpha: 0, stagger: 0.03 }, '<');
};

const cleanup = () => {
  if (animationTimeline) {
    animationTimeline.kill();
    animationTimeline = null;
  }
  lines = null;
  textSliders = null;
  gridContainer = null;
  gridItems = null;
  hasPreloaderComponent = null;
};

const init = () => {
  initializeVariables();

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  if (hasPreloaderComponent && sessionStorage.getItem('preloadComplete') !== 'true') {
    document.addEventListener('assetsLoaded', animateHomepageElements, { once: true });
  } else {
    animateHomepageElements();
  }
};

const handlePageEvent = (_event, callback) => {
  const page = document.documentElement.getAttribute('data-page');
  if (page === 'home' || page === 'hom' || page === 'w-hom') callback();
};

document.addEventListener('astro:page-load', () => {
  handlePageEvent('page-load', init);
});

document.addEventListener('astro:before-swap', () => {
  handlePageEvent('before-swap', cleanup);
});
