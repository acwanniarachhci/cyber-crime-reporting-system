const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const ScamDatabase = sequelize.define('ScamDatabase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  scamType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  scammerPhone: DataTypes.STRING,
  scammerAccount: DataTypes.STRING,
  scammerWebsite: DataTypes.STRING,
  platform: DataTypes.STRING,
  reportCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

ScamDatabase.belongsTo(User, { as: 'verifiedBy', foreignKey: 'verifiedById' });

module.exports = ScamDatabase;
