import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { getPopularMovies, getImageUrl } from '../services/tmdbApi';
import MediaRow from '../components/MediaRow';
import { getContinueWatching } from '../services/continueWatching';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const [continueList, setContinueList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carouselRef = useRef(null);
  const top10Ref = useRef(null);

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getPopularMovies();
        const list = data.results || [];

        setMovies(list);

        const pickFrom = list.slice(0, 8);
        const chosen = pickFrom[Math.floor(Math.random() * pickFrom.length)];
        setHero(chosen || null);

        setContinueList(getContinueWatching());
      } catch (err) {
        setError('Erro ao carregar filmes. Verifique conexão ou API Key.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const top10 = useMemo(() => movies.slice(0, 10), [movies]);

  const scrollPopularLeft = () => {
    carouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollPopularRight = () => {
    carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const scrollTop10Left = () => {
    top10Ref.current?.scrollBy({ left: -420, behavior: 'smooth' });
  };

  const scrollTop10Right = () => {
    top10Ref.current?.scrollBy({ left: 420, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 pb-16 container mx-auto px-4">
      {/* HERO (Netflix vibe) */}
      {!loading && !error && hero && (
        <section className="relative h-[68vh] md:h-[72vh] mb-14 rounded-2xl overflow-hidden border border-white/5">
          <img
            src={getImageUrl(hero.backdrop_path, 'original')}
            alt={hero.title || 'Destaque'}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-transparent to-transparent" />

          <div className="relative z-10 h-full flex items-end">
            <div className="p-7 md:p-12 max-w-2xl">
              <p className="text-text-secondary text-sm md:text-base mb-2">Em destaque hoje</p>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                {hero.title || 'Sem título'}
              </h1>

              <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
                {hero.overview || 'Sem descrição disponível.'}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/movie/${hero.id}`}
                  className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                >
                  Ver detalhes
                </Link>

                <Link
                  to="/browse?type=movie"
                  className="bg-white/15 text-white font-semibold px-6 py-3 rounded-lg backdrop-blur hover:bg-white/25 transition border border-white/10"
                >
                  Explorar
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    const fav = isFavorite(hero.id);
                    if (fav) {
                      removeFavorite(hero.id);
                    } else {
                      addFavorite({
                        id: hero.id,
                        title: hero.title,
                        poster_path: hero.poster_path,
                        media_type: 'movie',
                        vote_average: hero.vote_average,
                        release_date: hero.release_date,
                      });
                    }
                  }}
                  className="bg-dark-secondary/70 text-white font-semibold px-6 py-3 rounded-lg hover:bg-dark-tertiary transition border border-white/10"
                >
                  {isFavorite(hero.id) ? 'Remover da Minha Lista' : '+ Minha Lista'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {loading && (
        <p className="text-center text-xl text-text-secondary animate-pulse">Carregando...</p>
      )}

      {error && <p className="text-red-500 text-center text-xl">{error}</p>}

      {/* CONTINUAR ASSISTINDO */}
      {!loading && !error && continueList.length > 0 && (
        <MediaRow title="Continuar assistindo" items={continueList} type="movie" />
      )}

      {/* TOP 10 (Netflix vibe) */}
      {!loading && !error && top10.length > 0 && (
        <section className="mb-16 relative group">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Top 10 no Brasil hoje
            </h2>
          </div>

          <div className="relative">
            {/* setas */}
            <button
              type="button"
              onClick={scrollTop10Left}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         bg-black/40 hover:bg-black/60 backdrop-blur
                         text-white rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Voltar Top 10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={scrollTop10Right}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         bg-black/40 hover:bg-black/60 backdrop-blur
                         text-white rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Avançar Top 10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* fade nas bordas */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-r from-dark-bg to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-l from-dark-bg to-transparent" />

            {/* carrossel top 10 */}
            <div
              ref={top10Ref}
              className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            >
              {top10.map((movie, idx) => {
                const rank = idx + 1;

                return (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="relative flex-shrink-0 snap-start w-[240px] sm:w-[280px]"
                  >
                    {/* número gigante */}
                    <div className="absolute left-0 bottom-0 z-0 select-none pointer-events-none">
                      <span
                        className="font-extrabold leading-none text-[140px] sm:text-[170px]"
                        style={{
                          WebkitTextStroke: '2px rgba(255,255,255,0.25)',
                          color: 'rgba(0,0,0,0.2)',
                        }}
                      >
                        {rank}
                      </span>
                    </div>

                    {/* card do poster */}
                    <div className="relative z-10 ml-16 sm:ml-20 rounded-xl overflow-hidden bg-dark-secondary shadow-xl hover:shadow-2xl transition">
                      <img
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title || 'Sem título'}
                        className="w-full h-72 sm:h-80 object-cover"
                        loading="lazy"
                      />

                      {/* coração opcional no top10 */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          const fav = isFavorite(movie.id);
                          if (fav) {
                            removeFavorite(movie.id);
                          } else {
                            addFavorite({
                              id: movie.id,
                              title: movie.title,
                              poster_path: movie.poster_path,
                              media_type: 'movie',
                              vote_average: movie.vote_average,
                              release_date: movie.release_date,
                            });
                          }
                        }}
                        className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 rounded-full p-2 transition"
                        aria-label={isFavorite(movie.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        {isFavorite(movie.id) ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-red-500" fill="currentColor">
                            <path d="M12 21s-6.716-4.35-9.33-7.5C.7 11.18.9 7.9 3.05 6.05c1.9-1.64 4.6-1.36 6.2.28L12 9.08l2.75-2.75c1.6-1.64 4.3-1.92 6.2-.28 2.15 1.85 2.35 5.13.38 7.45C18.716 16.65 12 21 12 21z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                      </button>

                      <div className="p-3">
                        <p className="font-semibold truncate">{movie.title || 'Sem título'}</p>
                        <p className="text-sm text-text-secondary mt-1">
                          ★ {movie.vote_average?.toFixed(1) || '—'}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* POPULARES (carrossel normal) */}
      {!loading && !error && movies.length > 0 && (
        <section className="mb-16 relative group">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-semibold">Populares</h2>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={scrollPopularLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         bg-black/40 hover:bg-black/60 backdrop-blur
                         text-white rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Voltar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={scrollPopularRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         bg-black/40 hover:bg-black/60 backdrop-blur
                         text-white rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Avançar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-r from-dark-bg to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-l from-dark-bg to-transparent" />

            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            >
              {movies.map((movie) => {
                const fav = isFavorite(movie.id);

                return (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="relative flex-shrink-0 w-44 sm:w-52 md:w-60 lg:w-64 snap-start bg-dark-secondary rounded-xl overflow-hidden shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
                  >
                    <img
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title || 'Sem título'}
                      className="w-full h-64 md:h-80 lg:h-96 object-cover"
                      loading="lazy"
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (fav) removeFavorite(movie.id);
                        else {
                          addFavorite({
                            id: movie.id,
                            title: movie.title,
                            poster_path: movie.poster_path,
                            media_type: 'movie',
                            vote_average: movie.vote_average,
                            release_date: movie.release_date,
                          });
                        }
                      }}
                      className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 rounded-full p-2 transition z-10"
                      aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      {fav ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 text-red-500" fill="currentColor">
                          <path d="M12 21s-6.716-4.35-9.33-7.5C.7 11.18.9 7.9 3.05 6.05c1.9-1.64 4.6-1.36 6.2.28L12 9.08l2.75-2.75c1.6-1.64 4.3-1.92 6.2-.28 2.15 1.85 2.35 5.13.38 7.45C18.716 16.65 12 21 12 21z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>

                    <div className="p-4">
                      <h3 className="font-semibold text-base md:text-lg truncate">
                        {movie.title || 'Sem título'}
                      </h3>
                      <p className="text-sm text-text-secondary mt-1 flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        {movie.vote_average?.toFixed(1) || '—'} •{' '}
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}