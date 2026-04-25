const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

// CORS FIX
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://voterai.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// DB CONNECT
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(err.message);
        setTimeout(connectDB, 5000);
    }
};
connectDB();

// ROOT
app.get("/", (req, res) => {
    res.send("VoterAI Server Running 🚀");
});

// ROUTES
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

// HEALTH
app.get('/health', (req, res) => {
    res.json({ status: "OK" });
});

// ❌ REMOVE any "*" routes
// ✅ USE THIS INSTEAD
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});