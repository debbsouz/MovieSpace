import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchMedia } from '../services/tmdbApi';

export default function Header() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchMedia(query);

        // ✅ Só movie/tv (remove "person" e outros)
        const filtered = (data.results || []).filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv'
        );

        setResults(filtered.slice(0, 6));
        setShowDropdown(true);
      } catch (err) {
        console.error('Erro na busca:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  const goToSearchPage = () => {
    const q = query.trim();
    if (!q) return;

    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-dark-bg/95 backdrop-blur-md z-50 border-b border-dark-secondary shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl md:text-4xl font-bold text-accent-red hover:text-accent-red-hover transition-colors duration-200 whitespace-nowrap"
        >
          MovieSpace
        </Link>

        {/* Menu simples (desktop) */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-text-secondary hover:text-white transition">
            Home
          </Link>

          {/* ✅ como você não tem rota /filmes e /series ainda, apontamos pra busca */}
          <Link to="/search?q=movie" className="text-text-secondary hover:text-white transition">
            Filmes
          </Link>
          <Link to="/search?q=tv" className="text-text-secondary hover:text-white transition">
            Séries
          </Link>

          <Link to="/minha-lista" className="text-text-secondary hover:text-white transition">
            Minha Lista
          </Link>
        </nav>

        {/* Campo de busca */}
        <div className="relative w-full max-w-xs md:max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 3 && setShowDropdown(true)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                goToSearchPage();
              }
            }}
            placeholder="Buscar filmes, séries..."
            className="w-full bg-dark-secondary text-text-primary placeholder-text-secondary 
                       border border-dark-tertiary rounded-full py-2.5 px-5 
                       focus:outline-none focus:border-accent-red focus:ring-1 focus:ring-accent-red/50 
                       transition-all duration-200"
          />

          {/* Dropdown de resultados */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-dark-secondary border border-dark-tertiary rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50 divide-y divide-dark-tertiary">
              {loading ? (
                <div className="p-6 text-center text-text-secondary">Buscando...</div>
              ) : results.length > 0 ? (
                results.map((item) => {
                  const title = item.title || item.name || 'Sem título';
                  const year = (item.release_date || item.first_air_date || '').slice(0, 4) || 'N/A';
                  const label = item.media_type === 'movie' ? 'Filme' : 'Série';

                  return (
                    <Link
                      key={`${item.media_type}-${item.id}`}
                      to={`/${item.media_type}/${item.id}`}
                      className="flex items-center p-3 hover:bg-dark-tertiary transition-colors duration-150"
                      onClick={() => {
                        setShowDropdown(false);
                        setQuery('');
                      }}
                    >
                      <img
                        src={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                            : '/placeholder-poster.jpg'
                        }
                        alt={title}
                        className="w-12 h-16 object-cover rounded mr-4 flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{title}</p>
                        <p className="text-sm text-text-secondary">
                          {label} • {year}
                        </p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-6 text-center text-text-secondary">Nenhum resultado encontrado</div>
              )}

              {/* ✅ CTA pra ver todos os resultados */}
              {!loading && query.trim().length >= 3 && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // evita perder foco antes do click
                  onClick={goToSearchPage}
                  className="w-full text-left p-4 text-accent-red hover:bg-dark-tertiary transition"
                >
                  Ver todos os resultados para “{query.trim()}”
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}