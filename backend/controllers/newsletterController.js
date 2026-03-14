const { db } = require('../config/firebase');

// @desc    Subscribe to newsletter
exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email requis' });

        // Check if already exists
        const snapshot = await db.collection('subscribers').where('email', '==', email.toLowerCase()).get();
        if (!snapshot.empty) {
            return res.status(200).json({ message: 'Vous êtes déjà inscrit !' });
        }

        await db.collection('subscribers').add({
            email: email.toLowerCase(),
            subscribedAt: new Date().toISOString()
        });

        res.status(201).json({ message: 'Bienvenue dans la newsletter !' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all subscribers (Admin)
exports.getSubscribers = async (req, res) => {
    try {
        const snapshot = await db.collection('subscribers').orderBy('subscribedAt', 'desc').get();
        const subscribers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
