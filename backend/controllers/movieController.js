import Movie from '../models/movie.js';
import Theater from '../models/theater.js';
import Session from '../models/session.js';

// Procurar Filmes
export async function searchMovies(req, res) {
  const { title, genres, year, countries, language } = req.query;
  const query = {};

  // Filtro de título (regex para busca parcial)
  if (title && title.trim() !== '') {
    query.title = { $regex: title, $options: 'i' };
  }

  // Filtro de géneros (pode vir como string separada por vírgulas)
  if (genres && genres.trim() !== '') {
    query.genres = { $in: genres.split(',').map(g => g.trim()) };
  }

  // Filtro de ano (precisa de parseInt)
  if (year && !isNaN(parseInt(year))) {
    query.year = parseInt(year);
  }

  // Filtro de países
  if (countries && countries.trim() !== '') {
    query.countries = { $in: countries.split(',').map(c => c.trim()) };
  }

  // Filtro de idiomas
  if (language && language.trim() !== '') {
    query.languages = { $in: language.split(',') }
  }

  try {
    const movies = await Movie.find(query).limit(100);
    res.json(movies);
  } catch (err) {
    console.error('Erro na pesquisa:', err);
    res.status(500).json({ message: 'Erro a encontrar filmes', error: err.message });
  }
}


// Listar todos os anos disponiveis
export async function getYears(req, res) {
  try {
    const years = await Movie.distinct('year');
    res.json(years);
  } catch (err) {
    res.status(500).json({ message: 'Erro a encontrar anos', error: err.message });
  }
}

// Listar todos os generos disponiveis
export async function getGenres(req, res) {
  try {
    const genres = await Movie.distinct('genres');
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: 'Erro a encontrar gêneros', error: err.message });
  }
}

// Listar todos os países disponiveis
export async function getCountries(req, res) {
  try {
    const countries = await Movie.distinct('countries');
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Erro a encontrar países', error: err.message });
  }
}

// Listar todos os idiomas
export async function getLanguages(req, res) {
  try {
    const result = await Movie.aggregate([
      { $unwind: "$languages" },
      { $group: { _id: "$languages" } },
      { $sort: { _id: 1 } }
    ]);
    const languages = result.map((item) => item._id);
    res.json(languages);
  } catch (err) {
    res.status(500).json({ message: 'Erro a encontrar idiomas', error: err.message });
  }
}

// Filme por ID
export async function getMovieById(req, res) {
  const movieId = req.params.id;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao encontrar filme', error: err.message });
  }
}

