const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Open', 'In Progress', 'Resolved'),
    defaultValue: 'Open',
  }
});

module.exports = Ticket;