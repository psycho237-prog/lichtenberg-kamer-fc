const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// On peut soit charger le fichier JSON directement, 
// soit utiliser des variables d'environnement (mieux pour Render)
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`
    });

    console.log('🔥 Firebase Admin Initialized');
} catch (error) {
    console.error('❌ Firebase Init Error:', error.message);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
