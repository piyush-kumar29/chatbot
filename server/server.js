const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Robust CORS (handles Vercel + local + preview URLs)
const allowedOrigins = [
  "http://localhost:5173",
  "https://voterai.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());

// Database Connection with Retry Logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/voter_assistant');
    console.log('◇ MongoDB Connected: Neural Core Sync Complete');
  } catch (err) {
    console.error('◇ Neural Core Connection Failed:', err.message);
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("VoterAI Server is running 🚀");
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Neural Core Active', latency: '12ms' });
});

app.listen(PORT, () => {
  console.log(`◇ VoterAI Server running on port ${PORT}`);
  console.log(`◇ Environment: ${process.env.NODE_ENV || 'development'}`);
});