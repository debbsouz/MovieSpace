import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) return;

    setLoading(true);
    setTimeout(() => {
      navigate('/');
    }, 900);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-bg to-black px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,9,20,0.08),transparent_60%)]" />
      </div>

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-dark-secondary/70 backdrop-blur-md shadow-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Acesse o MovieSpace</h1>
          <p className="text-text-secondary mt-2">Entre para continuar explorando</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-dark-bg/70 border border-dark-tertiary rounded-xl px-4 py-3 focus:outline-none focus:border-accent-red focus:ring-2 focus:ring-accent-red/30 transition-all duration-200 placeholder-text-secondary"
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-dark-bg/70 border border-dark-tertiary rounded-xl px-4 py-3 focus:outline-none focus:border-accent-red focus:ring-2 focus:ring-accent-red/30 transition-all duration-200 placeholder-text-secondary"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-red hover:bg-accent-red-hover py-3 rounded-xl font-semibold transition-all duration-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Entrando…
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <Link to="/" className="text-text-secondary hover:text-white transition">
            Entrar como visitante
          </Link>
          <Link to="/browse?type=movie" className="text-text-secondary hover:text-white transition">
            Explorar catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
