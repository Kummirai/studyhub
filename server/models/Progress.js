const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const StudyGuide = require('./StudyGuide');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  completion_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    },
    field: 'completion_percentage'
  },
  notes: {
    type: DataTypes.TEXT,
    field: 'notes'
  },
  last_accessed: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_accessed'
  }
}, {
  tableName: 'user_progress',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'guide_id']
    }
  ]
});

// Define associations
Progress.belongsTo(User, { foreignKey: 'user_id' });
Progress.belongsTo(StudyGuide, { foreignKey: 'guide_id' });

module.exports = Progress;