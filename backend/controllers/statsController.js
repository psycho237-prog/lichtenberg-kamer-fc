const { db } = require('../config/firebase');

// @desc    Get public statistics
exports.getPublicStats = async (req, res) => {
    try {
        // 1. Count Matches (played)
        const matchesSnapshot = await db.collection('matches').get();
        // optionally filter by status if we only want played ones, or just all. Let's filter by completed.
        let matchesCount = 0;
        matchesSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === 'Terminé' || data.status === 'completed') {
                matchesCount++;
            }
        });

        // 2. Count Articles
        const newsSnapshot = await db.collection('news').get();
        const articlesCount = newsSnapshot.size;

        // 3. Count Newsletter Subscribers
        const subsSnapshot = await db.collection('subscribers').get();
        const subscribersCount = subsSnapshot.size;

        // 4. Get CMS settings for Trophies and Foundation Year
        let trophies = 0;
        let foundationYear = 2024; // Default
        
        const settingsDoc = await db.collection('pages').doc('settings').get();
        if (settingsDoc.exists) {
            const settingsData = settingsDoc.data().content || {};
            trophies = parseInt(settingsData.trophiesCount) || 0;
            foundationYear = parseInt(settingsData.foundationYear) || 2024;
        }

        const currentYear = new Date().getFullYear();
        let yearsOfExistence = currentYear - foundationYear;
        if (yearsOfExistence < 0) yearsOfExistence = 0;

        res.json({
            matchesPlayed: matchesCount,
            articlesPublished: articlesCount,
            subscribers: subscribersCount,
            trophies: trophies,
            yearsOfExistence: yearsOfExistence
        });
    } catch (error) {
        console.error('Erreur stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques.' });
    }
};
