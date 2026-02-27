import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchMedia, getImageUrl } from '../services/tmdbApi';
import { useFavorites } from '../contexts/FavoritesContext';

export default function Search() {
  const [params] = useSearchParams();
  const query = (params.get('q') || '').trim();

  // resultados + paginação
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  // estados de controle
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // observer do infinite scroll
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Minha Lista
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    // sempre que a busca muda eu reseto tudo (pra não misturar resultados)
    setResults([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [query]);

  useEffect(() => {
    // se não tiver query ou já acabou, nem tento buscar
    if (!query || !hasMore) return;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await searchMedia(query, page);

        // o search/multi pode trazer "person", aqui eu deixo só movie/tv
        const cleaned = (data?.results || []).filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv'
        );

        // junta com o que já tinha (scroll infinito)
        setResults((prev) => [...prev, ...cleaned]);

        // se a API não trouxe nada ou já chegamos na última página, para
        if (!cleaned.length || page >= (data.total_pages || 1)) {
          setHasMore(false);
        }
      } catch (e) {
        console.error(e);
        setError('Erro ao buscar.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [query, page, hasMore]);

  useEffect(() => {
    // sentinel é o “marcador” no fim da lista. Quando ele aparece, peço a próxima página.
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [loading, hasMore]);

  return (
    <div className="pt-28 pb-16 container mx-auto px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Resultados</h1>

      <p className="text-text-secondary mb-8">
        Buscando por <span className="text-white font-semibold">“{query}”</span>
      </p>

      {error && <p className="text-red-500 mb-6">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {results.map((item) => {
          const title = item.title || item.name || 'Sem título';
          const type = item.media_type;
          const isFav = isFavorite(item.id);

          return (
            <Link
              key={`${type}-${item.id}`}
              to={`/${type}/${item.id}`}
              className="group relative bg-dark-secondary rounded-xl overflow-hidden shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-all duration-200"
            >
              <img
                src={getImageUrl(item.poster_path)}
                alt={title}
                className="w-full h-64 md:h-80 object-cover transition duration-200 group-hover:saturate-110 group-hover:contrast-110"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 ring-1 ring-white/10" />
              </div>

              {/* Favorito: clicando aqui não pode navegar pro Link */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (isFav) {
                    removeFavorite(item.id);
                    return;
                  }

                  // salvo só o essencial pra lista (evita localStorage gigante)
                  addFavorite({
                    id: item.id,
                    title: item.title,
                    name: item.name,
                    poster_path: item.poster_path,
                    media_type: item.media_type,
                    vote_average: item.vote_average,
                    release_date: item.release_date,
                    first_air_date: item.first_air_date,
                  });
                }}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 rounded-full p-2 transition"
                aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                {isFav ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-red-500"
                    fill="currentColor"
                  >
                    <path d="M12 21s-6.716-4.35-9.33-7.5C.7 11.18.9 7.9 3.05 6.05c1.9-1.64 4.6-1.36 6.2.28L12 9.08l2.75-2.75c1.6-1.64 4.3-1.92 6.2-.28 2.15 1.85 2.35 5.13.38 7.45C18.716 16.65 12 21 12 21z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>

              <div className="p-3">
                <p className="font-semibold truncate">{title}</p>
                <p className="text-sm text-text-secondary">
                  ★ {item.vote_average?.toFixed(1) || '—'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* sentinel: quando ele aparece, eu carrego a próxima página */}
      <div ref={sentinelRef} className="h-20 flex items-center justify-center">
        {loading && <p className="text-text-secondary">Carregando mais...</p>}
        {!hasMore && !loading && <p className="text-text-secondary">Fim dos resultados</p>}
      </div>
    </div>
  );
}
