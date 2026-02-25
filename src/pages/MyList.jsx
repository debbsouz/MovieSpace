// src/pages/MyList.jsx
import { useFavorites } from '../contexts/FavoritesContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/tmdbApi';

export default function MyList() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="pt-24 pb-20 container mx-auto px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-accent-red mb-12 text-center">
        Minha Lista
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl md:text-2xl text-text-secondary mb-6">
            Você ainda não adicionou nenhum filme ou série aos favoritos.
          </p>
          <p className="text-lg text-text-secondary">
            Volte para a Home e clique no coração ❤️ em algum título para adicionar aqui!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {favorites.map((item) => {
            const title = item.title || item.name || 'Sem título';
            const year = (item.release_date || item.first_air_date || '').slice(0, 4) || 'N/A';

            return (
              <div 
                key={item.id}
                className="relative bg-dark-secondary rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 group"
              >
                <Link to={`/${item.media_type}/${item.id}`}>
                  <img
                    src={getImageUrl(item.poster_path)}
                    alt={title}
                    className="w-full h-72 md:h-80 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-base md:text-lg truncate">{title}</h3>
                    <p className="text-sm text-text-secondary mt-1 flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      {item.vote_average.toFixed(1)} • {year}
                    </p>
                  </div>
                </Link>

                {/* Botão remover */}
                <button
                  onClick={() => removeFavorite(item.id)}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-red-600/80 rounded-full p-2.5 transition z-10 opacity-80 hover:opacity-100"
                  aria-label="Remover dos favoritos"
                >
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}