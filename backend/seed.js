const User = require('./models/User');
const connectDB = require('./config/database');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            await User.create({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            });
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
