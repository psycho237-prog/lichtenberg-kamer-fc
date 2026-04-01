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


// Initialize self-ping for Render (Only if NOT on Vercel)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
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
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serve Static Assets (Only if NOT on Vercel)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
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

            // Fetch dynamic content based on path
            const isNews = req.path.startsWith('/news/');
            let title = "Lichtenberg-Kamer e.V";
            let description = "Lichtenberg-Kamer e.V - Club de football communautaire à Berlin.";
            let image = "https://lichtenbergkamer.page/images/logo.png";
            let url = "https://lichtenbergkamer.page" + req.path;

            if (isNews) {
                const articleId = req.path.split('/')[2];
                try {
                    const newsDoc = await db.collection('news').doc(articleId).get();
                    if (newsDoc.exists) {
                        const data = newsDoc.data();
                        title = data.title + " | Lichtenberg-Kamer e.V";
                        image = data.image ? data.image : image;
                        if (data.content) {
                            description = data.content
                                .replace(/<[^>]*>/g, '')
                                .replace(/\s+/g, ' ')
                                .trim()
                                .substring(0, 160);
                        }
                    }
                } catch (e) {
                    console.error("News Fetch Error:", e);
                }
            } else {
                // Fetch dynamic about content for home or other pages
                try {
                    const homeDoc = await db.collection('pages').doc('home').get();
                    if (homeDoc.exists) {
                        const data = homeDoc.data();
                        if (data.content && data.content.aboutContent) {
                            description = data.content.aboutContent
                                .replace(/<[^>]*>/g, '')
                                .replace(/\s+/g, ' ')
                                .trim()
                                .substring(0, 160);
                        }
                    }
                } catch (e) {
                    console.error("Home Fetch Error:", e);
                }
            }

            // Inject into HTML placeholders
            indexHtml = indexHtml
                .replace('__META_DESCRIPTION__', description)
                .replace(/__OG_TITLE__/g, title)
                .replace(/__OG_DESCRIPTION__/g, description)
                .replace(/__OG_IMAGE__/g, image)
                .replace(/__OG_URL__/g, url)
                .replace('<title>Lichtenberg-Kamer e.V</title>', `<title>${title}</title>`);

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

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`Local network access: http://0.0.0.0:${PORT}`);
    });
}

module.exports = app;
