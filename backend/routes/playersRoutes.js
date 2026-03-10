const express = require('express');
const router = express.Router();
const { getPlayers, createPlayer, updatePlayer, deletePlayer } = require('../controllers/playersController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getPlayers);
router.post('/', protect, upload.single('photo'), createPlayer);
router.put('/:id', protect, upload.single('photo'), updatePlayer);
router.delete('/:id', protect, deletePlayer);

module.exports = router;
