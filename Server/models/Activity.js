const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Activity = sequelize.define('Activity', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'comment' // comment, file, complete
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  target: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
});

module.exports = Activity;
