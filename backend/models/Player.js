const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true },
    position: {
        type: String,
        required: true,
        enum: ['Gardiens', 'Défenseurs', 'Milieux', 'Attaquants'] // Matches French Figma terms
    },
    photo: { type: String, default: '/uploads/players/default.png' },
    age: { type: Number },
    nationality: { type: String },
    matchesPlayed: { type: Number, default: 0 },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
