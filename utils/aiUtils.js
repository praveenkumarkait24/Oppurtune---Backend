const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const extractDetailsFromLink = async (link) => {
    try {
        const prompt = `Extract job details (company, role, deadline (YYYY-MM-DD), skillsRequired (array)) from this job link or description: ${link}. Return the result strictly as a JSON object with these keys.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the response in case Gemini adds markdown code blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Could not parse JSON from Gemini response");
    } catch (error) {
        console.error('Gemini Extraction Error:', error);
        throw new Error('Failed to extract details using Gemini');
    }
};

const analyzeResumeMatch = async (resumeText, jobDescription) => {
    try {
        const prompt = `Analyze the match between this Resume and Job Description. 
        Resume: ${resumeText}
        Job Description: ${jobDescription}
        
        Return a JSON object with:
        - matchScore (0-100)
        - missingSkills (array)
        - suggestions (array)
        
        Return the result strictly as a JSON object.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Could not parse JSON from Gemini response");
    } catch (error) {
        console.error('Gemini Resume Analysis Error:', error);
        throw new Error('Failed to analyze resume match using Gemini');
    }
};

module.exports = {
    extractDetailsFromLink,
    analyzeResumeMatch
};
