const Opportunity = require('../models/opportunityModel');

const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalApplications = await Opportunity.countDocuments({ userId });
        const statusCounts = await Opportunity.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const upcomingDeadlines = await Opportunity.find({
            userId,
            deadline: { $gte: new Date() }
        }).limit(5).sort({ deadline: 1 });

        res.json({
            totalApplications,
            statusCounts,
            upcomingDeadlines
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAnalytics };
