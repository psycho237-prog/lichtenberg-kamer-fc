const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { admin, db } = require('./config/firebase');
const keepAlive = require('./utils/autoping');

// Load env vars
dotenv.config();


// Initialize self-ping for Render
if (process.env.NODE_ENV === 'production') {
    keepAlive(process.env.RENDER_EXTERNAL_URL);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/players', require('./routes/playersRoutes'));
app.use('/api/matches', require('./routes/matchesRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/gallery', require('./routes/photoRoutes'));
app.use('/api/player-stats', require('./routes/playerStatsRoutes'));
app.use('/api/pages', require('./routes/pageRoutes'));
app.use('/api/sponsors', require('./routes/sponsorRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serve Static Assets in production
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '..', 'frontend', 'dist');
    const fs = require('fs');

    // 1. Serve static assets first (CSS, JS, Images)
    app.use(express.static(distPath, { index: false })); // index: false prevents serving index.html statically

    // 2. Dynamic route for index.html injection
    app.get(/.*/, async (req, res) => {
        // Skip API, uploads, and files with extensions (assets)
        if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || path.extname(req.path)) {
            return res.sendFile(path.join(distPath, req.path));
        }

        try {
            // Read index.html
            let indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');

            // Fetch dynamic about content from Firestore
            const homeDoc = await db.collection('pages').doc('home').get();
            let description = "Lichtenberg-Kamer e.V - Club de football communautaire à Berlin.";

            if (homeDoc.exists) {
                const data = homeDoc.data();
                if (data.content && data.content.aboutContent) {
                    // Strip HTML tags and limit length
                    description = data.content.aboutContent
                        .replace(/<[^>]*>/g, '') // Remove HTML tags
                        .replace(/\s+/g, ' ')    // Clean whitespaces
                        .trim()
                        .substring(0, 160);      // SEO limit
                }
            }

            // Inject into HTML placeholder
            indexHtml = indexHtml.replace('__META_DESCRIPTION__', description);

            res.send(indexHtml);
        } catch (err) {
            console.error('SEO Injection Error:', err);
            res.sendFile(path.join(distPath, 'index.html'));
        }
    });
} else {
    app.get('/', (req, res) => {
        res.send(`Server is running in ${process.env.NODE_ENV || 'development'} mode. To see the website, set NODE_ENV to production.`);
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Local network access: http://0.0.0.0:${PORT}`);
});
