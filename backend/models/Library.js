const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  title: String,
  poster_path: String,
  media_type: String
}, { timestamps: true });

module.exports = mongoose.model('Library', librarySchema);