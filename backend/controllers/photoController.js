const Photo = require('../models/Photo');

// @desc    Get all photos
exports.getPhotos = async (req, res) => {
    try {
        const photos = await Photo.find().sort({ createdAt: -1 });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new photo/video
exports.addPhoto = async (req, res) => {
    try {
        const photoData = { ...req.body };
        if (req.file) {
            photoData.url = `/uploads/gallery/${req.file.filename}`;
        }
        const photo = await Photo.create(photoData);
        res.status(201).json(photo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete photo
exports.deletePhoto = async (req, res) => {
    try {
        await Photo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item removed from gallery' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
