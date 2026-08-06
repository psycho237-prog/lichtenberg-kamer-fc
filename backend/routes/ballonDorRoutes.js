const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategoryById,
    getCandidateById,
    createCategory,
    updateCategory,
    deleteCategory,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    voteCandidate,
    resetVotes
} = require('../controllers/ballonDorController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.get('/candidate/:candidateId', getCandidateById);
router.post('/vote', voteCandidate);

// Admin protected routes
router.post('/categories', protect, createCategory);
router.put('/categories/:id', protect, updateCategory);
router.delete('/categories/:id', protect, deleteCategory);

router.post('/categories/:id/candidates', protect, upload.single('photo'), addCandidate);
router.put('/categories/:id/candidates/:candidateId', protect, upload.single('photo'), updateCandidate);
router.delete('/categories/:id/candidates/:candidateId', protect, deleteCandidate);

router.post('/categories/:id/reset-votes', protect, resetVotes);

module.exports = router;
