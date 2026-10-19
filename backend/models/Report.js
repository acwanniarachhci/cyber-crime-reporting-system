const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const { sequelize } = require('../config/db');
const User = require('./User');

function generateCaseId() {
  return 'SC-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  caseId: {
    type: DataTypes.STRING,
    unique: true,
    defaultValue: generateCaseId,
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  contactEmail: DataTypes.STRING,
  contactPhone: DataTypes.STRING,
  scamType: {
    type: DataTypes.ENUM(
      'phishing', 'fake_account', 'payment_scam', 'online_shopping_scam',
      'investment_scam', 'job_scam', 'romance_scam', 'sim_swap', 'malware', 'other'
    ),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  scammerPhone: DataTypes.STRING,
  scammerAccount: DataTypes.STRING,
  scammerName: DataTypes.STRING,
  scammerWebsite: DataTypes.STRING,
  platform: DataTypes.STRING,
  amountLost: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'LKR',
  },
  evidenceFiles: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('submitted', 'under_review', 'investigating', 'verified', 'resolved', 'rejected'),
    defaultValue: 'submitted',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
  },
}, {
  timestamps: true,
});

// Relationships
Report.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' });
Report.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });

module.exports = Report;
