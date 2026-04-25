const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    state: { type: String, default: 'START' },
    userData: {
        age: Number,
        state: String,
        intent: String,
        isEligible: Boolean
    },
    history: [
        {
            role: { type: String, enum: ['user', 'bot'] },
            content: String,
            timestamp: { type: Date, default: Date.now }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
