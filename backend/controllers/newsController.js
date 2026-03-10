const News = require('../models/News');

// @desc    Get all news
exports.getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort({ publishDate: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single news by ID
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'Article not found' });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create news article
exports.createNews = async (req, res) => {
    try {
        const newsData = { ...req.body };
        if (req.file) newsData.image = `/uploads/gallery/${req.file.filename}`;
        const news = await News.create(newsData);
        res.status(201).json(news);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update news article
exports.updateNews = async (req, res) => {
    try {
        let news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'Article not found' });

        const updateData = { ...req.body };
        if (req.file) updateData.image = `/uploads/gallery/${req.file.filename}`;

        news = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(news);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete news article
exports.deleteNews = async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
