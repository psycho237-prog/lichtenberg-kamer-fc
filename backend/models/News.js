const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, default: 'General' },
    author: { type: String, default: 'Admin' },
    publishDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('News', newsSchema);
