const express = require('express');
const router = express.Router();
const {
    getPlayerStats,
    createPlayerStats,
    updatePlayerStats,
    deletePlayerStats
} = require('../controllers/playerStatsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getPlayerStats);
router.post('/', protect, upload.single('photo'), createPlayerStats);
router.put('/:id', protect, upload.single('photo'), updatePlayerStats);
router.delete('/:id', protect, deletePlayerStats);

module.exports = router;
