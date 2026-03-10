const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
    slug: { type: String, required: true, unique: true }, // 'home', 'contact', 'tickets'
    title: { type: String, required: true },
    content: { type: Object, required: true }, // Flexible object to store various sections
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Page', pageSchema);
