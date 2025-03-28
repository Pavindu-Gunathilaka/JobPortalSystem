const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');

// Submit an application
router.post('/', protect, applyForJob);

// Get user's applications
router.get('/my-applications', protect, getMyApplications);

// Get applications for jobs posted by the recruiter
router.get('/recruiter-applications', protect, getRecruiterApplications);

// Update application status (shortlist, accept, reject)
router.put('/:id/status', protect, updateApplicationStatus);

module.exports = router;