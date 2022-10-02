import './sass/main.scss';
import variables from './js/variables';
import { pixabayAPI, expResult } from './js/responsesAPI';
import handleSubmit from './js/handleSubmit';
import renderedPhotos from './js/renderedPhotos';

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

export async function fetchPhotos(q) {
  const response = expResult(q, variables.pageN);
  const { total, totalHits } = await response;
  const totalPages = Math.ceil(totalHits / pixabayAPI.per_page);

  if (total === 0) {
    throw new Error();
  }
  if (pixabayAPI.page >= totalPages) {
    btnLoadMore.classList.remove('is-visible');
    Notify.failure("We're sorry, but you've reached the end of search results.");
    return expResult(q);
  }
  return expResult(q);
}
