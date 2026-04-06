const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Subtask = sequelize.define('Subtask', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
});

module.exports = Subtask;