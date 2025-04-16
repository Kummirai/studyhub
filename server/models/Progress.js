const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    guide_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyGuide',
        required: true
    },
    completion_percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    last_accessed: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Ensure one progress record per user per guide
ProgressSchema.index({ user_id: 1, guide_id: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);