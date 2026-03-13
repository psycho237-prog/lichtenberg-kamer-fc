const { db } = require('../config/firebase');

// @desc    Get all players sorted by goals for leaderboard
// @route   GET /api/player-stats
exports.getPlayerStats = async (req, res) => {
    try {
        const snapshot = await db.collection('players').orderBy('goals', 'desc').get();
        const players = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create player stats (essentially a new player with stats)
// @route   POST /api/player-stats
exports.createPlayerStats = async (req, res) => {
    try {
        const statsData = {
            ...req.body,
            matchesPlayed: parseInt(req.body.matchesPlayed) || 0,
            goals: parseInt(req.body.goals) || 0,
            assists: parseInt(req.body.assists) || 0,
            number: parseInt(req.body.number) || 0
        };

        if (req.file) {
            statsData.photo = req.file.path;
        }

        const docRef = await db.collection('players').add(statsData);
        res.status(201).json({ _id: docRef.id, ...statsData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update player stats
// @route   PUT /api/player-stat/:id
exports.updatePlayerStats = async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            matchesPlayed: parseInt(req.body.matchesPlayed) || 0,
            goals: parseInt(req.body.goals) || 0,
            assists: parseInt(req.body.assists) || 0,
            number: parseInt(req.body.number) || 0
        };

        if (req.file) {
            updateData.photo = req.file.path;
        }

        await db.collection('players').doc(req.params.id).update(updateData);
        res.json({ _id: req.params.id, ...updateData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete player stats
// @route   DELETE /api/player-stats/:id
exports.deletePlayerStats = async (req, res) => {
    try {
        await db.collection('players').doc(req.params.id).delete();
        res.json({ message: 'Player statistics removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
