import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home'; 
import MovieDetails from './pages/MovieDetails';
import MyList from './pages/MyList';

function App() {
  return (
    <Router>
      <div className="bg-dark-bg text-text-primary min-h-screen">
        <Header />
        <main className="pt-20 md:pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<MovieDetails />} />
            <Route path="/minha-lista" element={<MyList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;