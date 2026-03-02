const mongoose = require('mongoose');

const resumeAnalysisSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    jobDescription: {
        type: String,
        required: true
    },
    matchScore: {
        type: Number,
        required: true
    },
    missingSkills: [String],
    suggestions: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
