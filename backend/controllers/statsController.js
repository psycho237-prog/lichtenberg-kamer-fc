const { db } = require('../config/firebase');

// @desc    Get public statistics
exports.getPublicStats = async (req, res) => {
    try {
        const currentDate = new Date();

        // 1. Get CMS settings for Trophies, Foundation Year and Base Matches
        let trophies = 0;
        let foundationYear = 2024; // Default
        let baseMatchesPlayed = 0;
        
        const settingsDoc = await db.collection('pages').doc('settings').get();
        if (settingsDoc.exists) {
            const settingsData = settingsDoc.data().content || {};
            trophies = parseInt(settingsData.trophiesCount) || 0;
            foundationYear = parseInt(settingsData.foundationYear) || 2024;
            baseMatchesPlayed = parseInt(settingsData.baseMatchesPlayed) || 0;
        }

        // 2. Count Matches (played)
        const matchesSnapshot = await db.collection('matches').get();
        let matchesCount = 0;
        matchesSnapshot.forEach(doc => {
            const data = doc.data();
            const matchDate = data.date ? new Date(data.date) : null;
            
            if (data.status === 'Terminé' || data.status === 'completed' || (matchDate && matchDate < currentDate)) {
                matchesCount++;
            }
        });

        const totalMatchesPlayed = baseMatchesPlayed + matchesCount;

        // 3. Count Articles
        const newsSnapshot = await db.collection('news').get();
        const articlesCount = newsSnapshot.size;

        // 4. Count Newsletter Subscribers
        const subsSnapshot = await db.collection('subscribers').get();
        const subscribersCount = subsSnapshot.size;

        const currentYear = currentDate.getFullYear();
        let yearsOfExistence = currentYear - foundationYear;
        if (yearsOfExistence < 0) yearsOfExistence = 0;

        res.json({
            matchesPlayed: totalMatchesPlayed,
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
