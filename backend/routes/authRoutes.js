const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const User = require('../models/User');

const {
    register,
    login,
    refresh,
    logout
} = require('../controllers/authController');

// Auth Routes
router.post(
  '/upload-profile',
  upload.single('image'),
  async (req, res) => {

    try {

      const { userId } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image uploaded'
        });
      }

      const user =
        await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      user.profileImage =
        req.file.path;

      await user.save();

      res.json({
        success: true,
        imageUrl:
          req.file.path
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }

  }
);
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;