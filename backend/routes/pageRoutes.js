const express = require('express');
const router = express.Router();
const { getPageBySlug, updatePageContent } = require('../controllers/pageController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/:slug', getPageBySlug);
router.put('/:slug', protect, upload.single('image'), updatePageContent);

module.exports = router;
