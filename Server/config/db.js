const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Live Cloud Database (Neon - Postgres / Aiven - MySQL)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    // Neon automatically uses postgres, but let's be explicit
    dialect: process.env.DB_DIALECT || (process.env.DATABASE_URL.startsWith('postgres') ? 'postgres' : 'mysql'),
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Local SQLite for Development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false,
  });
}

module.exports = sequelize;
