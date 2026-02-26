import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getTrending, getImageUrl } from '../services/tmdbApi';

export default function Trending() {
  const [params, setParams] = useSearchParams();

  // filtros via query params (fica linkável e fácil de compartilhar)
  const type = params.get('type') || 'all'; // all | movie | tv
  const time = params.get('time') || 'week'; // day | week
  const page = Number(params.get('page') || 1);

  // guardo o retorno da API + results filtrado
  const [data, setData] = useState({ results: [], total_pages: 1 });

  // estados padrão de request
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // carrega trending sempre que eu mudar type/time/page
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getTrending(type, time, page);

        // se vier "person" no all, eu filtro fora (aqui é só filme e série)
        const cleaned = (res?.results || []).filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv'
        );

        // mantenho o resto do payload (total_pages etc) e só troco os results
        setData({ ...res, results: cleaned });
      } catch (e) {
        console.error(e);
        setError('Erro ao carregar trending.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [type, time, page]);

  // helpers pra resetar página quando troca filtro
  const setType = (next) => setParams({ type: next, time, page: 1 });
  const setTime = (next) => setParams({ type, time: next, page: 1 });

  // TMDB limita total_pages retornado em algumas rotas (e eu não quero paginar infinito)
  const maxPages = Math.min(data.total_pages || 1, 500);

  return (
    <div className="pt-28 pb-16 container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Trending</h1>
          <p className="text-text-secondary mt-2">
            Em alta {time === 'day' ? 'hoje' : 'na semana'} • {type.toUpperCase()}
          </p>
        </div>

        {/* filtros rápidos (fica bem “catálogo”) */}
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-dark-secondary rounded-full p-1 border border-dark-tertiary">
            <button
              type="button"
              onClick={() => setType('all')}
              className={`px-4 py-2 rounded-full transition ${
                type === 'all' ? 'bg-accent-red text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              Tudo
            </button>
            <button
              type="button"
              onClick={() => setType('movie')}
              className={`px-4 py-2 rounded-full transition ${
                type === 'movie' ? 'bg-accent-red text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              Filmes
            </button>
            <button
              type="button"
              onClick={() => setType('tv')}
              className={`px-4 py-2 rounded-full transition ${
                type === 'tv' ? 'bg-accent-red text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              Séries
            </button>
          </div>

          <div className="flex bg-dark-secondary rounded-full p-1 border border-dark-tertiary">
            <button
              type="button"
              onClick={() => setTime('day')}
              className={`px-4 py-2 rounded-full transition ${
                time === 'day' ? 'bg-white text-black' : 'text-text-secondary hover:text-white'
              }`}
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => setTime('week')}
              className={`px-4 py-2 rounded-full transition ${
                time === 'week' ? 'bg-white text-black' : 'text-text-secondary hover:text-white'
              }`}
            >
              Semana
            </button>
          </div>
        </div>
      </div>

      {loading && <p className="text-center text-text-secondary">Carregando...</p>}
      {!loading && error && <p className="text-red-500 text-lg">{error}</p>}

      {!loading && !error && (
        <>
          {/* grid de cards (bem parecido com Search pra manter consistência) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {data.results.map((item) => {
              const mediaType = item.media_type; // movie | tv
              const title = item.title || item.name || 'Sem título';
              const year = (item.release_date || item.first_air_date || '').slice(0, 4) || 'N/A';

              return (
                <Link
                  key={`${mediaType}-${item.id}`}
                  to={`/${mediaType}/${item.id}`}
                  className="relative bg-dark-secondary rounded-xl overflow-hidden shadow-xl hover:scale-[1.02] hover:shadow-2xl transition"
                >
                  <img
                    src={getImageUrl(item.poster_path)}
                    alt={title}
                    className="w-full h-64 md:h-80 object-cover"
                    loading="lazy"
                  />

                  <div className="p-3">
                    <p className="font-semibold truncate">{title}</p>
                    <p className="text-sm text-text-secondary mt-1">
                      ★ {item.vote_average?.toFixed(1) || '—'} • {year} • {mediaType.toUpperCase()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* paginação simples */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setParams({ type, time, page: page - 1 })}
              className="px-4 py-2 bg-dark-secondary rounded-full disabled:opacity-40 hover:bg-dark-tertiary transition flex items-center justify-center"
              aria-label="Página anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-lg">
              {page} / {maxPages}
            </span>

            <button
              type="button"
              disabled={page >= (data.total_pages || 1)}
              onClick={() => setParams({ type, time, page: page + 1 })}
              className="px-4 py-2 bg-dark-secondary rounded-full disabled:opacity-40 hover:bg-dark-tertiary transition flex items-center justify-center"
              aria-label="Próxima página"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}