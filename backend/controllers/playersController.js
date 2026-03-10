const { db } = require('../config/firebase');

// @desc    Get all players
// @route   GET /api/players
exports.getPlayers = async (req, res) => {
    try {
        const snapshot = await db.collection('players').get();
        const players = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create player
// @route   POST /api/players
exports.createPlayer = async (req, res) => {
    try {
        const playerData = { ...req.body };
        // Photo logic remains local for now, but points to firestore entry
        if (req.file) {
            playerData.photo = `/uploads/players/${req.file.filename}`;
        }

        const docRef = await db.collection('players').add(playerData);
        const newPlayer = { _id: docRef.id, ...playerData };
        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update player
// @route   PUT /api/players/:id
exports.updatePlayer = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.photo = `/uploads/players/${req.file.filename}`;
        }

        await db.collection('players').doc(req.params.id).update(updateData);
        res.json({ _id: req.params.id, ...updateData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete player
// @route   DELETE /api/players/:id
exports.deletePlayer = async (req, res) => {
    try {
        await db.collection('players').doc(req.params.id).delete();
        res.json({ message: 'Player removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
