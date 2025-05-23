const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'Not authorized, no token'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            message: 'Not authorized'
        });
    }
};

module.exports = { protect };