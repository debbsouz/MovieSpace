function App() {
  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex flex-col items-center justify-center p-6 font-sans">
      <h1 className="text-6xl font-bold text-accent-red mb-4">MovieSpace</h1>
      <p className="text-2xl text-text-secondary mb-8 text-center max-w-xl">
        Filmes e séries no seu estilo dark, com toques de vermelho Netflix.
      </p>
      <button className="bg-accent-red hover:bg-accent-red-hover text-white text-xl font-semibold py-4 px-12 rounded-lg transition duration-300 transform hover:scale-105">
        Começar a Explorar
      </button>
    </div>
  );
}

export default App;