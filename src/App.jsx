import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';

import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import Search from './pages/Search.jsx';
import Trending from './pages/Trending.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import MyList from './pages/MyList.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  return (
    <Router>
      <div className="bg-dark-bg text-text-primary min-h-screen scrollbar-hide">
        <Header />

        <main className="pt-20 md:pt-24">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/browse" element={<Browse />} />
            <Route path="/search" element={<Search />} />
            <Route path="/trending" element={<Trending />} />

            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<MovieDetails />} />

            <Route path="/minha-lista" element={<MyList />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
