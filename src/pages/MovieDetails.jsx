import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getMediaDetails, getMediaVideos, getImageUrl } from '../services/tmdbApi';
import { useFavorites } from '../contexts/FavoritesContext';
import TrailerModal from '../components/TrailerModal';

export default function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();

  const type = location.pathname.startsWith('/tv') ? 'tv' : 'movie';

  const [media, setMedia] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [detailsData, videosData] = await Promise.all([
          getMediaDetails(type, id),
          getMediaVideos(type, id),
        ]);

        setMedia(detailsData);

        const results = videosData?.results || [];

        let trailer = results.find(
          (vid) => vid.site === 'YouTube' && vid.type === 'Trailer' && vid.official
        );

        if (!trailer) {
          trailer = results.find(
            (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
          );
        }

        if (!trailer) {
          trailer = results.find((vid) => vid.site === 'YouTube');
        }

        setTrailerKey(trailer?.key || null);
      } catch (err) {
        setError('Erro ao carregar detalhes ou trailer. Tente outro título.');
        console.error('Erro completo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  if (loading) {
    return (
      <div className="pt-32 container mx-auto px-4 text-center">
        <p className="text-2xl text-text-secondary animate-pulse">Carregando detalhes...</p>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="pt-32 container mx-auto px-4 text-center">
        <p className="text-2xl text-red-500">{error || 'Conteúdo não encontrado'}</p>
      </div>
    );
  }

  const title = media.title || media.name || 'Sem título';
  const year = (media.release_date || media.first_air_date || '').slice(0, 4) || 'N/A';
  const runtime = media.runtime
    ? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}min`
    : 'N/A';
  const genres = media.genres?.map((g) => g.name).join(', ') || 'N/A';
  const backdrop = getImageUrl(media.backdrop_path, 'original');
  const poster = getImageUrl(media.poster_path, 'w500');

  const fav = isFavorite(media.id);

  const handleToggleFavorite = () => {
    if (fav) {
      removeFavorite(media.id);
    } else {
      addFavorite({
        id: media.id,
        title: media.title,
        name: media.name,
        poster_path: media.poster_path,
        media_type: type,
        vote_average: media.vote_average,
        release_date: media.release_date,
        first_air_date: media.first_air_date,
      });
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${backdrop})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/90 to-transparent" />

      <div className="relative pt-32 pb-20 container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row gap-10">
          <img
            src={poster}
            alt={title}
            className="w-64 md:w-80 lg:w-96 rounded-lg shadow-2xl object-cover mx-auto md:mx-0"
            loading="lazy"
          />

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

            <p className="text-lg text-text-secondary mb-6">
              {year} • {runtime} • {genres}
            </p>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-accent-red mr-3">
                {media.vote_average?.toFixed(1) || '—'}
              </span>
              <span className="text-xl">/ 10 ({media.vote_count || 0} votos)</span>
            </div>

            <h2 className="text-2xl font-semibold mb-3">Sinopse</h2>
            <p className="text-text-primary leading-relaxed mb-8">
              {media.overview || 'Sinopse não disponível.'}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleToggleFavorite}
                type="button"
                className="bg-accent-red hover:bg-accent-red-hover text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
              >
                {fav ? 'Remover da Minha Lista' : '+ Adicionar à Minha Lista'}
              </button>

              <button
                type="button"
                onClick={() => trailerKey && setIsTrailerOpen(true)}
                disabled={!trailerKey}
                className={`font-semibold py-3 px-6 rounded-lg transition duration-300 border ${
                  trailerKey
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-white/10 text-white/40 border-white/10 cursor-not-allowed'
                }`}
              >
                Assistir trailer
              </button>
            </div>

            {!trailerKey && (
              <p className="text-text-secondary mt-4">
                Trailer não disponível para este título.
              </p>
            )}
          </div>
        </div>
      </div>

      <TrailerModal
        open={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title={title}
        youtubeKey={trailerKey}
      />
    </div>
  );
}