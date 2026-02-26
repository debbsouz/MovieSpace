// Arquivo responsável por centralizar todas as chamadas para a API do TMDB.
// A ideia aqui é não espalhar fetch pelo projeto inteiro e manter tudo organizado em um lugar só.

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'pt-BR';

// Se a key não estiver configurada no .env, já aviso no console pra facilitar debug
if (!API_KEY) {
  console.error('API Key do TMDB não encontrada! Verifique o arquivo .env com VITE_TMDB_API_KEY');
}

/**
 * Função base para todas as requisições ao TMDB.
 * Recebe o endpoint e um objeto opcional de parâmetros.
 * Aqui eu monto a URL dinamicamente e já aplico key + language automaticamente.
 */
const fetchFromTMDB = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);

  // parâmetros padrão que toda chamada precisa
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', LANGUAGE);

  // adiciona params extras somente se existirem
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString());

  // tratamento padrão de erro da API
  if (!res.ok) {
    let errorData = {};
    try {
      errorData = await res.json();
    } catch (_) {}

    throw new Error(
      `Erro TMDB: ${res.status} - ${errorData.status_message || res.statusText}`
    );
  }

  return res.json();
};

/* ===========================
   LISTAS E BUSCAS
=========================== */

// Filmes populares (usado principalmente na Home)
export const getPopularMovies = () => fetchFromTMDB('/movie/popular');

// Busca global (filme + série) usada no Header e página de Search
export const searchMedia = (query, page = 1) =>
  fetchFromTMDB('/search/multi', { query, page });

/* ===========================
   DETALHES
=========================== */

// Detalhes de mídia (movie ou tv)
export const getMediaDetails = (type, id) =>
  fetchFromTMDB(`/${type}/${id}`);

// Vídeos (trailers principalmente)
export const getMediaVideos = (type, id) =>
  fetchFromTMDB(`/${type}/${id}/videos`);

// Recomendações (parecidos)
export const getMediaRecommendations = (type, id) =>
  fetchFromTMDB(`/${type}/${id}/recommendations`);

// Elenco e equipe
export const getMediaCredits = (type, id) =>
  fetchFromTMDB(`/${type}/${id}/credits`);

/* ===========================
   IMAGENS
=========================== */

// Helper simples pra montar URL de imagem do TMDB
export const getImageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder-poster.jpg';

/* ===========================
   LISTAS GENÉRICAS
=========================== */

// Popular genérico (movie ou tv) — usado no Browse
export const getPopular = (type = 'movie', page = 1) =>
  fetchFromTMDB(`/${type}/popular`, { page });

// Mais bem avaliados
export const getTopRated = (type = 'movie', page = 1) =>
  fetchFromTMDB(`/${type}/top_rated`, { page });

/* ===========================
   FILMES
=========================== */

// Em cartaz
export const getNowPlayingMovies = (page = 1) =>
  fetchFromTMDB('/movie/now_playing', { page });

// Próximos lançamentos
export const getUpcomingMovies = (page = 1) =>
  fetchFromTMDB('/movie/upcoming', { page });

/* ===========================
   SÉRIES
=========================== */

// Séries atualmente em exibição
export const getOnTheAirTV = (page = 1) =>
  fetchFromTMDB('/tv/on_the_air', { page });

/* ===========================
   TRENDING
=========================== */

// Trending diário ou semanal (all, movie ou tv)
export const getTrending = (type = 'all', timeWindow = 'week', page = 1) =>
  fetchFromTMDB(`/trending/${type}/${timeWindow}`, { page });