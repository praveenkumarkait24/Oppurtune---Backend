const { analyzeResumeMatch } = require('../utils/aiUtils');
const ResumeAnalysis = require('../models/resumeModel');

const analyzeResume = async (req, res) => {
    try {
        const { jobDescription, resumeText } = req.body;

        // In a real app, you'd use a PDF parser here to extract text from req.file.path
        // For this demo, we assume resumeText is sent or extracted.

        const analysis = await analyzeResumeMatch(resumeText || "Demo Resume Content", jobDescription);

        const savedAnalysis = await ResumeAnalysis.create({
            userId: req.user.id,
            jobDescription,
            matchScore: analysis.matchScore,
            missingSkills: analysis.missingSkills,
            suggestions: analysis.suggestions
        });

        res.status(200).json(savedAnalysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { analyzeResume };
