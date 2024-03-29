const axios = require('axios').default;
export const pixabayAPI = {
  baseUrl: 'https://pixabay.com/api/',
  key: '30147875-1b32fddb16ed51bfbd356d818',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  order: 'popular',
  page: '1',
  per_page: '40',
};

export async function expResult(paramFetch, pageParam) {
  const { baseUrl, key, image_type, orientation, safesearch, order, per_page } = pixabayAPI;

  const response = await axios.get(
    `${baseUrl}?key=${key}&q=${paramFetch}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&order=${order}&page=${pageParam}&per_page=${per_page}`
  );

  return response.data;
}
