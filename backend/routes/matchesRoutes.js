const express = require('express');
const router = express.Router();
const { getMatches, createMatch, updateMatch, deleteMatch } = require('../controllers/matchesController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getMatches);
router.post('/', protect, upload.single('opponentLogo'), createMatch);
router.put('/:id', protect, upload.single('opponentLogo'), updateMatch);
router.delete('/:id', protect, deleteMatch);

module.exports = router;
