const Page = require('../models/Page');

// @desc    Get page content by slug
exports.getPageBySlug = async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug });
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }
        res.json(page);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update or create page content
exports.updatePageContent = async (req, res) => {
    try {
        const { slug } = req.params;
        const { title, content } = req.body;

        let page = await Page.findOne({ slug });

        if (page) {
            page.title = title || page.title;
            page.content = content || page.content;
            page.lastUpdatedBy = req.user._id;
            await page.save();
        } else {
            page = await Page.create({
                slug,
                title,
                content,
                lastUpdatedBy: req.user._id
            });
        }

        res.json(page);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
