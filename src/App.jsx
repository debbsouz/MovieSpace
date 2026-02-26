import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import MyList from './pages/MyList';
import Search from './pages/Search';
import Browse from './pages/Browse';
import TopRated from './pages/TopRated';
import Trending from './pages/Trending';
import Login from './pages/Login';


function App() {
  return (
    <Router>
      <div className="bg-dark-bg text-text-primary min-h-screen">
        <Header />
        <main className="pt-20 md:pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<MovieDetails />} />
            <Route path="/minha-lista" element={<MyList />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;