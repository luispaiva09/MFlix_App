import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const API_URL = 'http://localhost:8000';

function Home() {
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    genres: '',
    year: '',
    countries: '',
    languages: ''
  });

  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadFilters() {
      try {
        const [genresRes, yearsRes, countriesRes, languagesRes] = await Promise.all([
          axios.get(`${API_URL}/api/auth/movies/genres`),
          axios.get(`${API_URL}/api/auth/movies/years`),
          axios.get(`${API_URL}/api/auth/movies/countries`),
          axios.get(`${API_URL}/api/auth/movies/languages`)
        ]);
        setAvailableGenres(genresRes.data);
        setAvailableYears(yearsRes.data);
        setAvailableCountries(countriesRes.data);
        setAvailableLanguages(languagesRes.data);
      } catch (error) {
        console.error('Erro ao carregar os filtros:', error);
      }
    }

    loadFilters();
  }, []);

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.title.trim()) params.append('title', filters.title.trim());
      if (filters.genres) params.append('genres', filters.genres);
      if (filters.year) params.append('year', filters.year);
      if (filters.countries) params.append('countries', filters.countries);
      if (filters.languages) params.append('languages', filters.languages);

      const res = await axios.get(`${API_URL}/api/auth/movies?${params.toString()}`);
      setMovies(res.data);
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
      setMovies([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardClick = (id) => {
    navigate(`/movies/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">MFlix</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <input
        type="text"
        name="title"
        value={filters.title}
        onChange={handleChange}
        placeholder="Pesquisar por título..."
        className="search-input"
      />

      <div className="filters-container">
        <select name="genres" value={filters.genres} onChange={handleChange}>
          <option value="">Todos os Géneros</option>
          {availableGenres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>

        <select name="year" value={filters.year} onChange={handleChange}>
          <option value="">Todos os Anos</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select name="countries" value={filters.countries} onChange={handleChange}>
          <option value="">Todos os Países</option>
          {availableCountries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <select name="languages" value={filters.languages} onChange={handleChange}>
          <option value="">Todos os Idiomas</option>
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <button className="search-button" onClick={handleSearch}>
        Procurar
      </button>

      <div className="movies-container">
        {movies.length === 0 ? (
          <p className="no-movies">Nenhum filme encontrado.</p>
        ) : (
          movies.map((movie) => (
            <div
              key={movie._id}
              className="movie-card"
              onClick={() => handleCardClick(movie._id)}
            >
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  className="movie-poster"
                />
              ) : (
                <div className="no-poster">Sem poster</div>
              )}
              <h3>{movie.title}</h3>
              <p><strong>Ano:</strong> {movie.year}</p>
              <p><strong>Géneros:</strong> {movie.genres.join(', ')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
