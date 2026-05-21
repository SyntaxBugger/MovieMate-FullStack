const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema(
{
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
    media_type: String,

    category: {
        type: String,
        enum: ['favorites', 'watchlist', 'history'],
        default: 'favorites'
    },

    watchStatus: {
        type: String,
        enum: ['planning', 'watching', 'completed', 'dropped'],
        default: 'planning'
    },

    watched: {
        type: Boolean,
        default: false
    },

    rating: {
        type: Number,
        default: 0
    },

    notes: {
        type: String,
        default: ""
    }

},
{
    timestamps: true
}
);

module.exports = mongoose.model('Library', librarySchema);