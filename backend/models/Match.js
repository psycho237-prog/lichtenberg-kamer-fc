const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    opponent: { type: String, required: true },
    opponentLogo: { type: String },
    date: { type: Date, required: true },
    stadium: { type: String, default: 'Stadium Ahidjo' },
    isHome: { type: Boolean, default: true },
    competition: { type: String, default: 'Elite One' },
    status: {
        type: String,
        enum: ['upcoming', 'finished'],
        default: 'upcoming'
    },
    score: {
        home: { type: Number, default: 0 },
        away: { type: Number, default: 0 }
    },
    scorers: [{
        player: { type: String },
        minute: { type: Number }
    }],
    possession: { type: Number }, // stats from Figma
    shotsOnTarget: { type: Number },
    corners: { type: Number },
    fouls: { type: Number }
}, {
    timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);
