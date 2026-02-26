import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { getImageUrl } from '../services/tmdbApi';

export default function MyList() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();

  const [filter, setFilter] = useState('all'); // all | movie | tv
  const [sort, setSort] = useState('added'); // added | rating | year | az
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    let arr = [...(favorites || [])];

    if (filter !== 'all') {
      arr = arr.filter((item) => (item.media_type || item.mediaType) === filter);
    }

    if (query) {
      arr = arr.filter((item) => {
        const title = (item.title || item.name || '').toLowerCase();
        return title.includes(query);
      });
    }

    if (sort === 'rating') {
      arr.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sort === 'year') {
      arr.sort((a, b) => {
        const ay = Number((a.release_date || a.first_air_date || '').slice(0, 4)) || 0;
        const by = Number((b.release_date || b.first_air_date || '').slice(0, 4)) || 0;
        return by - ay;
      });
    } else if (sort === 'az') {
      arr.sort((a, b) => {
        const at = (a.title || a.name || '').toLowerCase();
        const bt = (b.title || b.name || '').toLowerCase();
        return at.localeCompare(bt);
      });
    }
    // sort === 'added' -> mantém ordem atual (como você salva)

    return arr;
  }, [favorites, filter, sort, q]);

  return (
    <div className="pt-28 pb-16 container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Minha Lista</h1>
          <p className="text-text-secondary mt-2">
            {filtered.length} item(s) {filter !== 'all' ? `(${filter.toUpperCase()})` : ''}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar na sua lista..."
            className="w-full sm:w-64 bg-dark-secondary text-text-primary placeholder-text-secondary border border-dark-tertiary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent-red focus:ring-1 focus:ring-accent-red/50"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-dark-secondary text-text-primary border border-dark-tertiary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent-red"
          >
            <option value="all">Todos</option>
            <option value="movie">Filmes</option>
            <option value="tv">Séries</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-dark-secondary text-text-primary border border-dark-tertiary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent-red"
          >
            <option value="added">Adicionados</option>
            <option value="rating">Nota</option>
            <option value="year">Ano</option>
            <option value="az">A–Z</option>
          </select>

          <button
            type="button"
            onClick={clearFavorites}
            disabled={!favorites?.length}
            className={`rounded-lg py-2.5 px-4 font-semibold transition border ${
              favorites?.length
                ? 'bg-dark-secondary hover:bg-dark-tertiary text-white border-dark-tertiary'
                : 'bg-dark-secondary/40 text-white/30 border-dark-tertiary/40 cursor-not-allowed'
            }`}
          >
            Limpar
          </button>
        </div>
      </div>

      {favorites?.length === 0 ? (
        <div className="bg-dark-secondary rounded-xl p-8 text-center border border-dark-tertiary">
          <p className="text-xl text-text-secondary">Sua lista está vazia.</p>
          <Link
            to="/browse?type=movie"
            className="inline-block mt-5 bg-accent-red hover:bg-accent-red-hover text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Explorar filmes
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-dark-secondary rounded-xl p-8 text-center border border-dark-tertiary">
          <p className="text-xl text-text-secondary">Nenhum item encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtered.map((item) => {
            const title = item.title || item.name || 'Sem título';
            const type = item.media_type || 'movie';
            const year = (item.release_date || item.first_air_date || '').slice(0, 4) || 'N/A';

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
                  loading="lazy"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFavorite(item.id);
                  }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 rounded-full p-2 transition"
                  aria-label="Remover"
                >
                  <span className="text-white">×</span>
                </button>

                <div className="p-3">
                  <p className="font-semibold truncate">{title}</p>
                  <p className="text-sm text-text-secondary mt-1">
                    ★ {item.vote_average?.toFixed(1) || '—'} • {year} • {type.toUpperCase()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}