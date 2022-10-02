import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export default {
  searchQueryResult: '',
  q: '',
  pageN: 1,
  gallery: new SimpleLightbox('.gallery a', {
    enableKeyboard: true,
  }),
};
