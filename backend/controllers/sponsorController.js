const { db } = require('../config/firebase');

// @desc    Get all sponsors
exports.getSponsors = async (req, res) => {
    try {
        const snapshot = await db.collection('sponsors').orderBy('name', 'asc').get();
        const sponsors = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
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

        const sponsorData = {
            name,
            website,
            tier,
            logo,
            createdAt: new Date()
        };

        const docRef = await db.collection('sponsors').add(sponsorData);
        res.status(201).json({ _id: docRef.id, ...sponsorData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update sponsor
exports.updateSponsor = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.logo = `/uploads/sponsors/${req.file.filename}`;
        }

        await db.collection('sponsors').doc(req.params.id).update(updateData);
        res.json({ _id: req.params.id, ...updateData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete sponsor
exports.deleteSponsor = async (req, res) => {
    try {
        await db.collection('sponsors').doc(req.params.id).delete();
        res.json({ message: 'Sponsor removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
