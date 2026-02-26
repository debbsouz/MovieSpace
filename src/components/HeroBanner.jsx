import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/tmdbApi';

export default function HeroBanner({ movie }) {
  if (!movie) return null;

  const title = movie.title || movie.name || 'Sem título';
  const backdrop = getImageUrl(movie.backdrop_path, 'original');

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] flex items-end">
      {/* imagem fundo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backdrop})` }}
      />

      {/* overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/70 to-transparent" />

      {/* conteúdo */}
      <div className="relative z-10 p-8 md:p-12 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>

        <p className="text-text-secondary line-clamp-3 mb-6">
          {movie.overview || 'Descrição não disponível'}
        </p>

        <div className="flex gap-4">
          <Link
            to={`/movie/${movie.id}`}
            className="bg-white text-black font-semibold px-6 py-3 rounded hover:bg-gray-200 transition"
          >
            ▶ Ver detalhes
          </Link>

          <button className="bg-dark-secondary text-white font-semibold px-6 py-3 rounded hover:bg-dark-tertiary transition">
            + Minha lista
          </button>
        </div>
      </div>
    </div>
  );
}