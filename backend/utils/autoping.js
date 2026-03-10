const https = require('https');

/**
 * Self-ping utility to keep Render free tier alive.
 * @param {string} url - The public URL of the deployed application.
 */
const keepAlive = (url) => {
    if (!url) {
        console.log('No RENDER_EXTERNAL_URL found, skipping self-ping.');
        return;
    }

    // Ping every 14 minutes (Render sleeps after 15 minutes)
    const interval = 14 * 60 * 1000;

    setInterval(() => {
        https.get(url, (res) => {
            console.log(`Self-ping to ${url}: Status Code ${res.statusCode}`);
        }).on('error', (err) => {
            console.error(`Self-ping error to ${url}:`, err.message);
        });
    }, interval);

    console.log(`Auto-ping initialized for ${url} every 14 minutes.`);
};

module.exports = keepAlive;
