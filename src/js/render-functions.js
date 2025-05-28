import SimpleLightbox from 'simplelightbox';
const container = document.querySelector('.gallery');
const lightBox = new SimpleLightbox('.gallery a');
const loaderContainer = document.querySelector('.loader-container');
const loadMoreBtn = document.querySelector('.load-more');
export async function createGallery(images) {
  const markup = images
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `
        <li><a class="gallery-link" href="${largeImageURL}">
          <div class="gallery-item">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="gallery-info">
              <p><b>Likes:</b> ${likes}</p>
              <p><b>Views:</b> ${views}</p>
              <p><b>Comments:</b> ${comments}</p>
              <p><b>Downloads:</b> ${downloads}</p>
            </div>
          </div>
        </a></li>
      `;
    })
    .join('');

  container.insertAdjacentHTML('beforeend', markup);

  lightBox.refresh();
}

export function clearGallery() {
  container.innerHTML = '';
}

export function showLoader() {
  loaderContainer.classList.remove('hidden');
}

export function hideLoader() {
  loaderContainer.classList.add('hidden');
}
export function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

export function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}
