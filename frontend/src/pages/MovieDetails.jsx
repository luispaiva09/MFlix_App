import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css'; // Import do CSS

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const token = localStorage.getItem('token');

  let userEmail = null;
  if (token) {
    try {
      userEmail = JSON.parse(atob(token.split('.')[1])).email;
    } catch {
      userEmail = null;
    }
  }

  useEffect(() => {
    axios.get(`${API_URL}/api/auth/movies/${id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));

    axios.get(`${API_URL}/api/auth/comments/${id}`)
      .then(res => setComments(res.data))
      .catch(err => console.warn('Sem comentários:', err));
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/api/auth/comments`, {
        movieId: id,
        content: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setComments(prev => [res.data.comment, ...prev]);
      setNewComment('');
      setErrorMsg('');
      setSuccessMsg('Comentário adicionado com sucesso!');
    } catch (err) {
      setErrorMsg('Erro ao adicionar comentário.');
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Tem certeza que deseja apagar este comentário?')) return;

    try {
      await axios.delete(`${API_URL}/api/auth/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Erro ao apagar comentário:', err);
      alert('Não foi possível apagar o comentário.');
    }
  };

  if (!movie) return <p>Carregando...</p>;

  return (
    <div className="movie-details-wrapper">
      <div className="movie-details-container">
        <Link to="/home" className="back-button">← Voltar</Link>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
          {/* Poster */}
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={`${movie.title} Poster`}
              className="movie-poster"
            />
          ) : (
            <div className="movie-poster" style={{ backgroundColor: '#444', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#aaa' }}>
              Sem poster
            </div>
          )}

          {/* Info */}
          <div>
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-info"><strong>Ano:</strong> {movie.year}</p>
            <p className="movie-info"><strong>Géneros:</strong> {movie.genres.join(', ')}</p>
            <p className="movie-info"><strong>Países:</strong> {movie.countries.join(', ')}</p>
            <p className="movie-info"><strong>Idiomas:</strong> {movie.languages.join(', ')}</p>
            {movie.cast?.length > 0 && <p className="movie-info"><strong>Elenco:</strong> {movie.cast.join(', ')}</p>}
            {movie.directors?.length > 0 && <p className="movie-info"><strong>Realizadores:</strong> {movie.directors.join(', ')}</p>}
            {movie.writers?.length > 0 && <p className="movie-info"><strong>Escritores:</strong> {movie.writers.join(', ')}</p>}
            {movie.imdb?.rating && <p className="movie-info"><strong>IMDb:</strong> {movie.imdb.rating} ⭐ ({movie.imdb.votes} votos)</p>}
            {movie.tomatoes?.viewer?.rating && <p className="movie-info"><strong>Tomatoes (Viewer):</strong> {movie.tomatoes.viewer.rating} 🍅</p>}
            {movie.rated && <p className="movie-info"><strong>Classificação:</strong> {movie.rated}</p>}
            {movie.runtime && <p className="movie-info"><strong>Duração:</strong> {movie.runtime} min</p>}

            <hr />
            <p className="movie-description"><strong>Sinopse:</strong> {movie.plot}</p>
            {movie.fullplot && <p className="movie-description"><strong>Resumo completo:</strong> {movie.fullplot}</p>}
          </div>
        </div>

        {/* Comentários */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ color: '#00aaff' }}>Comentários</h2>

          {/* Novo comentário */}
          {token ? (
            <div style={{ marginBottom: '20px' }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escreva um comentário..."
                rows={3}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#222', color: '#fff', border: '1px solid #00aaff' }}
              />
              <button
                onClick={handleAddComment}
                className="back-button"
                style={{ marginTop: '10px' }}
              >
                + Adicionar Comentário
              </button>
              {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
              {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
            </div>
          ) : (
            <p><em>Autentique-se para comentar.</em></p>
          )}

          {/* Lista de comentários */}
          {comments.length === 0 ? (
            <p>Nenhum comentário ainda.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {comments.map(comment => (
                <li key={comment._id} style={{ marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p><strong>{comment.name}</strong> — <small>{new Date(comment.date).toLocaleDateString()}</small></p>
                    {userEmail === comment.email && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                        title="Apagar comentário"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <p>{comment.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
