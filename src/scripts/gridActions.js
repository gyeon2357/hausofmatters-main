let gridContainer;
let gridItems;
let shuffleButton;
let sortButton;
let recommendedButton;
let sortDateButton;
let searchButton;
let searchClearButton;
let searchContent;
let searchContentOriginal;
let searchDialog;
let searchInput;
let closeDialog;
let shuffleResetTimeout;

const SORT_BUTTONS = () => [sortButton, sortDateButton, recommendedButton, shuffleButton].filter(Boolean);

/* 활성 버튼 표시 — shuffle은 타임아웃 후 해제 */
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

/* Event handlers */
const handleSortClick = () => { sortGrid(); setActive(sortButton); };
const handleSortDateClick = () => { sortByDate(); setActive(sortDateButton); };
const handleRecommendedClick = () => { recommendedGrid(); setActive(recommendedButton); };
const handleShuffleClick = () => { shuffleGrid(); setActive(shuffleButton, true); };

const handleSearchClick = () => {
  searchDialog.showModal();
  toggleDialogPageBlur(true);
};
const handleCloseClick = () => {
  searchDialog.close();
  toggleDialogPageBlur(false);
};
const handleSearchClearClick = () => {
  filterGrid('');
  toggleClearButton();
  searchContent.innerHTML = searchContentOriginal;
  searchInput.value = '';
  searchButton.classList.remove('search--active');
};
const handleSearchInput = (e) => {
  const searchTerm = e.target.value;
  filterGrid(searchTerm);
  searchContent.innerHTML = searchTerm === '' ? searchContentOriginal : searchTerm;
  toggleClearButton(searchTerm);
  searchButton.classList.toggle('search--active', searchTerm !== '');
};

/* Initialize DOM elements */
const initializeVariables = () => {
  gridContainer = document.querySelector('[data-grid]');
  gridItems = Array.from(gridContainer?.children || []);
  shuffleButton = document.querySelector('[data-shuffle]');
  sortButton = document.querySelector('[data-sort]');
  recommendedButton = document.querySelector('[data-recommended]');
  sortDateButton = document.querySelector('[data-sort-date]');
  searchButton = document.querySelector('[data-search]');
  searchClearButton = document.querySelector('[data-clear]');
  searchContent = searchButton?.querySelector('.oh__inner');
  searchContentOriginal = searchContent?.innerHTML || '';
  searchDialog = document.getElementById('search-dialog');
  searchInput = document.getElementById('search-input');
  closeDialog = document.getElementById('close-dialog');
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

const filterGrid = (searchValue) => {
  const lowerCaseSearch = searchValue.toLowerCase();
  const items = Array.from(gridContainer?.children || []);
  items.forEach(item => {
    const name     = (item.getAttribute('data-name')     || '').toLowerCase();
    const stagename = (item.getAttribute('data-stagename') || '').toLowerCase();
    const artist   = (item.getAttribute('data-artist')   || '').toLowerCase();
    const editor   = (item.getAttribute('data-editor')   || '').toLowerCase();
    item.style.display =
      name.includes(lowerCaseSearch) ||
      stagename.includes(lowerCaseSearch) ||
      artist.includes(lowerCaseSearch) ||
      editor.includes(lowerCaseSearch)
        ? '' : 'none';
  });
};

const toggleDialogPageBlur = (toggle) => {
  document.body.classList.toggle('blurred', toggle);
};

const toggleClearButton = (searchTerm = '') => {
  const isHidden = searchClearButton?.classList.contains('hidden');
  if (searchTerm === '' && !isHidden) searchClearButton.classList.add('hidden');
  else if (searchTerm !== '' && isHidden) searchClearButton.classList.remove('hidden');
};

const init = () => {
  initializeVariables();
  shuffleButton?.addEventListener('click', handleShuffleClick);
  sortButton?.addEventListener('click', handleSortClick);
  recommendedButton?.addEventListener('click', handleRecommendedClick);
  sortDateButton?.addEventListener('click', handleSortDateClick);
  searchButton?.addEventListener('click', handleSearchClick);
  closeDialog?.addEventListener('click', handleCloseClick);
  searchClearButton?.addEventListener('click', handleSearchClearClick);
  searchInput?.addEventListener('input', handleSearchInput);
  searchDialog?.addEventListener('close', () => toggleDialogPageBlur(false));
};

const cleanup = () => {
  clearTimeout(shuffleResetTimeout);
  shuffleButton?.removeEventListener('click', handleShuffleClick);
  sortButton?.removeEventListener('click', handleSortClick);
  recommendedButton?.removeEventListener('click', handleRecommendedClick);
  sortDateButton?.removeEventListener('click', handleSortDateClick);
  searchButton?.removeEventListener('click', handleSearchClick);
  closeDialog?.removeEventListener('click', handleCloseClick);
  searchClearButton?.removeEventListener('click', handleSearchClearClick);
  searchInput?.removeEventListener('input', handleSearchInput);
  gridContainer = null; gridItems = []; shuffleButton = null; sortButton = null;
  recommendedButton = null; sortDateButton = null; searchButton = null;
  searchClearButton = null; searchContent = null; searchContentOriginal = '';
  searchDialog = null; searchInput = null; closeDialog = null;
};

const handlePageEvent = (type) => {
  const page = document.documentElement.getAttribute('data-page');
  if (page !== 'home' && page !== 'artists' && page !== 'albums' && page !== 'hom' && page !== 'w-hom') return;
  if (type === 'load') init();
  else if (type === 'before-swap') cleanup();
};

document.addEventListener('astro:page-load', () => handlePageEvent('load'));
document.addEventListener('astro:before-swap', () => handlePageEvent('before-swap'));
