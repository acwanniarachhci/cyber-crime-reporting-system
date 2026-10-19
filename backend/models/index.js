const { sequelize } = require('../config/db');
const User = require('./User');
const Report = require('./Report');
const AdminNote = require('./AdminNote');
const ScamDatabase = require('./ScamDatabase');

// Auto-creates/updates tables in PostgreSQL to match these models
const syncModels = async () => {
  await sequelize.sync({ alter: true });
  console.log('📦 Database tables synced');
};

module.exports = { sequelize, User, Report, AdminNote, ScamDatabase, syncModels };
