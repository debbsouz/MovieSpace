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

export const searchMedia = (query, page = 1) => fetchFromTMDB(`/search/multi`, { query, page });

export const getMediaDetails = (type, id) => fetchFromTMDB(`/${type}/${id}`);

export const getMediaVideos = (type, id) => fetchFromTMDB(`/${type}/${id}/videos`);

export const getMediaRecommendations = (type, id) => fetchFromTMDB(`/${type}/${id}/recommendations`);

export const getMediaCredits = (type, id) => fetchFromTMDB(`/${type}/${id}/credits`);

export const getImageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder-poster.jpg';

// Listas genéricas (Movie/TV)
export const getPopular = (type = 'movie', page = 1) => fetchFromTMDB(`/${type}/popular`, { page });

export const getTopRated = (type = 'movie', page = 1) => fetchFromTMDB(`/${type}/top_rated`, { page });

// Filmes
export const getNowPlayingMovies = (page = 1) => fetchFromTMDB('/movie/now_playing', { page });

export const getUpcomingMovies = (page = 1) => fetchFromTMDB('/movie/upcoming', { page });

// Séries
export const getOnTheAirTV = (page = 1) => fetchFromTMDB('/tv/on_the_air', { page });

export const getTrending = (type = 'all', timeWindow = 'week', page = 1) =>
  fetchFromTMDB(`/trending/${type}/${timeWindow}`, { page });

/* =========================
   GÊNEROS + DISCOVER
   ========================= */

// lista de gêneros (movie ou tv)
export const getGenres = (type = 'movie') =>
  fetchFromTMDB(`/genre/${type}/list`);

// discover com filtros (usado pra gênero)
export const discoverByGenre = (type = 'movie', genreId, page = 1, sortBy = 'popularity.desc') =>
  fetchFromTMDB(`/discover/${type}`, {
    with_genres: genreId,
    page,
    sort_by: sortBy,
    include_adult: false,
    include_video: false,
  });