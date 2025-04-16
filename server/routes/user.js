const express = require('express');
const router = express.Router();
const User = require('../models/User');
const StudyGuide = require('../models/StudyGuide');
const Progress = require('../models/Progress');

// @route   GET api/user/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Mock data - in a real app, you would query the database
        const dashboardData = {
            guides_completed: 5,
            avg_progress: 65,
            recent_activity: [
                {
                    guide_id: '1',
                    guide_title: 'Algebra Basics',
                    subject_name: 'Mathematics',
                    completion_percentage: 75,
                    last_accessed: new Date()
                },
                {
                    guide_id: '2',
                    guide_title: 'Chemical Reactions',
                    subject_name: 'Science',
                    completion_percentage: 50,
                    last_accessed: new Date(Date.now() - 86400000)
                }
            ],
            recommended_guides: [
                {
                    id: '3',
                    title: 'Geometry Fundamentals',
                    subject_name: 'Mathematics',
                    difficulty_level: 'Intermediate'
                },
                {
                    id: '4',
                    title: 'Physics: Motion',
                    subject_name: 'Science',
                    difficulty_level: 'Beginner'
                }
            ],
            progress_by_subject: [
                {
                    subject_name: 'Mathematics',
                    avg_progress: 80
                },
                {
                    subject_name: 'Science',
                    avg_progress: 60
                },
                {
                    subject_name: 'English',
                    avg_progress: 45
                }
            ]
        };
        
        res.json(dashboardData);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT api/user/progress/:id
// @desc    Update user progress for a study guide
// @access  Private
router.put('/progress/:id', async (req, res) => {
    try {
        const { completion_percentage } = req.body;
        const userId = req.user.id;
        const guideId = req.params.id;
        
        // In a real app, you would update or create a progress record
        // For now, we'll just return a success message
        res.json({ message: 'Progress updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT api/user/notes/:id
// @desc    Update user notes for a study guide
// @access  Private
router.put('/notes/:id', async (req, res) => {
    try {
        const { notes } = req.body;
        const userId = req.user.id;
        const guideId = req.params.id;
        
        // In a real app, you would update the progress record with notes
        // For now, we'll just return a success message
        res.json({ message: 'Notes saved successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT api/user/progress/:id/access
// @desc    Update last accessed time for a study guide
// @access  Private
router.put('/progress/:id/access', async (req, res) => {
    try {
        const userId = req.user.id;
        const guideId = req.params.id;
        
        // In a real app, you would update the last_accessed field
        // For now, we'll just return a success message
        res.json({ message: 'Last accessed time updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;