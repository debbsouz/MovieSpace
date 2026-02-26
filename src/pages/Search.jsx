import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchMedia, getImageUrl } from '../services/tmdbApi';
import { useFavorites } from '../contexts/FavoritesContext';

export default function Search() {
  const [params] = useSearchParams();
  const query = (params.get('q') || '').trim();

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // 🔥 reset quando muda query
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  // 🔥 fetch paginado
  useEffect(() => {
    if (!query || !hasMore) return;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await searchMedia(query, page);

        const cleaned = (data?.results || []).filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv'
        );

        setResults((prev) => [...prev, ...cleaned]);

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

  // 🔥 observer infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
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
              className="relative bg-dark-secondary rounded-xl overflow-hidden shadow-xl hover:scale-[1.02] hover:shadow-2xl transition"
            >
              <img
                src={getImageUrl(item.poster_path)}
                alt={title}
                className="w-full h-64 md:h-80 object-cover"
              />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (isFav) removeFavorite(item.id);
                  else addFavorite({ ...item });
                }}
                className="absolute top-3 right-3 bg-black/60 rounded-full p-2"
              >
                <span className={isFav ? 'text-red-500' : 'text-white'}>❤️</span>
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

      {/* sentinel infinite scroll */}
      <div ref={sentinelRef} className="h-20 flex items-center justify-center">
        {loading && <p className="text-text-secondary">Carregando mais...</p>}
        {!hasMore && <p className="text-text-secondary">Fim dos resultados</p>}
      </div>
    </div>
  );
}