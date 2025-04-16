const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Subject = require('./Subject');

const StudyGuide = sequelize.define('StudyGuide', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  difficulty_level: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    defaultValue: 'Beginner'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'study_guides',
  timestamps: false,
  underscored: true
});

// Define associations
StudyGuide.belongsTo(Subject, { foreignKey: 'subject_id' });
Subject.hasMany(StudyGuide, { foreignKey: 'subject_id' });

module.exports = StudyGuide;