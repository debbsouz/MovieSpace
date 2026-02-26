// src/components/MediaRow.jsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/tmdbApi';

export default function MediaRow({ title, items = [], type = 'movie' }) {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <section className="mb-16 relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>

        <div className="flex space-x-3">
          <button
            onClick={scrollLeft}
            className="bg-dark-secondary hover:bg-dark-tertiary text-white px-3 py-2 rounded-full transition shadow-md"
            aria-label="Scroll esquerda"
            type="button"
          >
            ←
          </button>
          <button
            onClick={scrollRight}
            className="bg-dark-secondary hover:bg-dark-tertiary text-white px-3 py-2 rounded-full transition shadow-md"
            aria-label="Scroll direita"
            type="button"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        {items.map((item) => {
          const id = item.id;
          const name = item.title || item.name || 'Sem título';

          return (
            <Link
              key={id}
              to={`/${type}/${id}`}
              className="relative flex-shrink-0 w-44 sm:w-52 md:w-60 lg:w-64 snap-start bg-dark-secondary rounded-xl overflow-hidden shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={getImageUrl(item.poster_path)}
                alt={name}
                className="w-full h-64 md:h-80 lg:h-96 object-cover"
                loading="lazy"
              />

              <div className="p-4">
                <h3 className="font-semibold text-base md:text-lg truncate">{name}</h3>

                <p className="text-sm text-text-secondary mt-1 flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  {item.vote_average?.toFixed(1) || '—'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}