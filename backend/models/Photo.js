const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    title: { type: String },
    url: { type: String, required: true },
    category: {
        type: String,
        enum: ['match', 'training', 'event', 'highlight'],
        default: 'match'
    },
    isVideo: { type: Boolean, default: false },
    videoUrl: { type: String } // for YouTube/Vimeo links
}, {
    timestamps: true
});

module.exports = mongoose.model('Photo', photoSchema);
