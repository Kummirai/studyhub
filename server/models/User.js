const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash'
  },
  grade_level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 7,
      max: 10
    },
    field: 'grade_level'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'users',
  timestamps: false,
  underscored: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password_hash')) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    }
  }
});

// Instance method to compare passwords
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// Generate JWT token
User.prototype.generateAuthToken = function() {
  return jwt.sign(
    { user: { id: this.id } },
    config.get('jwtSecret'),
    { expiresIn: '7d' }
  );
};

module.exports = User;