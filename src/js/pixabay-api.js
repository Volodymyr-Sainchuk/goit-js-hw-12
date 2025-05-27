import axios from 'axios';

export default async function getImagesByQuery(query, page) {
  const MAIN_URL = 'https://pixabay.com';
  const END_POINT = '/api/';
  const params = new URLSearchParams({
    key: '50274791-f4b76ab6fee4d49d8c558ca21',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 15,
  });
  const url = `${MAIN_URL}${END_POINT}?${params}`;

  try {
    const response = await axios.get(url);
    // Перевірка, чи є очікувані дані
    if (!response.data || !response.data.hits) {
      throw new Error('Невірна відповідь від API');
    }
    return {
      hits: response.data.hits,
      totalHits: response.data.totalHits,
    };
  } catch (error) {
    console.log('Помилка при запиті до Pixabay:', error);
    throw error;
  }
}
