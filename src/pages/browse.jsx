import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MediaRow from '../components/MediaRow';
import SkeletonRow from '../components/SkeletonRow';
import GenreChips from '../components/GenreChips';

import {
  getPopular,
  getTopRated,
  getNowPlayingMovies,
  getUpcomingMovies,
  getOnTheAirTV,
  getGenres,
  discoverByGenre,
} from '../services/tmdbApi';

export default function Browse() {
  const [params, setParams] = useSearchParams();

  // type = movie ou tv
  const type = params.get('type') === 'tv' ? 'tv' : 'movie';

  // genre = id do gênero escolhido (string ou null)
  const genre = params.get('genre') || '';

  // dados padrão
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [onTheAir, setOnTheAir] = useState([]);

  // gêneros
  const [genres, setGenres] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedGenreName = useMemo(() => {
    if (!genre) return '';
    const found = genres.find((g) => String(g.id) === String(genre));
    return found?.name || '';
  }, [genre, genres]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) carrega gêneros do type atual
        const genreRes = await getGenres(type);
        setGenres(genreRes?.genres || []);

        // 2) se tiver gênero selecionado, eu priorizo "discover"
        //    e uso isso pra popular/topRated/nowPlaying/etc virar "curado por gênero"
        if (genre) {
          const [p, t] = await Promise.all([
            discoverByGenre(type, genre, 1, 'popularity.desc'),
            discoverByGenre(type, genre, 1, 'vote_average.desc'),
          ]);

          setPopular(p.results || []);
          setTopRated(t.results || []);

          // se quiser mais linhas por gênero, dá pra adicionar:
          // - "release_date.desc" pra lançamentos
          // - "revenue.desc" só pra movies (não fica tão bom sempre)
          if (type === 'movie') {
            const [recent, upcomingLike] = await Promise.all([
              discoverByGenre('movie', genre, 1, 'primary_release_date.desc'),
              discoverByGenre('movie', genre, 1, 'popularity.desc'),
            ]);

            setNowPlaying(recent.results || []);
            setUpcoming(upcomingLike.results || []);
            setOnTheAir([]);
          } else {
            const [recentTv] = await Promise.all([
              discoverByGenre('tv', genre, 1, 'first_air_date.desc'),
            ]);

            setOnTheAir(recentTv.results || []);
            setNowPlaying([]);
            setUpcoming([]);
          }

          setLoading(false);
          return;
        }

        // 3) sem gênero: comportamento normal do Browse
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
  }, [type, genre]);

  const setTypeOnly = (nextType) => {
    // mantém gênero se quiser, mas normalmente eu limpo pra não confundir
    setParams({ type: nextType });
  };

  const setGenre = (genreId) => {
    setParams({ type, genre: String(genreId) });
  };

  const clearGenre = () => {
    setParams({ type });
  };

  return (
    <div className="pt-28 pb-16 container mx-auto px-4">
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Explorar {type === 'movie' ? 'Filmes' : 'Séries'}
            </h1>

            <p className="text-text-secondary mt-2">
              {genre
                ? `Filtrando por gênero: ${selectedGenreName || '...'}`
                : 'Categorias com carrosséis estilo streaming.'}
            </p>
          </div>

          <div className="flex bg-dark-secondary rounded-full p-1 border border-dark-tertiary w-fit">
            <button
              type="button"
              onClick={() => setTypeOnly('movie')}
              className={`px-4 py-2 rounded-full transition ${
                type === 'movie' ? 'bg-accent-red text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              Filmes
            </button>
            <button
              type="button"
              onClick={() => setTypeOnly('tv')}
              className={`px-4 py-2 rounded-full transition ${
                type === 'tv' ? 'bg-accent-red text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              Séries
            </button>
          </div>
        </div>

        {/* Chips de gêneros */}
        <div className="bg-dark-secondary/40 border border-dark-tertiary rounded-2xl p-4 md:p-5">
          <p className="text-text-secondary mb-3">
            Escolha um gênero pra “curar” as listas
          </p>

          <GenreChips
            genres={genres}
            selectedId={genre || null}
            onSelect={setGenre}
            onClear={clearGenre}
          />
        </div>
      </div>

      {loading && (
        <>
          <SkeletonRow title="Carregando..." />
          <SkeletonRow title="Carregando..." />
        </>
      )}

      {!loading && error && <p className="text-red-500 text-lg">{error}</p>}

      {!loading && !error && (
        <>
          <MediaRow
            title={genre ? `Em alta em ${selectedGenreName || 'gênero'}` : 'Populares'}
            items={popular}
            type={type}
          />

          <MediaRow
            title={genre ? `Melhores notas em ${selectedGenreName || 'gênero'}` : 'Melhores avaliados'}
            items={topRated}
            type={type}
          />

          {type === 'movie' ? (
            <>
              <MediaRow
                title={genre ? `Lançamentos em ${selectedGenreName || 'gênero'}` : 'Em cartaz'}
                items={nowPlaying}
                type="movie"
              />

              <MediaRow
                title={genre ? `Mais para você (${selectedGenreName || 'gênero'})` : 'Em breve'}
                items={upcoming}
                type="movie"
              />
            </>
          ) : (
            <MediaRow
              title={genre ? `Recém lançadas (${selectedGenreName || 'gênero'})` : 'No ar'}
              items={onTheAir}
              type="tv"
            />
          )}
        </>
      )}
    </div>
  );
}