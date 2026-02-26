const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'pt-BR';

if (!API_KEY) {
  console.error('API Key do TMDB não encontrada! Verifique o arquivo .env com VITE_TMDB_API_KEY');
}

const fetchFromTMDB = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', LANGUAGE);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString());

  if (!res.ok) {
    let errorData = {};
    try {
      errorData = await res.json();
    } catch (_) {}
    throw new Error(`Erro TMDB: ${res.status} - ${errorData.status_message || res.statusText}`);
  }

  return res.json();
};

export const getPopularMovies = () => fetchFromTMDB('/movie/popular');

export const searchMedia = (query, page = 1) =>
  fetchFromTMDB(`/search/multi`, { query, page });

export const getMediaDetails = (type, id) =>
  fetchFromTMDB(`/${type}/${id}`);

export const getMediaVideos = (type, id) =>
  fetchFromTMDB(`/${type}/${id}/videos`);

export const getMediaRecommendations = (type, id) =>
  fetchFromTMDB(`/${type}/${id}/recommendations`);

export const getMediaCredits = (type, id) =>
  fetchFromTMDB(`/${type}/${id}/credits`);

export const getImageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder-poster.jpg';