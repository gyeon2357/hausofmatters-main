let gridContainer;
let gridItems;
let shuffleButton;
let sortButton;
let recommendedButton;
let sortDateButton;
let shuffleResetTimeout;

const SORT_BUTTONS = () => [sortButton, sortDateButton, recommendedButton, shuffleButton].filter(Boolean);

const setActive = (btn, isTemporary = false) => {
  SORT_BUTTONS().forEach(b => b.classList.remove('sort--active'));
  btn.classList.add('sort--active');
  if (isTemporary) {
    clearTimeout(shuffleResetTimeout);
    shuffleResetTimeout = setTimeout(() => {
      btn.classList.remove('sort--active');
    }, 3000);
  }
};

const handleSortClick = () => { sortGrid(); setActive(sortButton); };
const handleSortDateClick = () => { sortByDate(); setActive(sortDateButton); };
const handleRecommendedClick = () => { recommendedGrid(); setActive(recommendedButton); };
const handleShuffleClick = () => { shuffleGrid(); setActive(shuffleButton, true); };

const initializeVariables = () => {
  gridContainer = document.querySelector('[data-grid]');
  gridItems = Array.from(gridContainer?.children || []);
  shuffleButton = document.querySelector('[data-shuffle]');
  sortButton = document.querySelector('[data-sort]');
  recommendedButton = document.querySelector('[data-recommended]');
  sortDateButton = document.querySelector('[data-sort-date]');
};

const shuffleGrid = () => {
  const items = Array.from(gridContainer?.children || []);
  const shuffled = items.sort(() => Math.random() - 0.5);
  if (gridContainer) {
    gridContainer.innerHTML = '';
    shuffled.forEach(item => gridContainer.appendChild(item));
  }
};

const sortGrid = () => {
  const items = Array.from(gridContainer?.children || []);
  const sorted = items.sort((a, b) => {
    const nameA = (a.getAttribute('data-stagename') || a.getAttribute('data-name') || '').toLowerCase();
    const nameB = (b.getAttribute('data-stagename') || b.getAttribute('data-name') || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
  if (gridContainer) {
    gridContainer.innerHTML = '';
    sorted.forEach(item => gridContainer.appendChild(item));
  }
};

const recommendedGrid = () => {
  const items = Array.from(gridContainer?.children || []);
  const recommended = items.filter(item => item.getAttribute('data-recommended') === 'true');
  const rest = items.filter(item => item.getAttribute('data-recommended') !== 'true');
  if (gridContainer) {
    gridContainer.innerHTML = '';
    [...recommended, ...rest].forEach(item => gridContainer.appendChild(item));
  }
};

const sortByDate = () => {
  const items = Array.from(gridContainer?.children || []);
  const sorted = items.sort((a, b) => {
    const dateA = parseInt(a.getAttribute('data-date') || '0', 10);
    const dateB = parseInt(b.getAttribute('data-date') || '0', 10);
    return dateB - dateA;
  });
  if (gridContainer) {
    gridContainer.innerHTML = '';
    sorted.forEach(item => gridContainer.appendChild(item));
  }
};

const init = () => {
  initializeVariables();
  shuffleButton?.addEventListener('click', handleShuffleClick);
  sortButton?.addEventListener('click', handleSortClick);
  recommendedButton?.addEventListener('click', handleRecommendedClick);
  sortDateButton?.addEventListener('click', handleSortDateClick);
};

const cleanup = () => {
  clearTimeout(shuffleResetTimeout);
  shuffleButton?.removeEventListener('click', handleShuffleClick);
  sortButton?.removeEventListener('click', handleSortClick);
  recommendedButton?.removeEventListener('click', handleRecommendedClick);
  sortDateButton?.removeEventListener('click', handleSortDateClick);
  gridContainer = null; gridItems = []; shuffleButton = null; sortButton = null;
  recommendedButton = null; sortDateButton = null;
};

const handlePageEvent = (type) => {
  const page = document.documentElement.getAttribute('data-page');
  if (page !== 'home' && page !== 'artists' && page !== 'albums' && page !== 'hom' && page !== 'w-hom') return;
  if (type === 'load') init();
  else if (type === 'before-swap') cleanup();
};

document.addEventListener('astro:page-load', () => handlePageEvent('load'));
document.addEventListener('astro:before-swap', () => handlePageEvent('before-swap'));
