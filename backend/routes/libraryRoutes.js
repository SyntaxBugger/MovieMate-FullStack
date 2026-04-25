const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const { getLibrary, addToLibrary, removeFromLibrary } = require('../controllers/libraryController');

router.use(authMiddleware); 

router.get('/', getLibrary);
router.post('/add', addToLibrary);
router.delete('/remove/:id', removeFromLibrary);

module.exports = router;