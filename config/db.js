const mongoose = require('mongoose');

// Mask password in URI for logging
const maskURI = (uri) => {
    if (!uri) return "undefined";
    return uri.replace(/:([^@]+)@/, ':****@');
};

const connectDB = async () => {
    // 3. Disable Mongoose Buffering
    mongoose.set("bufferCommands", false);

    if (process.env.NODE_ENV === 'development') {
        mongoose.set("debug", true);
    }

    try {
        let uri = process.env.MONGO_URI;

        // 4. Hardcoded Fallback Test Mode
        if (process.env.FORCE_TEST_URI === 'true') {
            console.log('⚠️ DEBUG: FORCE_TEST_URI is enabled. Using hardcoded fallback.');
            uri = "mongodb+srv://opportuneUser:LEODASS10@opportuneorg.j05ild7.mongodb.net/opportune?retryWrites=true&w=majority";
        }

        console.log('--- MongoDB URI Validation ---');
        const masked = maskURI(uri);
        console.log(`URI (Masked): ${masked}`);

        // 2 & 3. Strict URI Validation & Character Debugging
        const prefix = uri ? uri.substring(0, 15) : "";
        console.log(`Prefix (Raw): ${prefix}`);

        const charCodes = [];
        for (let i = 0; i < prefix.length; i++) {
            charCodes.push(`${prefix[i]}:${prefix.charCodeAt(i)}`);
        }
        console.log(`Char Codes: ${charCodes.join(' | ')}`);

        if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
            console.error("❌ INVALID MONGO URI FORMAT");
            console.error("The URI must start with 'mongodb://' or 'mongodb+srv://'.");
            console.error("Double-check your .env file for missing slashes or hidden characters.");
            process.exit(1);
        }
        console.log('✅ URI Format Validated');
        console.log('------------------------------');

        // Connection Event Listeners
        mongoose.connection.on("connected", () => console.log("EVENT: Connected to MongoDB"));
        mongoose.connection.on("error", (err) => console.error(`EVENT: MongoDB Error: ${err.message}`));
        mongoose.connection.on("disconnected", () => console.warn("EVENT: Disconnected from MongoDB"));

        await mongoose.connect(uri);
        console.log('🚀 MongoDB Connected Successfully');

    } catch (error) {
        // 6. Improve Error Classification
        console.error('❌ MONGODB CONNECTION FAILED');

        if (error.code === 'ENOTFOUND' || error.message.includes('DNS')) {
            console.error('CLASSIFICATION: DNS Resolution Issue. Check your internet or if the host exists.');
        } else if (error.message.includes('Authentication failed') || error.code === 18) {
            console.error('CLASSIFICATION: Authentication Failure. Check your database username and password.');
        } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
            console.error('CLASSIFICATION: Network Timeout. Your connection might be too slow or blocked.');
        } else if (error.message.includes('replica set') || error.message.includes('topology')) {
            console.error('CLASSIFICATION: Replica Set / Topology Mismatch. Check your connection string parameters.');
        } else if (error.name === 'MongooseServerSelectionError') {
            console.error('CLASSIFICATION: Server Selection Error. Likely an IP whitelist issue or port 27017 is blocked.');
        } else {
            console.error(`CLASSIFICATION: Unknown Error - ${error.name}`);
            console.error(error.stack);
        }

        process.exit(1);
    }
};

module.exports = connectDB;
