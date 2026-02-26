import { getImageUrl } from '../services/tmdbApi';

export default function CastRow({ cast = [] }) {
  if (!cast.length) return null;

  return (
    <section className="mt-14">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Elenco</h2>

      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {cast.slice(0, 20).map((person) => (
          <div
            key={person.cast_id || person.credit_id}
            className="w-32 flex-shrink-0 bg-dark-secondary rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={getImageUrl(person.profile_path)}
              alt={person.name}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
            <div className="p-2">
              <p className="text-sm font-semibold truncate">{person.name}</p>
              <p className="text-xs text-text-secondary truncate">
                {person.character || '—'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}