const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const keepAlive = require('./utils/autoping');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

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
app.use('/api/pages', require('./routes/pageRoutes'));
app.use('/api/sponsors', require('./routes/sponsorRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serve Static Assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('(.*)', (req, res) => {
        if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
            res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
        }
    });
} else {
    // Root route
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
