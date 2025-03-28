const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getAllJobs,
  getRecruiterJobs,
  addJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');

// Routes for jobs
router.get('/', getAllJobs);  // Get all jobs (for applicants) - no protection needed
router.get('/my-jobs', protect, getRecruiterJobs);  // Get only the recruiter's jobs
router.post('/', protect, addJob);  // Create job
router.put('/:id', protect, updateJob);  // Update job
router.delete('/:id', protect, deleteJob);  // Delete job

module.exports = router;  // Proper export format with no space