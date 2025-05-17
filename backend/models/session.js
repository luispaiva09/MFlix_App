import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user_id: String,
  jwt: String,
});

export default mongoose.model('Session', sessionSchema);
