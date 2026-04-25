const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

// CORS (allow frontend + local)
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://voterai.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// MongoDB Connection (clean + stable)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

connectDB();

// Root route
app.get("/", (req, res) => {
    res.send("VoterAI Server is running 🚀");
});

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Neural Core Active' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});