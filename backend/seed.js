const mongoose = require('mongoose');
const User = require('./models/User');
const Page = require('./models/Page');
const Sponsor = require('./models/Sponsor');
const connectDB = require('./config/database');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();
        console.log('--- Starting Seeding ---');
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
                    seasonPeriod: '2024/2025',
                    aboutContent: '<h2>NOTRE HISTOIRE</h2><p>Lichtenberg-Kamer FC est bien plus qu\'un club de football. Fondé par la communauté camerounaise de Berlin (Lichtenberg), nous représentons les valeurs d\'excellence, d\'intégration et de solidarité.</p>',
                    visionContent: '<p>Devenir une référence du football communautaire en Allemagne et servir de pont entre les cultures à travers le sport.</p>',
                    philosophyContent: '<p>Discipline, Travail, et Fair-play sont les piliers qui guident chacun de nos joueurs, du centre de formation à l\'équipe première.</p>'
                }
            });
            console.log('Home page content seeded');
        } else {
            // Update existing home page if needed
            homePage.content.seasonPeriod = homePage.content.seasonPeriod || '2024/2025';
            homePage.markModified('content');
            await homePage.save();
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
                    mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d155453.79373268875!2d13.259929841804306!3d52.50692742186845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e373f132f3d%3A0x4208ad12ac50a30!2sLichtenberg%2C%20Berlin!5e0!3m2!1sfr!2sde!4v1715421256789!5m2!1sfr!2sde" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
                    infoContent: '<p>Une question sur la billetterie, l\'académie ou le club ? Nos équipes sont à votre entière disposition à Berlin.</p>',
                    workingHours: 'Lun - Ven, 08:30 - 17:00'
                }
            });
            console.log('Contact page content seeded');
        } else {
            contactPage.content.mapIframe = contactPage.content.mapIframe || '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d155453.79373268875!2d13.259929841804306!3d52.50692742186845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e373f132f3d%3A0x4208ad12ac50a30!2sLichtenberg%2C%20Berlin!5e0!3m2!1sfr!2sde!4v1715421256789!5m2!1sfr!2sde" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
            contactPage.markModified('content');
            await contactPage.save();
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

        // 5. Settings Page (Global Config)
        const settingsPage = await Page.findOne({ slug: 'settings' });
        if (!settingsPage) {
            await Page.create({
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
            console.log('Settings page content seeded');
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
