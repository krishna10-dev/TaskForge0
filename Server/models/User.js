const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-z2WIhgurtWUxbKYZtBnKdBUDqhPT0kxzO44hY9lTpCLA7xp28rIiOM5kyRw_XVsygv66QDEuf8B8hn_wyLRSZXpM3K4MI5wQfUpjkM8hcAa-PAAkyc5z2rLXUGMdnpwBcJqbs1Xa91_jW6IoW1K4jKVhzPl-g7h1CAx3llXvjyRnDFmSq6LwZUjd8vIXjz-3w8sHN6_s8lgi1BSVKF04deBD6vQDqZx0qjD1-NYbVaBhy7Zmcli9PC7AA42cubkAcIoIlZO-alII'
  },
  jobTitle: {
    type: DataTypes.STRING,
    defaultValue: 'Senior Project Orchestrator'
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

User.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
