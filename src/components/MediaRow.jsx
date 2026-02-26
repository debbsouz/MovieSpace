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
          const rating = item.vote_average?.toFixed(1) || '—';
          const year = (item.release_date || item.first_air_date || '').slice(0, 4) || 'N/A';

          return (
            <Link
              key={id}
              to={`/${type}/${id}`}
              className="group relative flex-shrink-0 w-44 sm:w-52 md:w-60 lg:w-64 snap-start rounded-xl overflow-hidden shadow-xl bg-dark-secondary transition-transform duration-300 hover:shadow-2xl hover:scale-105"
            >
              <img
                src={getImageUrl(item.poster_path)}
                alt={name}
                className="w-full h-64 md:h-80 lg:h-96 object-cover"
                loading="lazy"
              />

              {/* Overlay hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-semibold text-base md:text-lg leading-tight line-clamp-2">
                    {name}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-text-secondary mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white">{rating}</span>
                    <span>•</span>
                    <span>{year}</span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <div className="bg-white text-black font-semibold px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition">
                      Ver detalhes
                    </div>
                    <div className="bg-dark-secondary/80 text-white px-3 py-2 rounded-lg text-sm border border-white/10 hover:bg-dark-tertiary transition">
                      + Lista
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}