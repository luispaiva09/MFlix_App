import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { addComment, getCommentsByMovieId, deleteComment } from '../controllers/commentController.js';
import {
  searchMovies,
  getYears,
  getGenres,
  getCountries,
  getLanguages,
  getMovieById,
} from '../controllers/movieController.js';
import { authenticate } from '../middleware/authenticate.js';
import Movie from '../models/movie.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email já está a ser utilizado' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = user.generateAuthToken();
    res.status(201).json({ token });
  } catch (error) {
    console.error('Erro no registo:', error);
    res.status(500).json({ message: 'Erro ao registar utilizador', error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    const token = user.generateAuthToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
});

router.get('/movies/all', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter todos os filmes', error: err.message });
  }
});


router.post('/comments', authenticate, addComment);
router.get('/comments/:id', getCommentsByMovieId);
router.delete('/comments/:id', authenticate, deleteComment);
router.get('/movies', searchMovies);
router.get('/movies/years', getYears);
router.get('/movies/genres', getGenres);
router.get('/movies/countries', getCountries);
router.get('/movies/languages', getLanguages);
router.get('/movies/:id', getMovieById);

export default router;
