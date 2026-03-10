const Match = require('../models/Match');

exports.getMatches = async (req, res) => {
    try {
        const matches = await Match.find().sort({ date: -1 });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMatch = async (req, res) => {
    try {
        const match = await Match.create(req.body);
        res.status(201).json(match);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(match);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMatch = async (req, res) => {
    try {
        await Match.findByIdAndDelete(req.params.id);
        res.json({ message: 'Match deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
