const express = require('express');
const router = express.Router();
const { getPhotos, addPhoto, deletePhoto } = require('../controllers/photoController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
    .get(getPhotos)
    .post(protect, upload.single('photo'), addPhoto);

router.route('/:id')
    .delete(protect, deletePhoto);

module.exports = router;
