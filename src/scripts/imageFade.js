const init = () => {
  const images = document.querySelectorAll('img.fade-in');

  images.forEach((img) => {
    img.onload = function () {
      img.classList.add('loaded');
    };

    if (img.complete) {
      img.onload();
    }
  });
};

document.addEventListener('astro:page-load', init);
