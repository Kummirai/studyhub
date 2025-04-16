const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const Subject = require('../models/Subject');
const StudyGuide = require('../models/StudyGuide');

// @route   GET api/study/subjects
// @desc    Get all subjects (optionally filtered by grade)
// @access  Private
router.get('/subjects', async (req, res) => {
    try {
        const { grade } = req.query;
        let query = {};
        
        if (grade) {
            query.grade_level = parseInt(grade);
        }
        
        const subjects = await Subject.find(query).sort('grade_level name');
        res.json(subjects);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/study/guide/:id
// @desc    Get study guide by ID with user progress
// @access  Private
router.get('/guide/:id', async (req, res) => {
    try {
        const guide = await StudyGuide.findById(req.params.id).populate('subject_id', 'name');
        
        if (!guide) {
            return res.status(404).json({ message: 'Study guide not found' });
        }
        
        // In a real app, you would fetch user progress from the Progress model here
        // For simplicity, we'll return a mock progress object
        const userProgress = {
            completion_percentage: 0,
            notes: '',
            last_accessed: new Date()
        };
        
        // Get related guides (same subject)
        const relatedGuides = await StudyGuide.find({
            subject_id: guide.subject_id,
            _id: { $ne: guide._id }
        }).limit(3);
        
        res.json({
            guide: {
                ...guide.toObject(),
                subject_name: guide.subject_id.name
            },
            user_progress: userProgress,
            related_guides: relatedGuides.map(g => ({
                ...g.toObject(),
                subject_name: guide.subject_id.name
            }))
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;