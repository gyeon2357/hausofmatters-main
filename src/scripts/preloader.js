import imagesLoaded from 'imagesloaded';

let loading;

const initializeElements = () => {
  loading = document.querySelector('.loading');
};

const loadImages = () => {
  return new Promise((resolve, reject) => {
    const imgElements = document.querySelectorAll('img');

    const bgElements = [...document.querySelectorAll('*')].filter((el) => {
      const style = window.getComputedStyle(el);
      return style.backgroundImage !== 'none';
    });

    const allElements = [...imgElements, ...bgElements];

    const imgLoad = imagesLoaded(allElements, { background: true });
    imgLoad.on('done', resolve);
    imgLoad.on('fail', () => {
      reject(new Error('Failed to load some images or assets'));
    });
  });
};

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

const toggleLoading = async () => {
  if (sessionStorage.getItem('preloadComplete') === 'true') {
    hide();
    return;
  }
  show();
  try {
    await loadAssets();
  } catch (error) {
    console.error('Failed to load assets or animate:', error);
  } finally {
    sessionStorage.setItem('preloadComplete', 'true');
    hide();
  }
};

const show = () => {
  loading.classList.remove('hidden');
};

const hide = () => {
  loading.classList.add('hidden');
};

const cleanup = () => {
  loading = null;
};

const init = () => {
  initializeElements();
  toggleLoading();
};

const handlePageEvent = (_event, callback) => {
  callback();
};

document.addEventListener('astro:page-load', () => {
  handlePageEvent('page-load', init);
});

document.addEventListener('astro:before-swap', () => {
  handlePageEvent('before-swap', cleanup);
});

window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('preloadComplete');
});
