import './sass/main.scss';
import { Notify } from 'notiflix';
const axios = require('axios').default;
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import renderedPhotos from './js/renderedPhotos';
import { pixabayAPI } from './js/responsesAPI';

export const markupData = {
  markup: '',
  htmlCode: '',
};

export let searchQueryResult = '';
export let q = '';
export let pageN = 1;
export let gallery = new SimpleLightbox('.gallery a', {
  enableKeyboard: true,
});

const searchForm = document.querySelector('.search-form');
export const gallerySelector = document.querySelector('.gallery');
export const btnLoadMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.target;
  searchQueryResult = searchQuery.value;

  if (searchQuery.value === '') {
    gallerySelector.innerHTML = '';
    btnLoadMore.classList.remove('is-visible');
    return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
  if (searchQuery.value !== q) {
    pageN = 1;
    pixabayAPI.page = `${pageN}`;

    gallerySelector.innerHTML = '';
    btnLoadMore.classList.remove('is-visible');
  } else {
    pageN += 1;
    pixabayAPI.page = `${pageN}`;
    btnLoadMore.classList.remove('is-visible');
  }

  q = searchQuery.value;

  try {
    const results = await fetchPhotos(searchQuery.value);
    markupData.htmlCode = await renderedPhotos(results);

    gallerySelector.insertAdjacentHTML('beforeend', markupData.htmlCode);
    btnLoadMore.classList.add('is-visible');

    gallery.refresh();

    const { page, per_page } = pixabayAPI;
    const { totalHits } = results;
    const totalPages = Math.ceil(totalHits / per_page);

    if (page >= totalPages) {
      btnLoadMore.classList.remove('is-visible');
    }
    Notify.success(`'Hooray! We found ${results.totalHits} images.'`);
  } catch (error) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
});

btnLoadMore.addEventListener('click', async () => {
  pageN += 1;
  pixabayAPI.page = `${pageN}`;

  try {
    const results = await fetchPhotos(searchQueryResult);
    markupData.htmlCode = await renderedPhotos(results);

    gallerySelector.insertAdjacentHTML('beforeend', markupData.htmlCode);
    btnLoadMore.classList.add('is-visible');

    gallery.refresh();

    const { page, per_page } = pixabayAPI;
    const { totalHits } = results;
    const totalPages = Math.ceil(totalHits / per_page);

    if (page >= totalPages) {
      btnLoadMore.classList.remove('is-visible');
    }
  } catch (error) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
  }
});

async function fetchPhotos(searchQueryResult) {
  const { baseUrl, key, image_type, orientation, safesearch, order, page, per_page } = pixabayAPI;
  pixabayAPI.page = `${pageN}`;

  const response = await axios.get(
    `${baseUrl}?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&order=${order}&page=${page}&per_page=${per_page}`
  );
  const results = response.data;
  const { total, totalHits } = results;
  const totalPages = Math.ceil(totalHits / per_page);

  if (total === 0) {
    throw new Error();
  }
  if (page >= totalPages) {
    btnLoadMore.classList.remove('is-visible');
    Notify.failure("We're sorry, but you've reached the end of search results.");
    return results;
  }
  return results;
}
