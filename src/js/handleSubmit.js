import variables from './variables';
import { Notify } from 'notiflix';
import { pixabayAPI } from './responsesAPI';
import renderedPhotos from './renderedPhotos';
import { fetchPhotos, markupData, gallerySelector, btnLoadMore } from '../index';

export default handleSubmit = async e => {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.target;
  variables.searchQueryResult = searchQuery.value;

  if (searchQuery.value === '') {
    gallerySelector.innerHTML = '';
    btnLoadMore.classList.remove('is-visible');
    return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
  if (searchQuery.value !== variables.q) {
    variables.pageN = 1;
    pixabayAPI.page = `${variables.pageN}`;

    gallerySelector.innerHTML = '';
    btnLoadMore.classList.remove('is-visible');
  } else {
    variables.pageN += 1;
    pixabayAPI.page = `${variables.pageN}`;
    btnLoadMore.classList.remove('is-visible');
  }

  variables.q = searchQuery.value;

  try {
    const results = await fetchPhotos(searchQuery.value);
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
    Notify.success(`'Hooray! We found ${results.totalHits} images.'`);
  } catch (error) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
};
