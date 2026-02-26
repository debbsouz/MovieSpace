import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getTopRated, getImageUrl } from '../services/tmdbApi';

export default function TopRated() {
  const [params, setParams] = useSearchParams();
  const type = params.get('type') === 'tv' ? 'tv' : 'movie';
  const page = Number(params.get('page') || 1);

  const [data, setData] = useState({ results: [], total_pages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await getTopRated(type, page);
      setData(res);
      setLoading(false);
    };
    run();
  }, [type, page]);

  return (
    <div className="pt-28 pb-16 container mx-auto px-4">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          Top Rated {type === 'movie' ? 'Filmes' : 'Séries'}
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setParams({ type: 'movie', page: 1 })}
            className={`px-4 py-2 rounded-full ${
              type === 'movie' ? 'bg-accent-red text-white' : 'bg-dark-secondary'
            }`}
          >
            Filmes
          </button>
          <button
            onClick={() => setParams({ type: 'tv', page: 1 })}
            className={`px-4 py-2 rounded-full ${
              type === 'tv' ? 'bg-accent-red text-white' : 'bg-dark-secondary'
            }`}
          >
            Séries
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-text-secondary">Carregando...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {data.results.map((item) => {
              const title = item.title || item.name;
              const mediaType = type;

              return (
                <Link
                  key={item.id}
                  to={`/${mediaType}/${item.id}`}
                  className="bg-dark-secondary rounded-xl overflow-hidden shadow-xl hover:scale-[1.02] transition"
                >
                  <img
                    src={getImageUrl(item.poster_path)}
                    alt={title}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="p-3">
                    <p className="font-semibold truncate">{title}</p>
                    <p className="text-sm text-text-secondary">
                      ★ {item.vote_average?.toFixed(1)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* PAGINAÇÃO */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setParams({ type, page: page - 1 })}
              className="px-4 py-2 bg-dark-secondary rounded disabled:opacity-40"
            >
              ←
            </button>

            <span className="text-lg">
              {page} / {Math.min(data.total_pages, 500)}
            </span>

            <button
              disabled={page >= data.total_pages}
              onClick={() => setParams({ type, page: page + 1 })}
              className="px-4 py-2 bg-dark-secondary rounded disabled:opacity-40"
            >
              →
            </button>
          </div>
        </>
      )}
    </div>
  );
}