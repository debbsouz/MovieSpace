export default function GenreChips({
  genres = [],
  selectedId = null,
  onSelect,
  onClear,
}) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      <button
        type="button"
        onClick={onClear}
        className={`px-4 py-2 rounded-full transition border ${
          !selectedId
            ? 'bg-white text-black border-white'
            : 'bg-dark-secondary text-text-secondary border-dark-tertiary hover:text-white'
        }`}
      >
        Todos
      </button>

      {genres.map((g) => {
        const active = String(selectedId) === String(g.id);

        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onSelect(g.id)}
            className={`px-4 py-2 rounded-full transition border ${
              active
                ? 'bg-accent-red text-white border-accent-red'
                : 'bg-dark-secondary text-text-secondary border-dark-tertiary hover:text-white'
            }`}
          >
            {g.name}
          </button>
        );
      })}
    </div>
  );
}