const Application = require('../models/Application');
const Job = require('../models/Job'); 
// Apply for a Job
const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    
    // Validate job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user already applied
    const existingApplication = await Application.findOne({
      applicant: req.user.id,
      job: jobId
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    
    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      status: 'pending'
    });
    
    res.status(201).json(application);
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update application status (Shortlist, Accept, Reject)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    application.status = status;
    await application.save();

    res.json({ message: `Application ${status} successfully.`, application });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get applications for the current user
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job')
      .sort({ createdAt: -1 });

    if (!applications.length) {
      return res.status(200).json({ message: "You haven't applied to any jobs yet." });
    }
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get applications for jobs posted by the recruiter
const getRecruiterApplications = async (req, res) => {
  try {
    // Get the recruiter's ID from the authenticated user
    const recruiterId = req.user.id;
    console.log("Recruiter ID:", recruiterId);
    
    // Find all jobs posted by this recruiter
    const recruiterJobs = await Job.find({ userId: recruiterId });
    console.log("Recruiter Jobs:", recruiterJobs);
    
    if (recruiterJobs.length === 0) {
      console.log("No jobs found for this recruiter");
      return res.json([]); // Return empty array, not 404
    }
    
    const jobIds = recruiterJobs.map(job => job._id);
    console.log("Job IDs:", jobIds);
    
    // Find all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'name email')
      .populate('job', 'title location');
    
    console.log("Found applications:", applications.length);
    
    // Return the applications as an array
    res.json(applications);
  } catch (error) {
    console.error("Error in getRecruiterApplications:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { applyForJob, updateApplicationStatus, getMyApplications, getRecruiterApplications };