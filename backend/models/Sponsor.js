const mongoose = require('mongoose');

const sponsorSchema = mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true },
    website: { type: String },
    tier: {
        type: String,
        enum: ['main', 'premium', 'partner'],
        default: 'partner'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sponsor', sponsorSchema);
