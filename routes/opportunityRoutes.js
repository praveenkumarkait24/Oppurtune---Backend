const express = require('express');
const router = express.Router();
const {
    getOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getOpportunities)
    .post(protect, createOpportunity);

router.route('/:id')
    .put(protect, updateOpportunity)
    .delete(protect, deleteOpportunity);

module.exports = router;
