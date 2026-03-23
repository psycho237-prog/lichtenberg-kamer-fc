const { db } = require('../config/firebase');
const { sendMatchNotification } = require('../services/emailService');

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
        
        // Multer puts files in req.file, but other fields are strings in req.body
        // If FormData sent score[home], we need to reconstruct the score object
        if (!matchData.score && req.body['score[home]'] !== undefined) {
            matchData.score = {
                home: parseInt(req.body['score[home]']) || 0,
                away: parseInt(req.body['score[away]']) || 0
            };
            delete matchData['score[home]'];
            delete matchData['score[away]'];
        }

        // Parse isHome from string to boolean
        if (matchData.isHome === 'true') matchData.isHome = true;
        if (matchData.isHome === 'false') matchData.isHome = false;

        if (req.file) {
            matchData.opponentLogo = req.file.path; // Cloudinary URL
        }
        
        const docRef = await db.collection('matches').add(matchData);
        
        sendMatchNotification({ _id: docRef.id, ...matchData }).catch(e => console.error(e));
        res.status(201).json({ _id: docRef.id, ...matchData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateMatch = async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (!updateData.score && req.body['score[home]'] !== undefined) {
            updateData.score = {
                home: parseInt(req.body['score[home]']) || 0,
                away: parseInt(req.body['score[away]']) || 0
            };
            delete updateData['score[home]'];
            delete updateData['score[away]'];
        }

        // Parse isHome from string to boolean
        if (updateData.isHome === 'true') updateData.isHome = true;
        if (updateData.isHome === 'false') updateData.isHome = false;

        if (req.file) {
            updateData.opponentLogo = req.file.path;
        }
        
        await db.collection('matches').doc(req.params.id).update(updateData);
        res.json({ _id: req.params.id, ...updateData });
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
