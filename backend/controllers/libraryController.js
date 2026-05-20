const Library = require('../models/Library');

// Get User Library
const getLibrary = async (req, res, next) => {
    try {
        const query = { userId: req.user.id };

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.movieId) {
            query.movieId = Number(req.query.movieId);
        }

        const items = await Library.find(query);
        

        res.status(200).json(items);

    } catch (error) {
        next(error);
    }
};

// Add To Library
const addToLibrary = async (req, res, next) => {
    try {
        const {
            movieId,
            title,
            poster_path,
            media_type,
            category,
            watchStatus,
        } = req.body;

        if (!movieId || !title || !category) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const exists = await Library.findOne({
            userId: req.user.id,
            movieId,
            category
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
            media_type,
            category,
            watchStatus: watchStatus || 'planning'
        });
        console.log("Saved item:", newItem);

        res.status(201).json({
            message: "Added successfully!",
            item: newItem
        });

    } catch (error) {
        next(error);
    }
};

// Update Library
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

// Remove From Library
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