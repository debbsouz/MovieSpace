// src/pages/Home.jsx
import { useState, useEffect, useRef } from 'react';
import { getPopularMovies, getImageUrl } from '../services/tmdbApi';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await getPopularMovies();
        setMovies(data.results.slice(0, 20)); // mais itens para scroll
      } catch (err) {
        setError('Erro ao carregar filmes. Verifique sua conexão ou API Key.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  // Funções para scroll com setas
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24 pb-12 container mx-auto px-4">
      <h1 className="text-5xl font-bold text-accent-red text-center mb-10">
        Bem-vindo ao MovieSpace
      </h1>

      <section className="mb-16 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-semibold">Populares</h2>
          {/* Setas de navegação */}
          <div className="flex space-x-4">
            <button
              onClick={scrollLeft}
              className="bg-dark-secondary hover:bg-dark-tertiary text-white p-3 rounded-full transition"
              aria-label="Scroll esquerda"
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              className="bg-dark-secondary hover:bg-dark-tertiary text-white p-3 rounded-full transition"
              aria-label="Scroll direita"
            >
              →
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-center text-xl text-text-secondary">Carregando filmes...</p>
        )}

        {error && (
          <p className="text-red-500 text-center text-xl">{error}</p>
        )}

        {!loading && !error && movies.length > 0 && (
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // esconde scrollbar no Firefox/IE
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-48 md:w-56 snap-start bg-dark-secondary rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-base truncate">{movie.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    ⭐ {movie.vote_average.toFixed(1)} • {new Date(movie.release_date).getFullYear() || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}