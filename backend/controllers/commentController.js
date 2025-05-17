import Comment from '../models/comment.js';
import User from '../models/user.js';

export async function addComment(req, res) {
  const { movieId, content } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado' });

    const comment = new Comment({
      name: user.name,
      email: user.email,
      movie_id: movieId,
      text: content,
      date: new Date()
    });

    await comment.save();
    res.status(201).json({ message: 'Comentário criado com sucesso', comment });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar comentário', error: err.message });
  }
}

export async function getCommentsByMovieId(req, res) {
  const movieId = req.params.id;
  console.log('Movie ID:', movieId);

  try {
    const comments = await Comment.find({ movie_id: movieId });
    console.log('Comments found:', comments);

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this movie' });
    }

    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
}

export async function deleteComment(req, res) {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const comment = await Comment.findById(id);

    if (!comment) return res.status(404).json({ message: 'Comentário não encontrado' });

    if (comment.email !== req.user.email) {
      return res.status(403).json({ message: 'Sem permissão para apagar este comentário' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comentário apagado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao apagar comentário', error: err.message });
  }
}

