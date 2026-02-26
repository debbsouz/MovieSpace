import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  // estado simples dos inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // fake login (só navega)
    if (!email || !password) return;

    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div className="w-full max-w-md bg-dark-secondary border border-dark-tertiary rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">Entrar</h1>

        <p className="text-text-secondary text-center mb-8">
          Acesse sua conta para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-dark-bg border border-dark-tertiary rounded-lg px-4 py-3 focus:outline-none focus:border-accent-red"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-dark-bg border border-dark-tertiary rounded-lg px-4 py-3 focus:outline-none focus:border-accent-red"
          />

          <button
            type="submit"
            className="w-full bg-accent-red hover:bg-accent-red-hover py-3 rounded-lg font-semibold transition"
          >
            Entrar
          </button>
        </form>

        <Link
          to="/"
          className="block text-center mt-6 text-text-secondary hover:text-white transition"
        >
          ← Voltar
        </Link>
      </div>
    </div>
  );
}