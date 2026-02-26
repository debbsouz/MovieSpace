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

  // pego o tipo pela URL (?type=movie|tv)
  // qualquer coisa diferente de tv eu considero movie, pra não quebrar
  const type = params.get('type') === 'tv' ? 'tv' : 'movie';

  // listas que aparecem em carrossel (cada uma vira um <MediaRow />)
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [onTheAir, setOnTheAir] = useState([]);

  // estados básicos de request
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // carrega as categorias de acordo com o tipo (movie ou tv)
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        if (type === 'movie') {
          // Promise.all aqui deixa bem mais rápido do que buscar um por um
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

          // quando estou em movie, eu limpo o que é exclusivo de tv
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

          // quando estou em tv, eu limpo o que é exclusivo de movie
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

        {/* toggle simples pra alternar entre Filmes e Séries
            (isso só muda o query param, e o useEffect faz o resto) */}
        <div className="flex bg-dark-secondary rounded-full p-1 border border-dark-tertiary">
          <button
            type="button"
            onClick={() => setParams({ type: 'movie' })}
            className={`px-4 py-2 rounded-full transition ${
              type === 'movie'
                ? 'bg-accent-red text-white'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Filmes
          </button>

          <button
            type="button"
            onClick={() => setParams({ type: 'tv' })}
            className={`px-4 py-2 rounded-full transition ${
              type === 'tv'
                ? 'bg-accent-red text-white'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Séries
          </button>
        </div>
      </div>

      {/* loading: skeleton pra não ficar “tela vazia” */}
      {loading && (
        <>
          <SkeletonRow title="Carregando..." />
          <SkeletonRow title="Carregando..." />
        </>
      )}

      {/* erro */}
      {!loading && error && <p className="text-red-500 text-lg">{error}</p>}

      {/* conteúdo */}
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