const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const options = {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            },
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        };
        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
