const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Report = require('./Report');

const AdminNote = sequelize.define('AdminNote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

AdminNote.belongsTo(Report, { foreignKey: 'reportId', onDelete: 'CASCADE' });
AdminNote.belongsTo(User, { as: 'addedBy', foreignKey: 'addedById' });
Report.hasMany(AdminNote, { foreignKey: 'reportId' });

module.exports = AdminNote;
