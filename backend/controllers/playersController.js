const Player = require('../models/Player');

// @desc    Get all players
// @route   GET /api/players
exports.getPlayers = async (req, res) => {
    try {
        const players = await Player.find();
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
        if (req.file) {
            playerData.photo = `/uploads/players/${req.file.filename}`;
        }
        const player = await Player.create(playerData);
        res.status(201).json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update player
// @route   PUT /api/players/:id
exports.updatePlayer = async (req, res) => {
    try {
        let player = await Player.findById(req.params.id);
        if (!player) return res.status(404).json({ message: 'Player not found' });

        const updateData = { ...req.body };
        if (req.file) {
            updateData.photo = `/uploads/players/${req.file.filename}`;
        }

        player = await Player.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete player
// @route   DELETE /api/players/:id
exports.deletePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json({ message: 'Player removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
