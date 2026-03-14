const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/newsletterController');
const { protect } = require('../middleware/auth');

router.post('/subscribe', subscribe);
router.get('/subscribers', protect, getSubscribers);

module.exports = router;
