const express = require('express');
const router = express.Router();
const { handleConversation } = require('../services/conversationEngine');
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');

// Get all conversations for a user
router.get('/history', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Get a specific conversation
router.get('/:id', auth, async (req, res) => {
    try {
        const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
        res.json(conversation);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});
// Delete a specific conversation
router.delete('/:id', auth, async (req, res) => {
    try {
        const conversation = await Conversation.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
        res.json({ message: 'Conversation deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
});

// New or continue conversation
router.post('/', async (req, res) => {
    try {
        const { message, conversationId } = req.body;
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
                // Invalid token, treat as guest
            }
        }

        let history = [];
        if (userId && conversationId) {
            conversation = await Conversation.findOne({ _id: conversationId, userId });
            if (conversation) {
                history = conversation.messages.map(m => ({ role: m.role, content: m.content }));
            }
        }

        const result = await handleConversation(null, message, history);

        if (userId) {
            if (!conversation) {
                conversation = new Conversation({
                    userId,
                    title: message.substring(0, 30) + '...',
                    messages: []
                });
            }
            conversation.messages.push({ role: 'user', content: message });
            conversation.messages.push({ 
                role: 'assistant', 
                content: result.content, 
                thought: result.thought 
            });
            await conversation.save();
            result.conversationId = conversation._id;
        }

        res.json(result);
    } catch (err) {
        console.error('Chat Error:', err);
        res.status(500).json({ error: 'Neural Core Error' });
    }
});

module.exports = router;
