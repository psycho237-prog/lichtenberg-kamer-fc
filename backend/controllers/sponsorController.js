const Sponsor = require('../models/Sponsor');

// @desc    Get all sponsors
exports.getSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor.find().sort({ createdAt: -1 });
        res.json(sponsors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create sponsor
exports.createSponsor = async (req, res) => {
    try {
        const { name, website, tier } = req.body;
        let logo = '';
        if (req.file) {
            logo = `/uploads/sponsors/${req.file.filename}`;
        }

        const sponsor = await Sponsor.create({
            name,
            website,
            tier,
            logo
        });
        res.status(201).json(sponsor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update sponsor
exports.updateSponsor = async (req, res) => {
    try {
        let sponsor = await Sponsor.findById(req.params.id);
        if (!sponsor) return res.status(404).json({ message: 'Sponsor not found' });

        const updateData = { ...req.body };
        if (req.file) {
            updateData.logo = `/uploads/sponsors/${req.file.filename}`;
        }

        sponsor = await Sponsor.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(sponsor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete sponsor
exports.deleteSponsor = async (req, res) => {
    try {
        await Sponsor.findByIdAndDelete(req.params.id);
        res.json({ message: 'Sponsor removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
