const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
    defaultValue: 'To Do',
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium',
  },
  dueDate: {
    type: DataTypes.DATE,
  },
  project: {
    type: DataTypes.STRING,
  },
  assignee: {
    type: DataTypes.STRING,
  },
  tags: {
    type: DataTypes.STRING,
  },
});

module.exports = Task;
