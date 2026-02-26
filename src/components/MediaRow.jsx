import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/tmdbApi';
import { useFavorites } from '../contexts/FavoritesContext';

export default function MediaRow({ title, items = [], type = 'movie' }) {
  // ref do carrossel pra eu conseguir “empurrar” ele pros lados com botão
  const carouselRef = useRef(null);

  // favoritos (Minha Lista)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // scroll padrão estilo streaming
  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  // se não tem itens, não renderiza nada (evita seção vazia)
  if (!items.length) return null;

  return (
    // group: uso pra mostrar os botões laterais só no hover
    <section className="mb-16 relative group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
      </div>

      <div className="relative">
        {/* Botões laterais (mesmo estilo do Home) */}
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     bg-black/40 hover:bg-black/60 backdrop-blur
                     text-white rounded-full w-12 h-12 flex items-center justify-center"
          aria-label="Voltar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     bg-black/40 hover:bg-black/60 backdrop-blur
                     text-white rounded-full w-12 h-12 flex items-center justify-center"
          aria-label="Avançar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Fade nas bordas pra dar aquele “efeito streaming” */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-r from-dark-bg to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-l from-dark-bg to-transparent" />

        {/* Carrossel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        >
          {items.map((item) => {
            const id = item.id;
            const name = item.title || item.name || 'Sem título';
            const rating = item.vote_average?.toFixed(1) || '—';
            const year = (item.release_date || item.first_air_date || '').slice(0, 4) || 'N/A';
            const fav = isFavorite(id);

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

                {/* Overlay do hover com info + ações */}
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
                      {/* Aqui é só visual, o clique do card já vai pros detalhes */}
                      <div className="bg-white text-black font-semibold px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition">
                        Ver detalhes
                      </div>

                      {/* Botão de lista: não pode navegar quando clicar nele */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          if (fav) {
                            removeFavorite(id);
                          } else {
                            addFavorite({
                              id,
                              title: item.title,
                              name: item.name,
                              poster_path: item.poster_path,
                              media_type: type,
                              vote_average: item.vote_average,
                              release_date: item.release_date,
                              first_air_date: item.first_air_date,
                            });
                          }
                        }}
                        className="bg-dark-secondary/80 text-white px-3 py-2 rounded-lg text-sm border border-white/10 hover:bg-dark-tertiary transition"
                      >
                        {fav ? 'Remover' : '+ Lista'}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}