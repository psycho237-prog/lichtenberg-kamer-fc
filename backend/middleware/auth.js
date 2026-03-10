const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const userDoc = await db.collection('users').doc(decoded.id).get();
            if (!userDoc.exists) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            const userData = userDoc.data();
            delete userData.password;

            req.user = { _id: userDoc.id, ...userData };
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
