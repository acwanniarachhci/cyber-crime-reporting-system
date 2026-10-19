const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  searchScamDatabase, getScamEntry, createScamEntry, updateScamEntry, deleteScamEntry,
} = require('../controllers/scamDatabaseController');

router.get('/', searchScamDatabase);
router.get('/:id', getScamEntry);
router.post('/', protect, authorize('admin', 'investigator'), createScamEntry);
router.put('/:id', protect, authorize('admin', 'investigator'), updateScamEntry);
router.delete('/:id', protect, authorize('admin'), deleteScamEntry);

module.exports = router;