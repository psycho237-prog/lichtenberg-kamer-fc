const express = require('express');
const router = express.Router();
const { getMatches, createMatch, updateMatch, deleteMatch } = require('../controllers/matchesController');
const { protect } = require('../middleware/auth');

router.get('/', getMatches);
router.post('/', protect, createMatch);
router.put('/:id', protect, updateMatch);
router.delete('/:id', protect, deleteMatch);

module.exports = router;
