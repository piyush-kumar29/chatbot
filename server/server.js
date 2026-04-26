const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

// ── Crash Guards ──────────────────────────────────────────────────────────────
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION (server kept running):', err.message);
});

process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED REJECTION (server kept running):', reason);
});

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow all origins so local dev + any future deployment always works
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// ── MongoDB Connection with Exponential Backoff ───────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
let retryCount = 0;
const MAX_RETRIES = 10;

const connectDB = async () => {
    if (!MONGO_URI) {
        console.error('CRITICAL: No MongoDB URI found in environment variables.');
        return;
    }
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        });
        console.log('MongoDB Connected');
        retryCount = 0;
    } catch (err) {
        retryCount++;
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // max 30s
        console.error(`MongoDB Connection Failed (attempt ${retryCount}): ${err.message}`);
        if (retryCount <= MAX_RETRIES) {
            console.log(`Retrying in ${delay / 1000}s...`);
            setTimeout(connectDB, delay);
        } else {
            console.error('Max retries reached. Running without DB — auth/history features offline.');
        }
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting reconnect...');
    if (retryCount <= MAX_RETRIES) {
        setTimeout(connectDB, 3000);
    }
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err.message);
});

connectDB();

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'VoterAI Neural Core is running 🚀' });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Neural Core Active',
        db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        uptime: Math.floor(process.uptime()) + 's',
    });
});

app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler — prevents Express from crashing
app.use((err, req, res, next) => {
    console.error('Express Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ── Keep-Alive Self-Ping (prevents Render free-tier sleep) ────────────────────
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || `https://chatbot-0g7m.onrender.com`;
if (process.env.NODE_ENV === 'production') {
    setInterval(async () => {
        try {
            const https = require('https');
            https.get(`${RENDER_URL}/health`, (res) => {
                console.log(`Keep-alive ping: ${res.statusCode}`);
            }).on('error', (e) => {
                console.warn('Keep-alive ping failed:', e.message);
            });
        } catch (e) {
            console.warn('Keep-alive error:', e.message);
        }
    }, 14 * 60 * 1000); // every 14 minutes
}