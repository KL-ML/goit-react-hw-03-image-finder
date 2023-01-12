const BASE_URL = 'https://pixabay.com/api';
const MY_KEY = '30636701-b7bfaf1719dc5d89c8acde7b5';
const PER_PAGE = 12;

function fetchImages(value, page = 1) {
    return fetch(`${BASE_URL}/?q=${value}&page=${page}&key=${MY_KEY}&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`)
        .then(responce => {
            if (responce.ok) {
                return responce.json();
            }
            return Promise.reject(
                new Error('Sorry, something goes wrong.')
            )
        });           
}
const imagesApi = { fetchImages };
export default imagesApi;