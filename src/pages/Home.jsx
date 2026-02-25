// src/pages/Home.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext'; // ajuste o caminho se necessário
import { getPopularMovies, getImageUrl } from '../services/tmdbApi';

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
        setMovies(data.results.slice(0, 20));
      } catch (err) {
        setError('Erro ao carregar filmes. Verifique sua conexão ou API Key.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24 pb-16 container mx-auto px-4">
      <h1 className="text-5xl md:text-6xl font-bold text-accent-red text-center mb-12">
        Bem-vindo ao MovieSpace
      </h1>

      <section className="mb-16 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl font-semibold">Populares</h2>
          <div className="flex space-x-4">
            <button
              onClick={scrollLeft}
              className="bg-dark-secondary hover:bg-dark-tertiary text-white p-3 rounded-full transition shadow-md"
              aria-label="Scroll para esquerda"
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              className="bg-dark-secondary hover:bg-dark-tertiary text-white p-3 rounded-full transition shadow-md"
              aria-label="Scroll para direita"
            >
              →
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-center text-xl text-text-secondary animate-pulse">
            Carregando filmes...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center text-xl">{error}</p>
        )}

        {!loading && !error && movies.length > 0 && (
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
                  className="relative flex-shrink-0 w-44 sm:w-52 md:w-60 lg:w-64 snap-start 
                             bg-dark-secondary rounded-xl overflow-hidden shadow-xl 
                             hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-64 md:h-80 lg:h-96 object-cover"
                    loading="lazy"
                  />

                  {/* Botão de coração */}
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
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-7 w-7 ${isFav ? 'text-red-500 fill-current' : 'text-white stroke-current'}`}
                      fill={isFav ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={isFav ? 0 : 2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>

                  <div className="p-4">
                    <h3 className="font-semibold text-base md:text-lg truncate">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1 flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      {movie.vote_average.toFixed(1)} • {new Date(movie.release_date).getFullYear() || 'N/A'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}