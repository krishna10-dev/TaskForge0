const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Attachment = sequelize.define('Attachment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileSize: {
    type: DataTypes.INTEGER,
  },
  fileType: {
    type: DataTypes.STRING,
  }
});

module.exports = Attachment;