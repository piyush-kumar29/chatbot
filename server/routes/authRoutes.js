const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretneuralcorekey';

// Auth middleware inline for admin check
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (e) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        // If it's the very first user, make them an admin automatically
        const count = await User.countDocuments();
        if (count === 0) user.role = 'admin';
        
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { username, email, role: user.role } });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(400).json({ error: 'Registration failed. User might already exist.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { username: user.username, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Login error' });
    }
});

// Get all users (Admin only)
router.get('/users', authenticate, async (req, res) => {
    try {
        const caller = await User.findById(req.userId);
        if (!caller || caller.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden. Admin access required.' });
        }
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Change user role (Admin only)
router.put('/users/:id/role', authenticate, async (req, res) => {
    try {
        const caller = await User.findById(req.userId);
        if (!caller || caller.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden. Admin access required.' });
        }
        
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const targetUser = await User.findById(req.params.id);
        if (!targetUser) return res.status(404).json({ error: 'User not found' });
        
        // Prevent admin from demoting themselves
        if (targetUser._id.toString() === req.userId && role !== 'admin') {
             return res.status(400).json({ error: 'Cannot demote yourself.' });
        }

        targetUser.role = role;
        await targetUser.save();
        
        res.json({ message: 'Role updated successfully', user: { _id: targetUser._id, role: targetUser.role } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update role' });
    }
});

module.exports = router;
