const { db } = require('../config/firebase');
const { sendNewsNotification } = require('../services/emailService');

// @desc    Get all news
exports.getAllNews = async (req, res) => {
    try {
        const snapshot = await db.collection('news').orderBy('publishDate', 'desc').get();
        const news = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single news by ID
exports.getNewsById = async (req, res) => {
    try {
        const doc = await db.collection('news').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: 'Article not found' });
        res.json({ _id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create news article
exports.createNews = async (req, res) => {
    try {
        const newsData = {
            ...req.body,
            publishDate: req.body.publishDate || new Date().toISOString()
        };
        if (req.file) newsData.image = req.file.path;

        const docRef = await db.collection('news').add(newsData);

        // Trigger Email Notification (Non-blocking)
        sendNewsNotification({ _id: docRef.id, ...newsData }).catch(e => console.error(e));

        res.status(201).json({ _id: docRef.id, ...newsData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update news article
exports.updateNews = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.image = req.file.path;

        await db.collection('news').doc(req.params.id).update(updateData);
        res.json({ _id: req.params.id, ...updateData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete news article
exports.deleteNews = async (req, res) => {
    try {
        await db.collection('news').doc(req.params.id).delete();
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
