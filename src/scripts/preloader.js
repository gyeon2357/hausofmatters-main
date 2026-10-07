import imagesLoaded from 'imagesloaded';

// Preloader element reference
let loading;

// Initialize the preloader element.
const initializeElements = () => {
  loading = document.querySelector('.loading');
};

// Load all images and background images on the page.
// Resolves when all assets are loaded, or rejects if any fail.
const loadImages = () => {
  return new Promise((resolve, reject) => {
    // Collect all <img> elements.
    const imgElements = document.querySelectorAll('img');

    // Collect elements with background images.
    const bgElements = [...document.querySelectorAll('*')].filter((el) => {
      const style = window.getComputedStyle(el);
      return style.backgroundImage !== 'none';
    });

    // Combine both sets of elements.
    const allElements = [...imgElements, ...bgElements];

    // Use imagesLoaded to track asset loading.
    const imgLoad = imagesLoaded(allElements, { background: true });
    imgLoad.on('done', resolve);
    imgLoad.on('fail', () => {
      reject(new Error('Failed to load some images or assets'));
    });
  });
};

// Load assets and dispatch a custom event when done.
const loadAssets = async () => {
  try {
    await loadImages();
    const event = new CustomEvent('assetsLoaded');
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Failed to load assets:', error);
    throw error;
  }
};

// Show the preloader, load assets if needed, and then hide the preloader.
const toggleLoading = async () => {
  if (sessionStorage.getItem('preloadComplete') === 'true') {
    hide();
    return;
  }
  show();
  try {
    await loadAssets();
  } catch (error) {
    // 이미지 하나라도 404 등으로 실패하면 loadAssets()가 reject되는데, 여기서 멈추면
    // 로딩 화면이 전체 사이트를 영구적으로 가려버림 — 실패해도 반드시 가려줌
    console.error('Failed to load assets or animate:', error);
  } finally {
    sessionStorage.setItem('preloadComplete', 'true');
    hide();
  }
};

// Display the preloader.
const show = () => {
  loading.classList.remove('hidden');
};

// Hide the preloader.
const hide = () => {
  loading.classList.add('hidden');
};

// Cleanup to reset references.
const cleanup = () => {
  loading = null;
};

// Initialize the preloader logic.
const init = () => {
  initializeElements();
  toggleLoading();
};

// Preloader는 이제 모든 페이지 공통(BaseLayout)에서 렌더링되므로 페이지 종류와 무관하게 실행.
const handlePageEvent = (_event, callback) => {
  callback();
};

// Listen for Astro's lifecycle events.
document.addEventListener('astro:page-load', () => {
  handlePageEvent('page-load', init);
});

document.addEventListener('astro:before-swap', () => {
  handlePageEvent('before-swap', cleanup);
});

// Clear the preload flag before page unload to ensure the loader appears on refresh.
window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('preloadComplete');
});
