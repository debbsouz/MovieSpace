import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Placeholder para Header (vamos criar depois)
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-dark-bg/90 backdrop-blur-md z-50 border-b border-dark-tertiary">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-accent-red">MovieSpace</h1>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-text-secondary hover:text-text-primary transition">Filmes</a>
          <a href="#" className="text-text-secondary hover:text-text-primary transition">Séries</a>
          <a href="#" className="text-text-secondary hover:text-text-primary transition">Minha Lista</a>
        </nav>
        <div className="w-40 bg-dark-secondary h-10 rounded-md animate-pulse" /> {/* Placeholder para busca */}
      </div>
    </header>
  );
}

function Home() {
  return (
    <div className="pt-24 container mx-auto px-4">
      <h1 className="text-5xl font-bold text-accent-red mb-8 text-center">Bem-vindo ao MovieSpace</h1>
      <p className="text-xl text-text-secondary text-center mb-12 max-w-2xl mx-auto">
        Descubra os melhores filmes e séries em um ambiente dark e imersivo.
      </p>
      {/* Placeholder para seções/carrosséis */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Em Destaque</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* 4 cards placeholder */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-dark-secondary rounded-lg overflow-hidden h-64 animate-pulse" />
          ))}
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-dark-bg text-text-primary min-h-screen">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Futura rota de detalhes */}
            {/* <Route path="/movie/:id" element={<MovieDetails />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;