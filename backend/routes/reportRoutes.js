const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const {
  createReport, trackByCaseId, getMyReports, getAllReports,
  getReportById, updateReportStatus, addNote, getStats,
} = require('../controllers/reportController');

router.post('/', optionalAuth, upload.array('evidence', 5), createReport);
router.get('/track/:caseId', trackByCaseId);
router.get('/my', protect, getMyReports);
router.get('/stats', protect, authorize('admin', 'investigator'), getStats);
router.get('/', protect, authorize('admin', 'investigator'), getAllReports);
router.get('/:id', protect, authorize('admin', 'investigator'), getReportById);
router.put('/:id/status', protect, authorize('admin', 'investigator'), updateReportStatus);
router.post('/:id/notes', protect, authorize('admin', 'investigator'), addNote);

module.exports = router;