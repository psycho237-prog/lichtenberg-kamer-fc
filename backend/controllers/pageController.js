const { db } = require('../config/firebase');

// @desc    Get page content by slug
exports.getPageBySlug = async (req, res) => {
    try {
        const doc = await db.collection('pages').doc(req.params.slug).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Page not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update or create page content
exports.updatePageContent = async (req, res) => {
    try {
        const { slug } = req.params;
        let { title, content } = req.body;

        if (typeof content === 'string') {
            content = JSON.parse(content);
        }

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (file.fieldname === 'image' || file.fieldname === 'aboutImage') {
                    content.aboutImage = file.path;
                } else if (file.fieldname === 'heroImage') {
                    content.heroImage = file.path;
                }
            });
        }

        const updateData = {
            title,
            content,
            lastUpdatedBy: req.user._id,
            updatedAt: new Date()
        };

        await db.collection('pages').doc(slug).set(updateData, { merge: true });
        res.json({ slug, ...updateData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
