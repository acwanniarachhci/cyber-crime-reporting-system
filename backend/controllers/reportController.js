const Report = require('../models/Report');
const { sendStatusUpdateEmail } = require('../utils/sendEmail');
const User = require('../models/User');

exports.createReport = async (req, res) => {
  try {
    const {
      scamType, description, scammerPhone, scammerAccount, scammerName,
      scammerWebsite, platform, amountLost, currency, contactEmail, contactPhone,
    } = req.body;

    if (!scamType || !description) {
      return res.status(400).json({ message: 'Scam type and description are required' });
    }

    const evidenceFiles = (req.files || []).map((file) => ({
      fileName: file.originalname,
      filePath: `/uploads/${file.filename}`,
      fileType: file.mimetype,
    }));

    const report = await Report.create({
      reporterId: req.user ? req.user.id : null,
      isAnonymous: !req.user,
      scamType, description, scammerPhone, scammerAccount, scammerName,
      scammerWebsite, platform, amountLost: amountLost || 0, currency,
      contactEmail, contactPhone, evidenceFiles,
    });

    res.status(201).json({
      message: 'Report submitted successfully. Save your case ID to track its progress.',
      caseId: report.caseId,
      report,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while submitting report', error: error.message });
  }
};

exports.trackByCaseId = async (req, res) => {
  try {
    const report = await Report.findOne({
      where: { caseId: req.params.caseId },
      attributes: { exclude: ['adminNotes', 'reporterId', 'contactEmail', 'contactPhone'] },
    });

    if (!report) {
      return res.status(404).json({ message: 'No report found with that case ID' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error while tracking case', error: error.message });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: { reporterId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching your reports', error: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const { status, scamType, priority, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (scamType) where.scamType = scamType;
    if (priority) where.priority = priority;
    if (search) {
      where[Op.or] = [
        { scammerPhone: { [Op.iLike]: `%${search}%` } },
        { scammerAccount: { [Op.iLike]: `%${search}%` } },
        { scammerWebsite: { [Op.iLike]: `%${search}%` } },
        { caseId: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const reports = await Report.findAll({
      where,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching reports', error: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const AdminNote = require('../models/AdminNote');
    const report = await Report.findByPk(req.params.id, {
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email', 'phone'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: AdminNote, include: [{ model: User, as: 'addedBy', attributes: ['id', 'name'] }] },
      ],
    });

    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching report', error: error.message });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { status, priority, assignedToId } = req.body;
    const report = await Report.findByPk(req.params.id, {
      include: [{ model: User, as: 'reporter', attributes: ['id', 'name', 'email'] }],
    });

    if (!report) return res.status(404).json({ message: 'Report not found' });

    const statusChanged = status && status !== report.status;

    if (status) report.status = status;
    if (priority) report.priority = priority;
    if (assignedToId !== undefined) report.assignedToId = assignedToId || null;

    await report.save();

    if (statusChanged) {
      const notifyEmail = report.reporter?.email || report.contactEmail;
      if (notifyEmail) {
        sendStatusUpdateEmail(notifyEmail, report.caseId, report.status);
      }
    }

    res.json({ message: 'Report updated successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating report', error: error.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const AdminNote = require('../models/AdminNote');
    const { note } = req.body;
    if (!note) return res.status(400).json({ message: 'Note text is required' });

    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    await AdminNote.create({ note, reportId: report.id, addedById: req.user.id });

    const updatedReport = await Report.findByPk(req.params.id, {
      include: [{ model: AdminNote, include: [{ model: User, as: 'addedBy', attributes: ['id', 'name'] }] }],
    });

    res.json({ message: 'Note added', report: updatedReport });
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding note', error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { sequelize } = require('../models');
    const total = await Report.count();

    const byStatus = await Report.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    const byType = await Report.findAll({
      attributes: ['scamType', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['scamType'],
      raw: true,
    });

    const totalLostResult = await Report.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('amountLost')), 'sum']],
      raw: true,
    });

    res.json({
      total,
      byStatus: byStatus.map((s) => ({ _id: s.status, count: parseInt(s.count) })),
      byType: byType.map((t) => ({ _id: t.scamType, count: parseInt(t.count) })),
      totalAmountLost: parseFloat(totalLostResult[0]?.sum) || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching stats', error: error.message });
  }
};