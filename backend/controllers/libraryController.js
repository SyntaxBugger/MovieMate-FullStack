// ================================
// controllers/libraryController.js
// ================================
const Library = require('../models/Library');

// 📚 GET USER LIBRARY
const getLibrary = async (req, res, next) => {
  try {
    const items = await Library.find({ userId: req.user.id });
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

// ➕ ADD TO LIBRARY
const addToLibrary = async (req, res, next) => {
  try {
    const { movieId, title, poster_path, media_type } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const exists = await Library.findOne({
      userId: req.user.id,
      movieId
    });

    if (exists) {
      return res.status(400).json({
        message: "Already in your library"
      });
    }

    const newItem = await Library.create({
      userId: req.user.id,
      movieId,
      title,
      poster_path,
      media_type
    });

    res.status(201).json({
      message: "Added successfully!",
      item: newItem
    });

  } catch (error) {
    next(error);
  }
};

// ✏️ PATCH UPDATE LIBRARY
const updateLibrary = async (req, res, next) => {
  try {
    const updated = await Library.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.status(200).json({
      message: "Updated successfully",
      item: updated
    });

  } catch (error) {
    next(error);
  }
};

// ❌ REMOVE FROM LIBRARY
const removeFromLibrary = async (req, res, next) => {
  try {
    const idToRemove = req.params.id;

    const deleted = await Library.findOneAndDelete({
      _id: idToRemove,
      userId: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.status(200).json({
      message: "Item removed successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLibrary,
  addToLibrary,
  updateLibrary,
  removeFromLibrary
};