const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ FINAL CORS (works with Vercel + localhost)
app.use(cors({
    origin: true,
    credentials: true
}));

// Middleware
app.use(express.json());

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        setTimeout(connectDB, 5000);
    }
};
connectDB();

// Root Route (important for Render check)
app.get("/", (req, res) => {
    res.send("VoterAI Server Running 🚀");
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

// Health Route
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// ✅ SAFE fallback (NO '*' crash)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});