const { db } = require('../config/firebase');

// @desc    Get all photos
exports.getPhotos = async (req, res) => {
    try {
        const snapshot = await db.collection('gallery').orderBy('createdAt', 'desc').get();
        const photos = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new photo/video
exports.addPhoto = async (req, res) => {
    try {
        const photoData = { ...req.body, createdAt: new Date() };
        if (req.file) {
            photoData.url = req.file.path;
        }
        const docRef = await db.collection('gallery').add(photoData);
        res.status(201).json({ _id: docRef.id, ...photoData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete photo
exports.deletePhoto = async (req, res) => {
    try {
        await db.collection('gallery').doc(req.params.id).delete();
        res.json({ message: 'Item removed from gallery' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
