const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        console.log('Registration attempt:', { email: req.body.email, name: req.body.name });
        const { name, email, phone, password, role, firebaseUid } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, phone, password: hashedPassword, role, firebaseUid });
        await user.save();
        console.log('User saved successfully:', { id: user._id, email: user.email });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { email, name, firebaseUid } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user for Google Sign-In
            // Generate a random password since they use Google Auth
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({
                name,
                email,
                phone: "0000000000", // Placeholder for Google Sign-In
                password: hashedPassword,
                role: 'customer', // Match schema default
                firebaseUid
            });
            await user.save();
            console.log('New Google user created:', email);
        } else {
            // Update firebaseUid if not present
            if (!user.firebaseUid) {
                user.firebaseUid = firebaseUid;
                await user.save();
            }
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { register, login, googleLogin };
