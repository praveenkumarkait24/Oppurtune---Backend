// 1. FIRST LINE: Load env
require("dotenv").config();
const path = require('path');

console.log('--- Environment Diagnostics ---');
console.log(`Working Directory: ${process.cwd()}`);
console.log(`.env Path: ${path.join(process.cwd(), '.env')}`);
console.log(`MONGO_URI exists: ${!!process.env.MONGO_URI}`);
console.log('-------------------------------');

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');

// Initialize Express
const app = express();

require('./config/passport');

const startServer = async () => {
    try {
        console.log('🚀 Starting Opportune Backend...');

        if (!process.env.MONGO_URI && process.env.FORCE_TEST_URI !== 'true') {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        // 5. Ensure Server Starts ONLY After DB Connects
        await connectDB();

        // Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(cors({
            origin: process.env.FRONTEND_URL,
            credentials: true
        }));

        app.use(session({
            secret: process.env.JWT_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false }
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        // Routes
        app.use('/api/auth', require('./routes/authRoutes'));
        app.use('/api/opportunities', require('./routes/opportunityRoutes'));
        app.use('/api/resume', require('./routes/resumeRoutes'));
        app.use('/api/analytics', require('./routes/analyticsRoutes'));

        // Start Listening
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`✨ Server live in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error(`🔥 CRITICAL ERROR: ${error.message}`);
        process.exit(1);
    }
};

// Start the sequence
startServer();
