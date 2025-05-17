import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: String,
  plot: String,
  fullplot: String,
  genres: [String],
  cast: [String],
  directors: [String],
  writers: [String],
  year: Number,
  released: Date,
  rated: String,
  runtime: Number,
  poster: String,
  countries: [String],
  languages: [String],
  imdb: {
    rating: Number,
    votes: Number,
    id: Number,
  },
  tomatoes: {
    viewer: {
      rating: Number,
      numReviews: Number,
    },
    critic: {
      rating: Number,
      numReviews: Number,
    },
    lastUpdated: Date,
  },
  plot_embedding: [Number],
  num_mflix_comments: Number,
});

export default mongoose.model('Movie', movieSchema);