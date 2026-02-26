export default function SkeletonRow({ title = 'Carregando...', count = 8 }) {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-56 bg-dark-secondary rounded animate-pulse" />
        <div className="flex space-x-3">
          <div className="h-10 w-10 bg-dark-secondary rounded-full animate-pulse" />
          <div className="h-10 w-10 bg-dark-secondary rounded-full animate-pulse" />
        </div>
      </div>

      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-44 sm:w-52 md:w-60 lg:w-64 bg-dark-secondary rounded-xl overflow-hidden shadow-xl"
          >
            <div className="w-full h-64 md:h-80 lg:h-96 bg-dark-tertiary animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 bg-dark-tertiary rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-dark-tertiary rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}