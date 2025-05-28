import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import getImagesByQuery from './js/pixabay-api.js';
import * as all from './js/render-functions';

const container = document.querySelector('.gallery');
const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let totalLoaded = 0;
let totalHits = 0;

let lightbox = new SimpleLightbox('.gallery-item a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const userValue = e.target.elements['search-text'].value.trim();

  if (userValue === '') {
    iziToast.show({
      title: 'Warning',
      message: 'Please enter a search term before submitting!',
      position: 'topRight',
      color: 'yellow',
    });
    e.target.reset();
    return;
  }

  if (userValue !== currentQuery) {
    currentPage = 1;
    currentQuery = userValue;
    totalLoaded = 0;
    all.clearGallery();
  }

  all.showLoader();
  await fetchAndRenderImages();
  all.hideLoader();
  e.target.reset();
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  all.showLoader();
  await fetchAndRenderImages();
  all.hideLoader();
  const firstCard = container.querySelector('.gallery-item');
  if (firstCard) {
    const cardHeight = firstCard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      left: 0,
      behavior: 'smooth',
    });
  }
});

async function fetchAndRenderImages() {
  try {
    const { hits, totalHits: total } = await getImagesByQuery(
      currentQuery,
      currentPage
    );

    if (currentPage === 1) {
      totalHits = total;
    }

    if (hits.length === 0 && currentPage === 1) {
      iziToast.show({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        color: 'red',
      });
      loadMoreBtn.style.display = 'none';
      return;
    }

    const markup = all.createGallery(hits);
    container.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    totalLoaded += hits.length;

    if (totalLoaded >= totalHits) {
      loadMoreBtn.style.display = 'none';
      iziToast.show({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        color: 'blue',
      });
    } else {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    iziToast.show({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
      color: 'red',
    });
    console.error('Помилка при запиті:', error);
  }
}
