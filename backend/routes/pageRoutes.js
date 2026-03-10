const express = require('express');
const router = express.Router();
const { getPageBySlug, updatePageContent } = require('../controllers/pageController');
const { protect } = require('../middleware/auth');

router.get('/:slug', getPageBySlug);
router.put('/:slug', protect, updatePageContent);

module.exports = router;
