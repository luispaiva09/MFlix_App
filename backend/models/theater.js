import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema({
  name: String,
  location: {
    address: {
      street1: String,
      city: String,
      state: String,
      zipcode: String,
    },
    geo: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number],
    },
  },
});

export default mongoose.model('Theater', theaterSchema);