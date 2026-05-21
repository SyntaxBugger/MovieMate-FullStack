const express = require('express');

const router = express.Router();

const {
  addComment,
  getComments,
  updateComment,
    deleteComment
} = require('../controllers/commentController');

router.post('/', addComment);

router.get('/:movieId', getComments);

router.delete('/:id', deleteComment);

router.patch('/:id', updateComment);

module.exports = router;