const Job = require('../models/Job');
const Application = require('../models/Application')

/**
 * Get all jobs
 * @route GET /api/jobs
 * @access Private (For all authenticated users)
 */
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get jobs created by the current recruiter
 * @route GET /api/jobs/my-jobs
 * @access Private (Recruiters only)
 */
const getRecruiterJobs = async (req, res) => {
  try {
    // Check if user is a recruiter
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Not authorized. Recruiters only.' });
    }

    // Find all jobs created by this recruiter
    const jobs = await Job.find({ userId: req.user.id });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add a new job
 * @route POST /api/jobs
 * @access Private (Recruiters only)
 */
const addJob = async (req, res) => {
  try {
    // Check if user is a recruiter
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Not authorized. Recruiters only.' });
    }

    const { title, description, location, salary, deadline } = req.body;
    
    // Create new job
    const job = await Job.create({
      title,
      description,
      location,
      salary,
      deadline,
      userId: req.user.id, // Associate job with the recruiter who created it
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a job
 * @route PUT /api/jobs/:id
 * @access Private (Job creator only)
 */
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the creator of this job
    if (job.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const { title, description, location, salary, deadline } = req.body;
    
    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { title, description, location, salary, deadline },
      { new: true } // Return the updated document
    );

    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a job
 * @route DELETE /api/jobs/:id
 * @access Private (Job creator only)
 */
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the creator of this job
    if (job.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    // First delete all applications associated with this job
    await Application.deleteMany({ job: req.params.id });

    // Delete job
    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job removed' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllJobs,
  getRecruiterJobs,
  addJob,
  updateJob,
  deleteJob,
};