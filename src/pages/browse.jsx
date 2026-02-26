import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MediaRow from '../components/MediaRow';
import SkeletonRow from '../components/SkeletonRow';
import {
  getPopular,
  getTopRated,
  getNowPlayingMovies,
  getUpcomingMovies,
  getOnTheAirTV,
} from '../services/tmdbApi';

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const type = params.get('type') === 'tv' ? 'tv' : 'movie';

  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [onTheAir, setOnTheAir] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        if (type === 'movie') {
          const [p, t, n, u] = await Promise.all([
            getPopular('movie'),
            getTopRated('movie'),
            getNowPlayingMovies(),
            getUpcomingMovies(),
          ]);

          setPopular(p.results || []);
          setTopRated(t.results || []);
          setNowPlaying(n.results || []);
          setUpcoming(u.results || []);
          setOnTheAir([]);
        } else {
          const [p, t, o] = await Promise.all([
            getPopular('tv'),
            getTopRated('tv'),
            getOnTheAirTV(),
          ]);

          setPopular(p.results || []);
          setTopRated(t.results || []);
          setOnTheAir(o.results || []);
          setNowPlaying([]);
          setUpcoming([]);
        }
      } catch (e) {
        console.error(e);
        setError('Erro ao carregar categorias.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [type]);

  return (
    <div className="pt-28 pb-16 container mx-auto px-4">
      <div className="flex items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Explorar {type === 'movie' ? 'Filmes' : 'Séries'}
          </h1>
          <p className="text-text-secondary mt-2">
            Categorias com carrosséis estilo streaming.
          </p>
        </div>

        <div className="flex bg-dark-secondary rounded-full p-1 border border-dark-tertiary">
          <button
            type="button"
            onClick={() => setParams({ type: 'movie' })}
            className={`px-4 py-2 rounded-full transition ${
              type === 'movie' ? 'bg-accent-red text-white' : 'text-text-secondary hover:text-white'
            }`}
          >
            Filmes
          </button>
          <button
            type="button"
            onClick={() => setParams({ type: 'tv' })}
            className={`px-4 py-2 rounded-full transition ${
              type === 'tv' ? 'bg-accent-red text-white' : 'text-text-secondary hover:text-white'
            }`}
          >
            Séries
          </button>
        </div>
      </div>

      {loading && (
        <>
          <SkeletonRow title="Carregando..." />
          <SkeletonRow title="Carregando..." />
        </>
      )}

      {!loading && error && (
        <p className="text-red-500 text-lg">{error}</p>
      )}

      {!loading && !error && (
        <>
          <MediaRow title="Populares" items={popular} type={type} />
          <MediaRow title="Melhores avaliados" items={topRated} type={type} />

          {type === 'movie' ? (
            <>
              <MediaRow title="Em cartaz" items={nowPlaying} type="movie" />
              <MediaRow title="Em breve" items={upcoming} type="movie" />
            </>
          ) : (
            <MediaRow title="No ar" items={onTheAir} type="tv" />
          )}
        </>
      )}
    </div>
  );
}