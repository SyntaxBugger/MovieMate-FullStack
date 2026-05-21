const prisma = require('../prisma/prisma');

const addComment = async (req, res) => {
  try {

    const {
      movieId,
      mediaType,
      movieTitle,
      username,
      content,
      rating
    } = req.body;

    const comment =
      await prisma.comment.create({
        data: {
          movieId,
          mediaType,
          movieTitle,
          username,
          content,
          rating
        }
      });

    res.status(201).json(comment);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Failed to add comment'
    });
  }
};

const getComments = async (req, res) => {
  try {

    const movieId =
      Number(req.params.movieId);

    const comments =
      await prisma.comment.findMany({
        where: {
          movieId
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

    res.json(comments);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Failed to fetch comments'
    });
  }
};

const deleteComment = async (
  req,
  res
) => {

  try {

    const id = req.params.id;

    await prisma.comment.delete({
      where: {
        id
      }
    });

    res.json({
      message:
        'Comment deleted'
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        'Failed to delete comment'
    });
  }
};
const updateComment = async (
  req,
  res
) => {

  try {

    const id = req.params.id;

    const {
      content
    } = req.body;

    const updated =
      await prisma.comment.update({
        where: {
          id
        },

        data: {
          content
        }
      });

    res.json(updated);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        'Failed to update comment'
    });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
  updateComment
};