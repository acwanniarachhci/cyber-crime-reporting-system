const { Op } = require('sequelize');
const ScamDatabase = require('../models/ScamDatabase');

exports.searchScamDatabase = async (req, res) => {
  try {
    const { q, scamType } = req.query;
    const where = { isPublished: true };

    if (scamType) where.scamType = scamType;

    if (q) {
      where[Op.or] = [
        { scammerPhone: { [Op.iLike]: `%${q}%` } },
        { scammerAccount: { [Op.iLike]: `%${q}%` } },
        { scammerWebsite: { [Op.iLike]: `%${q}%` } },
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const results = await ScamDatabase.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 100,
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error while searching scam database', error: error.message });
  }
};

exports.getScamEntry = async (req, res) => {
  try {
    const entry = await ScamDatabase.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createScamEntry = async (req, res) => {
  try {
    const { title, scamType, description, scammerPhone, scammerAccount, scammerWebsite, platform } = req.body;

    if (!title || !scamType || !description) {
      return res.status(400).json({ message: 'Title, scam type and description are required' });
    }

    const entry = await ScamDatabase.create({
      title, scamType, description, scammerPhone, scammerAccount, scammerWebsite, platform,
      verifiedById: req.user.id,
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating entry', error: error.message });
  }
};

exports.updateScamEntry = async (req, res) => {
  try {
    const entry = await ScamDatabase.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    await entry.update(req.body);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating entry', error: error.message });
  }
};

exports.deleteScamEntry = async (req, res) => {
  try {
    const entry = await ScamDatabase.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    await entry.destroy();
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting entry', error: error.message });
  }
};