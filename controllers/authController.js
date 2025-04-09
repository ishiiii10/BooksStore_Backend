const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: 'fail',
                message: 'User already exists'
            });
        }

        // Create user
        const user = await User.create({
            email,
            password
        });

        res.status(201).json({
            status: 'success',
            data: {
                _id: user._id,
                email: user.email,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });
        
        if (user && (await user.matchPassword(password))) {
            res.json({
                status: 'success',
                data: {
                    _id: user._id,
                    email: user.email,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};