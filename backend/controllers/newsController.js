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

// @desc    Like a news article
exports.likeNews = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email requis' });
        }

        // Verify newsletter subscription
        const subscriberQuery = await db.collection('subscribers').where('email', '==', email.toLowerCase()).get();
        if (subscriberQuery.empty) {
            return res.status(403).json({ message: 'Vous devez être abonné à la newsletter pour liker un article.' });
        }

        const newsRef = db.collection('news').doc(req.params.id);
        const doc = await newsRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const newsData = doc.data();
        const likes = newsData.likes || [];

        if (likes.includes(email)) {
             return res.status(400).json({ message: 'Vous avez déjà liké cet article.' });
        }

        likes.push(email);
        await newsRef.update({ likes });

        res.json({ message: 'Article liké avec succès!', likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
