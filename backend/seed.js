const mongoose = require('mongoose');
const User = require('./models/User');
const Page = require('./models/Page');
const Sponsor = require('./models/Sponsor');
const connectDB = require('./config/database');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        // 1. Admin User
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            await User.create({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            });
            console.log('Admin user created');
        }

        // 2. Home Page Content
        const homePage = await Page.findOne({ slug: 'home' });
        if (!homePage) {
            await Page.create({
                slug: 'home',
                title: 'Home Page',
                content: {
                    heroTitle: 'LICHTENBERG KAMER FC',
                    heroSubtitle: "L'ascension d'un club, la passion d'un peuple. Ensemble, vers les sommets du football camerounais.",
                    aboutContent: '<h2>NOTRE HISTOIRE</h2><p>Lichtenberg-Kamer FC est bien plus qu\'un club de football. Fondé par la communauté camerounaise de Berlin (Lichtenberg), nous représentons les valeurs d\'excellence, d\'intégration et de solidarité.</p>',
                    visionContent: '<p>Devenir une référence du football communautaire en Allemagne et servir de pont entre les cultures à travers le sport.</p>',
                    philosophyContent: '<p>Discipline, Travail, et Fair-play sont les piliers qui guident chacun de nos joueurs, du centre de formation à l\'équipe première.</p>'
                }
            });
            console.log('Home page content seeded');
        }

        // 3. Contact Page
        const contactPage = await Page.findOne({ slug: 'contact' });
        if (!contactPage) {
            await Page.create({
                slug: 'contact',
                title: 'Contact Page',
                content: {
                    address: 'Lichtenberg, Berlin, Germany',
                    phone: '+49 123 456 789',
                    email: 'contact@lichtenberg-kamer.de',
                    infoContent: '<p>Une question sur la billetterie, l\'académie ou le club ? Nos équipes sont à votre entière disposition à Berlin.</p>',
                    workingHours: 'Lun - Ven, 08:30 - 17:00'
                }
            });
            console.log('Contact page content seeded');
        }

        // 4. Tickets Page
        const ticketsPage = await Page.findOne({ slug: 'tickets' });
        if (!ticketsPage) {
            await Page.create({
                slug: 'tickets',
                title: 'Tickets Page',
                content: {
                    headerTitle: 'BILLETTERIE OFFICIELLE',
                    headerSubtitle: 'Réservez vos places pour les prochains matchs.',
                    ticketsDescription: '<h2>INFORMATIONS GÉNÉRALES</h2><p>Les billets sont disponibles en ligne ou au guichet.</p>',
                    priceStandard: '10€',
                    priceVIP: '25€',
                    pointsOfSale: 'Stade de Lichtenberg, Boutique Officielle'
                }
            });
            console.log('Tickets page content seeded');
        }

        // 5. Sponsors
        const sponsorsExist = await Sponsor.countDocuments();
        if (sponsorsExist === 0) {
            await Sponsor.create([
                { name: 'Nike', website: 'https://nike.com', tier: 'main', logo: '/uploads/sponsors/nike.png' },
                { name: 'MTN', website: 'https://mtn.cm', tier: 'main', logo: '/uploads/sponsors/mtn.png' },
                { name: 'Orange', website: 'https://orange.cm', tier: 'main', logo: '/uploads/sponsors/orange.png' }
            ]);
            console.log('Mock sponsors seeded (logos are placeholders)');
        }

        console.log('Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
