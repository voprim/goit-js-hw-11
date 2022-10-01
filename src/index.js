import './sass/main.scss';
const axios = require('axios').default;
import variables from './js/variables';
import renderedPhotos from './js/renderedPhotos';
import { pixabayAPI } from './js/responsesAPI';
import handleSubmit from './js/handleSubmit';

export const markupData = {
  markup: '',
  htmlCode: '',
};
export const gallerySelector = document.querySelector('.gallery');
export const btnLoadMore = document.querySelector('.load-more');
const searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', handleSubmit);

btnLoadMore.addEventListener('click', async () => {
  variables.pageN += 1;
  pixabayAPI.page = `${variables.pageN}`;

  try {
    const results = await fetchPhotos(variables.searchQueryResult);
    markupData.htmlCode = await renderedPhotos(results);

    gallerySelector.insertAdjacentHTML('beforeend', markupData.htmlCode);
    btnLoadMore.classList.add('is-visible');

    variables.gallery.refresh();

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

export async function fetchPhotos(searchQueryResult) {
  const { baseUrl, key, image_type, orientation, safesearch, order, page, per_page } = pixabayAPI;
  pixabayAPI.page = `${variables.pageN}`;

  const response = await axios.get(
    `${baseUrl}?key=${key}&q=${variables.q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&order=${order}&page=${page}&per_page=${per_page}`
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
