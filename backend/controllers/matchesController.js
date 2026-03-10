const { db } = require('../config/firebase');

exports.getMatches = async (req, res) => {
    try {
        const snapshot = await db.collection('matches').orderBy('date', 'desc').get();
        const matches = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMatch = async (req, res) => {
    try {
        const matchData = { ...req.body };
        const docRef = await db.collection('matches').add(matchData);
        res.status(201).json({ _id: docRef.id, ...matchData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateMatch = async (req, res) => {
    try {
        await db.collection('matches').doc(req.params.id).update(req.body);
        res.json({ _id: req.params.id, ...req.body });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMatch = async (req, res) => {
    try {
        await db.collection('matches').doc(req.params.id).delete();
        res.json({ message: 'Match deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
