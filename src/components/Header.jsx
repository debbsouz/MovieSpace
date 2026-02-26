import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchMedia } from '../services/tmdbApi';

export default function Header() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // avatar dropdown
  const [openAvatar, setOpenAvatar] = useState(false);
  const avatarRef = useRef(null);

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

        const filtered = (data?.results || []).filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv'
        );

        setResults(filtered.slice(0, 6));
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // fechar dropdown avatar ao clicar fora
  useEffect(() => {
    const handleClick = (e) => {
      if (!avatarRef.current?.contains(e.target)) {
        setOpenAvatar(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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

        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl md:text-4xl font-bold text-accent-red hover:text-accent-red-hover transition"
        >
          MovieSpace
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-text-secondary hover:text-white transition">
            Home
          </Link>

          <Link to="/browse?type=movie" className="text-text-secondary hover:text-white transition">
            Filmes
          </Link>

          <Link to="/browse?type=tv" className="text-text-secondary hover:text-white transition">
            Séries
          </Link>

          <Link
            to="/trending?type=all&time=week&page=1"
            className="text-text-secondary hover:text-white transition"
          >
            Trending
          </Link>

          <Link to="/minha-lista" className="text-text-secondary hover:text-white transition">
            Minha Lista
          </Link>
        </nav>

        {/* SEARCH + AVATAR */}
        <div className="flex items-center gap-4 w-full max-w-md">

          {/* SEARCH */}
          <div className="relative flex-1">
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
              placeholder="Buscar..."
              className="w-full bg-dark-secondary border border-dark-tertiary rounded-full py-2 px-4 focus:outline-none focus:border-accent-red"
            />

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-dark-secondary rounded-xl shadow-2xl z-50">
                {loading ? (
                  <div className="p-4 text-center">Buscando...</div>
                ) : (
                  results.map((item) => {
                    const title = item.title || item.name || 'Sem título';

                    return (
                      <Link
                        key={item.id}
                        to={`/${item.media_type}/${item.id}`}
                        className="block p-3 hover:bg-dark-tertiary"
                        onClick={() => setQuery('')}
                      >
                        {title}
                      </Link>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* AVATAR */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setOpenAvatar((p) => !p)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white"
            >
              D
            </button>

            {openAvatar && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-secondary border border-dark-tertiary rounded-xl shadow-2xl overflow-hidden">
                <Link
                  to="/minha-lista"
                  className="block px-4 py-3 hover:bg-dark-tertiary"
                  onClick={() => setOpenAvatar(false)}
                >
                  Minha Lista
                </Link>

                <button
                  className="w-full text-left px-4 py-3 hover:bg-dark-tertiary"
                  onClick={() => {
                    setOpenAvatar(false);
                    navigate('/login');
                  }}
                >
                  Trocar conta
                </button>

                <button
                  className="w-full text-left px-4 py-3 hover:bg-dark-tertiary text-red-400"
                  onClick={() => {
                    setOpenAvatar(false);
                    navigate('/login');
                  }}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}