const { db } = require('../config/firebase');

// @desc    Get all Ballon d'Or categories & nominees
// @route   GET /api/ballondor/categories
exports.getCategories = async (req, res) => {
    try {
        const snapshot = await db.collection('ballondor_categories').get();
        const categories = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        // Sort by order ascending or createdAt descending
        categories.sort((a, b) => (a.order || 0) - (b.order || 0));

        res.json(categories);
    } catch (error) {
        console.error('Error fetching Ballon d\'Or categories:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single Ballon d'Or category
// @route   GET /api/ballondor/categories/:id
exports.getCategoryById = async (req, res) => {
    try {
        const doc = await db.collection('ballondor_categories').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        res.json({ _id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single candidate by candidateId
// @route   GET /api/ballondor/candidate/:candidateId
exports.getCandidateById = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const snapshot = await db.collection('ballondor_categories').get();

        let foundCandidate = null;
        let foundCategory = null;

        for (const doc of snapshot.docs) {
            const catData = doc.data();
            const candidate = (catData.candidates || []).find(c => c.id === candidateId);
            if (candidate) {
                foundCandidate = candidate;
                foundCategory = { _id: doc.id, title: catData.title, description: catData.description, status: catData.status, candidates: catData.candidates };
                break;
            }
        }

        if (!foundCandidate) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }

        res.json({
            candidate: foundCandidate,
            category: foundCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create category
// @route   POST /api/ballondor/categories
exports.createCategory = async (req, res) => {
    try {
        const { title, description, status, order } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Le titre de la catégorie est obligatoire' });
        }

        const categoryData = {
            title,
            description: description || '',
            status: status || 'active', // 'active' | 'paused' | 'closed'
            order: Number(order) || 0,
            candidates: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await db.collection('ballondor_categories').add(categoryData);
        res.status(201).json({ _id: docRef.id, ...categoryData });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update category info
// @route   PUT /api/ballondor/categories/:id
exports.updateCategory = async (req, res) => {
    try {
        const { title, description, status, order } = req.body;
        const categoryRef = db.collection('ballondor_categories').doc(req.params.id);
        const doc = await categoryRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        const updateData = {
            updatedAt: new Date().toISOString()
        };

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (order !== undefined) updateData.order = Number(order);

        await categoryRef.update(updateData);
        const updatedDoc = await categoryRef.get();
        res.json({ _id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/ballondor/categories/:id
exports.deleteCategory = async (req, res) => {
    try {
        await db.collection('ballondor_categories').doc(req.params.id).delete();
        res.json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add candidate to category
// @route   POST /api/ballondor/categories/:id/candidates
exports.addCandidate = async (req, res) => {
    try {
        const categoryRef = db.collection('ballondor_categories').doc(req.params.id);
        const doc = await categoryRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        const categoryData = doc.data();
        const candidates = categoryData.candidates || [];

        const candidateId = 'cand_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        let photoPath = req.body.photo || '';
        if (req.file) {
            photoPath = req.file.path;
        }

        const newCandidate = {
            id: candidateId,
            name: req.body.name || 'Candidat',
            position: req.body.position || '',
            number: req.body.number || '',
            bio: req.body.bio || '',
            photo: photoPath,
            playerId: req.body.playerId || null,
            votes: 0
        };

        candidates.push(newCandidate);

        await categoryRef.update({
            candidates,
            updatedAt: new Date().toISOString()
        });

        res.status(201).json({ candidate: newCandidate, candidates });
    } catch (error) {
        console.error('Error adding candidate:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update candidate in category
// @route   PUT /api/ballondor/categories/:id/candidates/:candidateId
exports.updateCandidate = async (req, res) => {
    try {
        const { id, candidateId } = req.params;
        const categoryRef = db.collection('ballondor_categories').doc(id);
        const doc = await categoryRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        const categoryData = doc.data();
        const candidates = categoryData.candidates || [];
        const index = candidates.findIndex(c => c.id === candidateId);

        if (index === -1) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }

        let photoPath = candidates[index].photo;
        if (req.file) {
            photoPath = req.file.path;
        } else if (req.body.photo) {
            photoPath = req.body.photo;
        }

        candidates[index] = {
            ...candidates[index],
            name: req.body.name !== undefined ? req.body.name : candidates[index].name,
            position: req.body.position !== undefined ? req.body.position : candidates[index].position,
            number: req.body.number !== undefined ? req.body.number : candidates[index].number,
            bio: req.body.bio !== undefined ? req.body.bio : candidates[index].bio,
            photo: photoPath,
            playerId: req.body.playerId !== undefined ? req.body.playerId : candidates[index].playerId
        };

        await categoryRef.update({
            candidates,
            updatedAt: new Date().toISOString()
        });

        res.json({ candidate: candidates[index], candidates });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remove candidate from category
// @route   DELETE /api/ballondor/categories/:id/candidates/:candidateId
exports.deleteCandidate = async (req, res) => {
    try {
        const { id, candidateId } = req.params;
        const categoryRef = db.collection('ballondor_categories').doc(id);
        const doc = await categoryRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        const categoryData = doc.data();
        const candidates = (categoryData.candidates || []).filter(c => c.id !== candidateId);

        await categoryRef.update({
            candidates,
            updatedAt: new Date().toISOString()
        });

        res.json({ message: 'Candidat retiré', candidates });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Vote for a candidate in a category
// @route   POST /api/ballondor/vote
exports.voteCandidate = async (req, res) => {
    try {
        const { categoryId, candidateId } = req.body;

        if (!categoryId || !candidateId) {
            return res.status(400).json({ message: 'categoryId et candidateId sont requis' });
        }

        // --- IP-based deduplication ---
        // Get the real client IP (handles proxies / Render / Vercel)
        const clientIp =
            req.headers['x-forwarded-for']?.split(',')[0].trim() ||
            req.headers['x-real-ip'] ||
            req.socket?.remoteAddress ||
            'unknown';

        // Create a unique vote fingerprint: IP + category
        const voteKey = `${clientIp}_${categoryId}`;
        const voteRef = db.collection('ballondor_votes').doc(voteKey);
        const existingVote = await voteRef.get();

        if (existingVote.exists) {
            return res.status(409).json({
                message: 'Vous avez déjà voté dans cette catégorie.',
                alreadyVoted: true
            });
        }
        // --- End IP check ---

        const categoryRef = db.collection('ballondor_categories').doc(categoryId);
        const doc = await categoryRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        const categoryData = doc.data();
        if (categoryData.status && categoryData.status !== 'active') {
            return res.status(400).json({ message: 'Les votes pour cette catégorie sont actuellement fermés' });
        }

        const candidates = categoryData.candidates || [];
        const index = candidates.findIndex(c => c.id === candidateId);

        if (index === -1) {
            return res.status(404).json({ message: 'Candidat non trouvé' });
        }

        // Increment vote count
        candidates[index].votes = (candidates[index].votes || 0) + 1;

        // Write vote record + category update in parallel
        await Promise.all([
            categoryRef.update({
                candidates,
                updatedAt: new Date().toISOString()
            }),
            voteRef.set({
                ip: clientIp,
                categoryId,
                candidateId,
                votedAt: new Date().toISOString()
            })
        ]);

        res.json({
            message: 'Vote enregistré avec succès !',
            categoryId,
            candidateId,
            category: { _id: doc.id, ...categoryData, candidates }
        });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset all candidate votes in a category
// @route   POST /api/ballondor/categories/:id/reset-votes
exports.resetVotes = async (req, res) => {
    try {
        const categoryRef = db.collection('ballondor_categories').doc(req.params.id);
        const doc = await categoryRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        const categoryData = doc.data();
        const candidates = (categoryData.candidates || []).map(c => ({
            ...c,
            votes: 0
        }));

        await categoryRef.update({
            candidates,
            updatedAt: new Date().toISOString()
        });

        res.json({ message: 'Votes réinitialisés avec succès', candidates });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
