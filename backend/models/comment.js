import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  name: String,
  email: String,
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  text: { type: String },
  date: { type: Date },
});

export default mongoose.model('Comment', commentSchema);