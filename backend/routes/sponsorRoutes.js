const express = require('express');
const router = express.Router();
const { getSponsors, createSponsor, updateSponsor, deleteSponsor } = require('../controllers/sponsorController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
    .get(getSponsors)
    .post(protect, upload.single('logo'), createSponsor);

router.route('/:id')
    .put(protect, upload.single('logo'), updateSponsor)
    .delete(protect, deleteSponsor);

module.exports = router;
