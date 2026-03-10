const News = require('../models/News');

exports.getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort({ publishDate: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

exports.deleteNews = async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        res.json({ message: 'News deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
