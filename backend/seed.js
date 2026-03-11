const { db } = require('./config/firebase');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
    try {
        console.log('--- Starting Firebase Seeding ---');

        // 0. Admin User
        const adminSnapshot = await db.collection('users').where('email', '==', process.env.ADMIN_EMAIL).get();
        if (adminSnapshot.empty) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
            await db.collection('users').add({
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword
            });
            console.log('✅ Admin user created');
        }

        // 1. Home Page Content
        const homeRef = db.collection('pages').doc('home');
        const homeDoc = await homeRef.get();
        if (!homeDoc.exists) {
            await homeRef.set({
                slug: 'home',
                title: 'Home Page',
                content: {
                    heroTitle: 'LICHTENBERG KAMER e.V',
                    heroSubtitle: "L'ascension d'un club, la passion d'un peuple. Ensemble, vers les sommets du football camerounais.",
                    seasonPeriod: '2024/2025',
                    aboutContent: '<h2>NOTRE HISTOIRE</h2><p>Lichtenberg-Kamer e.V est bien plus qu\'un club de football. Fondé par la communauté camerounaise de Berlin (Lichtenberg), nous représentons les valeurs d\'excellence, d\'intégration et de solidarité.</p>',
                    visionContent: '<p>Devenir une référence du football communautaire en Allemagne et servir de pont entre les cultures à travers le sport.</p>',
                    philosophyContent: '<p>Discipline, Travail, et Fair-play sont les piliers qui guident chacun de nos joueurs, du centre de formation à l\'équipe première.</p>'
                }
            });
            console.log('✅ Home page seeded');
        }

        // 2. Settings
        const settingsRef = db.collection('pages').doc('settings');
        const settingsDoc = await settingsRef.get();
        if (!settingsDoc.exists) {
            await settingsRef.set({
                slug: 'settings',
                title: 'Global Settings',
                content: {
                    facebook: 'https://facebook.com/lichtenbergkamer',
                    instagram: 'https://instagram.com/lichtenbergkamer',
                    twitter: 'https://twitter.com/lichtenbergkamer',
                    whatsapp: '+49123456789',
                    contactWhatsAppMessage: 'Bonjour, je souhaiterais avoir des informations sur le club.'
                }
            });
            console.log('✅ Settings seeded');
        }

        // 3. Sponsors
        const sponsorsSnapshot = await db.collection('sponsors').get();
        if (sponsorsSnapshot.empty) {
            const sponsors = [
                { name: 'Nike', website: 'https://nike.com', tier: 'main', logo: '/uploads/sponsors/nike.png' },
                { name: 'MTN', website: 'https://mtn.cm', tier: 'main', logo: '/uploads/sponsors/mtn.png' },
                { name: 'Orange', website: 'https://orange.cm', tier: 'main', logo: '/uploads/sponsors/orange.png' }
            ];
            for (const s of sponsors) {
                await db.collection('sponsors').add(s);
            }
            console.log('✅ Sponsors seeded');
        }

        console.log('🚀 Seeding completed successfully on Firebase');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
