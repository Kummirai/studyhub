const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { Subject, StudyGuide } = require('../models');

// @route   GET api/study/subjects
// @desc    Get all subjects (optionally filtered by grade)
// @access  Private
router.get('/subjects', async (req, res) => {
  try {
    const { grade } = req.query;
    let where = {};
    
    if (grade) {
      where.grade_level = parseInt(grade);
    }
    
    const subjects = await Subject.findAll({
      where,
      order: [['grade_level', 'ASC'], ['name', 'ASC']]
    });
    
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
    const guide = await StudyGuide.findByPk(req.params.id, {
      include: [{
        model: Subject,
        attributes: ['name']
      }]
    });
    
    if (!guide) {
      return res.status(404).json({ message: 'Study guide not found' });
    }
    
    // Get user progress (you would normally query the Progress model here)
    const userProgress = {
      completion_percentage: 0,
      notes: '',
      last_accessed: new Date()
    };
    
    // Get related guides (same subject)
    const relatedGuides = await StudyGuide.findAll({
      where: {
        subject_id: guide.subject_id,
        id: { [Sequelize.Op.ne]: guide.id }
      },
      limit: 3,
      include: [{
        model: Subject,
        attributes: ['name']
      }]
    });
    
    res.json({
      guide: {
        ...guide.toJSON(),
        subject_name: guide.Subject.name
      },
      user_progress: userProgress,
      related_guides: relatedGuides.map(g => ({
        ...g.toJSON(),
        subject_name: g.Subject.name
      }))
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;