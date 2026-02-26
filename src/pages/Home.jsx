import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { getPopularMovies, getImageUrl } from '../services/tmdbApi';

import HeroBanner from '../components/HeroBanner';
import SkeletonRow from '../components/SkeletonRow';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await getPopularMovies();
        setMovies(data.results || []);
      } catch (err) {
        setError('Erro ao carregar filmes. Verifique conexão ou API Key.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <div className="pb-16">
      
      {/* HERO BANNER */}
      {!loading && movies.length > 0 && <HeroBanner movie={movies[0]} />}

      <div className="container mx-auto px-4 pt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-accent-red text-center mb-12">
          Bem-vindo ao MovieSpace
        </h1>

        {/* LOADING SKELETON */}
        {loading && <SkeletonRow title="Populares" />}

        {/* ERRO */}
        {error && <p className="text-red-500 text-center text-xl">{error}</p>}

        {/* CARROSSEL POPULARES */}
        {!loading && !error && movies.length > 0 && (
          <section className="mb-16 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl md:text-4xl font-semibold">Populares</h2>

              <div className="flex space-x-4">
                <button
                  onClick={scrollLeft}
                  className="bg-dark-secondary hover:bg-dark-tertiary text-white p-3 rounded-full transition shadow-md"
                >
                  ←
                </button>

                <button
                  onClick={scrollRight}
                  className="bg-dark-secondary hover:bg-dark-tertiary text-white p-3 rounded-full transition shadow-md"
                >
                  →
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            >
              {movies.map((movie) => {
                const isFav = isFavorite(movie.id);

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
                    />

 <button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFav) {
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
  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 rounded-full p-2 transition z-10"
  aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
  type="button"
>
  {isFav ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="currentColor"
    >
      <path d="M12 21s-6.716-4.35-9.33-7.5C.7 11.18.9 7.9 3.05 6.05c1.9-1.64 4.6-1.36 6.2.28L12 9.08l2.75-2.75c1.6-1.64 4.3-1.92 6.2-.28 2.15 1.85 2.35 5.13.38 7.45C18.716 16.65 12 21 12 21z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-7 w-7"
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

                    <div className="p-4">
                      <h3 className="font-semibold text-base md:text-lg truncate">
                        {movie.title || 'Sem título'}
                      </h3>

                      <p className="text-sm text-text-secondary mt-1">
                        ★ {movie.vote_average?.toFixed(1) || '—'}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}