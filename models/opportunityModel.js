const mongoose = require('mongoose');

const opportunitySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    role: {
        type: String,
        required: [true, 'Please add a role']
    },
    deadline: {
        type: Date,
        required: [true, 'Please add a deadline']
    },
    skillsRequired: [String],
    status: {
        type: String,
        enum: ['Applied', 'OA', 'Interview', 'Rejected', 'Selected'],
        default: 'Applied'
    },
    link: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
