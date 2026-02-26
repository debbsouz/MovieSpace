import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  getMediaDetails,
  getMediaVideos,
  getMediaCredits,
  getMediaRecommendations,
  getImageUrl,
} from '../services/tmdbApi';
import { useFavorites } from '../contexts/FavoritesContext';
import TrailerModal from '../components/TrailerModal';
import MediaRow from '../components/MediaRow';

export default function MovieDetails() {
  // id vem da rota: /movie/:id ou /tv/:id
  const { id } = useParams();
  const location = useLocation();

  // eu não passo "type" pela rota aqui, então pego pelo path mesmo
  // se começou com /tv é série, senão considero movie
  const type = location.pathname.startsWith('/tv') ? 'tv' : 'movie';

  // dados principais
  const [media, setMedia] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  // extras (pra ficar com cara de streaming real)
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // estados padrão de request
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal do trailer
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Minha Lista
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    // carrega tudo junto pra ficar rápido e consistente
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [detailsData, videosData, creditsData, recData] = await Promise.all([
          getMediaDetails(type, id),
          getMediaVideos(type, id),
          getMediaCredits(type, id),
          getMediaRecommendations(type, id),
        ]);

        setMedia(detailsData);

        // recomendações (se vier vazio, só não aparece a seção)
        setRecommendations(recData?.results || []);

        // elenco (eu corto pra não ficar gigante na tela)
        setCast((creditsData?.cast || []).slice(0, 18));

        // a lista de vídeos pode vir vazia
        const results = videosData?.results || [];

        // prioridade: trailer oficial do YouTube
        let trailer = results.find(
          (vid) => vid.site === 'YouTube' && vid.type === 'Trailer' && vid.official
        );

        // fallback: qualquer Trailer do YouTube
        if (!trailer) {
          trailer = results.find((vid) => vid.site === 'YouTube' && vid.type === 'Trailer');
        }

        // último fallback: primeiro vídeo do YouTube
        if (!trailer) {
          trailer = results.find((vid) => vid.site === 'YouTube');
        }

        setTrailerKey(trailer?.key || null);
      } catch (err) {
        setError('Erro ao carregar detalhes. Tente outro título.');
        console.error('Erro completo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  // loading state
  if (loading) {
    return (
      <div className="pt-32 container mx-auto px-4 text-center">
        <p className="text-2xl text-text-secondary animate-pulse">Carregando detalhes...</p>
      </div>
    );
  }

  // erro / item não encontrado
  if (error || !media) {
    return (
      <div className="pt-32 container mx-auto px-4 text-center">
        <p className="text-2xl text-red-500">{error || 'Conteúdo não encontrado'}</p>
      </div>
    );
  }

  // normalizando campos (movie e tv usam nomes diferentes)
  const title = media.title || media.name || 'Sem título';
  const year = (media.release_date || media.first_air_date || '').slice(0, 4) || 'N/A';

  // movie tem runtime; tv eu mostro temporadas/eps (fica bem melhor do que N/A)
  const metaTime =
    type === 'movie'
      ? media.runtime
        ? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}min`
        : 'N/A'
      : media.number_of_seasons
        ? `${media.number_of_seasons} temporada(s)`
        : 'N/A';

  const genres = media.genres?.map((g) => g.name).join(', ') || 'N/A';

  // imagens: backdrop com qualidade alta e poster em w500
  const backdrop = getImageUrl(media.backdrop_path, 'original');
  const poster = getImageUrl(media.poster_path, 'w500');

  // favorito (Minha Lista)
  const fav = isFavorite(media.id);

  const handleToggleFavorite = () => {
    if (fav) {
      removeFavorite(media.id);
      return;
    }

    // guardo só o essencial (pra lista não ficar gigante no localStorage)
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
  };

  return (
    <div className="relative min-h-screen">
      {/* backdrop bem leve por trás, só pra dar clima */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${backdrop})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/90 to-transparent" />

      <div className="relative pt-32 pb-14 container mx-auto px-4 z-10">
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
              {year} • {metaTime} • {genres}
            </p>

            {/* nota e votos */}
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

            {/* ações principais */}
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

        {/* Elenco */}
        {cast.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl md:text-3xl font-semibold mb-5">Elenco</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((person) => {
                const photo = person.profile_path
                  ? getImageUrl(person.profile_path, 'w185')
                  : '/placeholder-profile.jpg';

                return (
                  <div
                    key={person.id}
                    className="bg-dark-secondary rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition"
                    title={person.name}
                  >
                    <img
                      src={photo}
                      alt={person.name}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                    <div className="p-3">
                      <p className="font-semibold text-sm truncate">{person.name}</p>
                      <p className="text-text-secondary text-xs mt-1 truncate">
                        {person.character || '—'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Recomendações (carrossel reutilizando MediaRow) */}
      <div className="container mx-auto px-4 pb-20">
        <MediaRow title="Recomendações" items={recommendations} type={type} />
      </div>

      {/* Modal do trailer (fecha no ESC e clicando fora) */}
      <TrailerModal
        open={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title={title}
        youtubeKey={trailerKey}
      />
    </div>
  );
}