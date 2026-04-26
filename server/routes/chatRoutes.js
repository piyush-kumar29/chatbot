const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { handleConversation } = require('../services/conversationEngine');
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');

// Helper — check if DB is connected before attempting Mongoose ops
const isDbConnected = () => mongoose.connection.readyState === 1;

// Get all conversations for a user
router.get('/history', auth, async (req, res) => {
    if (!isDbConnected()) return res.json([]); // graceful fallback
    try {
        const conversations = await Conversation.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
        res.json(conversations);
    } catch (err) {
        console.error('History fetch error:', err.message);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Get a specific conversation
router.get('/:id', auth, async (req, res) => {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    try {
        const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
        res.json(conversation);
    } catch (err) {
        console.error('Conversation fetch error:', err.message);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

// Delete a specific conversation
router.delete('/:id', auth, async (req, res) => {
    if (!isDbConnected()) return res.status(503).json({ error: 'Database offline' });
    try {
        const conversation = await Conversation.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
        res.json({ message: 'Conversation deleted' });
    } catch (err) {
        console.error('Delete error:', err.message);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
});

// New or continue conversation
router.post('/', async (req, res) => {
    try {
        const { message, conversationId, agentMode, voiceEnabled, speechLang } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const authHeader = req.headers.authorization;
        let userId = null;
        let conversation = null;

        if (authHeader) {
            const jwt = require('jsonwebtoken');
            const JWT_SECRET = process.env.JWT_SECRET || 'supersecretneuralcorekey';
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.userId;
            } catch (e) {
                // Invalid token — treat as guest
            }
        }

        let history = [];
        if (userId && conversationId && isDbConnected()) {
            try {
                conversation = await Conversation.findOne({ _id: conversationId, userId });
                if (conversation) {
                    history = conversation.messages.map(m => ({ role: m.role, content: m.content }));
                }
            } catch (e) {
                console.warn('Could not load conversation history:', e.message);
            }
        }

        const result = await handleConversation(null, message, history, agentMode, voiceEnabled, speechLang);

        // Save to DB only if user is authenticated and DB is connected
        if (userId && isDbConnected()) {
            try {
                if (!conversation) {
                    conversation = new Conversation({
                        userId,
                        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                        messages: [],
                    });
                }
                conversation.messages.push({ role: 'user', content: message });
                // Clean the content of hidden TTS tags before saving to Atlas
                const cleanContent = result.content.replace(/\[\[TTS:\s*(.*?)\]\]/is, "").trim();
                
                conversation.messages.push({
                    role: 'assistant',
                    content: cleanContent,
                    thought: result.thought,
                });
                await conversation.save();
                result.conversationId = conversation._id;
            } catch (e) {
                console.warn('Could not save conversation:', e.message);
                // Non-fatal — still return the AI response
            }
        }

        res.json(result);
    } catch (err) {
        console.error('Chat route error:', err.message);
        res.status(500).json({
            content: 'I encountered an error processing your request. Please try again.',
            error: 'Neural Core Error',
        });
    }
});

module.exports = router;
