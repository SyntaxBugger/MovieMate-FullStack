const express = require('express');
const router = express.Router();

const { fetchFromTMDB } = require('../controllers/tmdbController');

// TMDB Route
router.use(fetchFromTMDB);

module.exports = router;