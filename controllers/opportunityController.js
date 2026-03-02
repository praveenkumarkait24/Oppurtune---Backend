const Opportunity = require('../models/opportunityModel');

const getOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.find({ userId: req.user.id }).sort({ deadline: 1 });
        res.json(opportunities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOpportunity = async (req, res) => {
    try {
        const { company, role, deadline, skillsRequired, link } = req.body;
        const opportunity = await Opportunity.create({
            userId: req.user.id,
            company,
            role,
            deadline,
            skillsRequired,
            link
        });
        res.status(201).json(opportunity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        if (opportunity.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedOpportunity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        if (opportunity.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await opportunity.deleteOne();
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity
};
