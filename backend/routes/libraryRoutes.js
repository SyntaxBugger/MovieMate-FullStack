const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

const {
    getLibrary,
    addToLibrary,
    updateLibrary,
    removeFromLibrary
} = require('../controllers/libraryController');

// Apply Authentication Middleware
router.use(authMiddleware);

// Library Routes
router.get('/', getLibrary);
router.post('/add', addToLibrary);
router.patch('/update/:id', updateLibrary);
router.delete('/remove/:id', removeFromLibrary);

module.exports = router;