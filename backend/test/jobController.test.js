const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { 
  getAllJobs, 
  getRecruiterJobs, 
  addJob, 
  updateJob, 
  deleteJob 
} = require('../controllers/jobController');

const { expect } = chai;
chai.use(chaiHttp);

describe('Job Controller Tests', () => {
  afterEach(() => {
    // Restore all sinon stubs after each test
    sinon.restore();
  });
  // Common setup for most tests
  const mockUserId = new mongoose.Types.ObjectId();
  const mockJobId = new mongoose.Types.ObjectId();

  describe('Get All Jobs', () => {
    it('should fetch all jobs successfully', async () => {
      // Mock jobs data
      const mockJobs = [
        { 
          _id: new mongoose.Types.ObjectId(), 
          title: 'Software Engineer', 
          location: 'San Francisco' 
        },
        { 
          _id: new mongoose.Types.ObjectId(), 
          title: 'Product Manager', 
          location: 'New York' 
        }
      ];

      // Stub Job.find method
      const findStub = sinon.stub(Job, 'find').resolves(mockJobs);

      // Mock request and response
      const req = {};
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await getAllJobs(req, res);

      // Assertions
      expect(findStub.calledOnceWith({})).to.be.true;
      expect(res.json.calledWith(mockJobs)).to.be.true;

      // Restore the stub
      findStub.restore();
    });

    it('should handle errors when fetching jobs', async () => {
      // Stub Job.find to throw an error
      const findStub = sinon.stub(Job, 'find').throws(new Error('Database error'));

      // Mock request and response
      const req = {};
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await getAllJobs(req, res);

      // Assertions
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;

      // Restore the stub
      findStub.restore();
    });
  });

  describe('Get Recruiter Jobs', () => {
    it('should fetch jobs for a recruiter', async () => {
      // Mock jobs data
      const mockJobs = [
        { 
          _id: new mongoose.Types.ObjectId(), 
          title: 'Software Engineer', 
          userId: mockUserId 
        }
      ];

      // Stub Job.find method
      const findStub = sinon.stub(Job, 'find').resolves(mockJobs);

      // Mock request and response
      const req = {
        user: { 
          id: mockUserId, 
          role: 'recruiter' 
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await getRecruiterJobs(req, res);

      // Assertions
      expect(findStub.calledOnceWith({ userId: mockUserId })).to.be.true;
      expect(res.json.calledWith(mockJobs)).to.be.true;

      // Restore the stub
      findStub.restore();
    });

    it('should deny access for non-recruiters', async () => {
      // Mock request and response
      const req = {
        user: { 
          id: mockUserId, 
          role: 'applicant' 
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await getRecruiterJobs(req, res);

      // Assertions
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Not authorized. Recruiters only.' })).to.be.true;
    });
  });

  describe('Add Job', () => {
    it('should create a job for a recruiter', async () => {
      // Mock job data
      const jobData = {
        title: 'Software Engineer',
        description: 'Exciting role',
        location: 'San Francisco',
        salary: 120000,
        deadline: new Date()
      };

      // Stub Job.create method
      const createStub = sinon.stub(Job, 'create').resolves({
        ...jobData,
        _id: mockJobId,
        userId: mockUserId
      });

      // Mock request and response
      const req = {
        user: { 
          id: mockUserId, 
          role: 'recruiter' 
        },
        body: jobData
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await addJob(req, res);

      // Assertions
      expect(createStub.calledOnceWith({
        ...jobData,
        userId: mockUserId
      })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.called).to.be.true;

      // Restore the stub
      createStub.restore();
    });

    it('should deny job creation for non-recruiters', async () => {
      // Mock request and response
      const req = {
        user: { 
          id: mockUserId, 
          role: 'applicant' 
        },
        body: {}
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await addJob(req, res);

      // Assertions
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Not authorized. Recruiters only.' })).to.be.true;
    });
  });

  describe('Update Job', () => {
    it('should update a job by its creator', async () => {
      // Mock existing job
      const existingJob = {
        _id: mockJobId,
        userId: mockUserId,
        title: 'Old Title',
        description: 'Old Description'
      };

      // Stub Job.findById method
      const findByIdStub = sinon.stub(Job, 'findById').resolves(existingJob);
      
      // Stub Job.findByIdAndUpdate method
      const updateStub = sinon.stub(Job, 'findByIdAndUpdate').resolves({
        ...existingJob,
        title: 'New Title',
        description: 'New Description'
      });

      // Mock request and response
      const req = {
        params: { id: mockJobId },
        user: { 
          id: mockUserId, 
          role: 'recruiter' 
        },
        body: {
          title: 'New Title',
          description: 'New Description'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await updateJob(req, res);

      // Assertions
      expect(findByIdStub.calledOnceWith(mockJobId)).to.be.true;
      expect(updateStub.calledOnce).to.be.true;
      expect(res.json.called).to.be.true;

      // Restore the stubs
      findByIdStub.restore();
      updateStub.restore();
    });

    it('should prevent job update by non-creators', async () => {
      // Mock existing job
      const existingJob = {
        _id: mockJobId,
        userId: new mongoose.Types.ObjectId() // Different user ID
      };

      // Stub Job.findById method
      const findByIdStub = sinon.stub(Job, 'findById').resolves(existingJob);

      // Mock request and response
      const req = {
        params: { id: mockJobId },
        user: { 
          id: mockUserId, 
          role: 'recruiter' 
        },
        body: {}
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await updateJob(req, res);

      // Assertions
      expect(findByIdStub.calledOnceWith(mockJobId)).to.be.true;
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Not authorized to update this job' })).to.be.true;

      // Restore the stub
      findByIdStub.restore();
    });
  });

  describe('Delete Job', () => {
    it('should delete a job by its creator', async () => {
      // Mock existing job
      const existingJob = {
        _id: mockJobId,
        userId: mockUserId
      };

      // Stub Job.findById method
      const findByIdStub = sinon.stub(Job, 'findById').resolves(existingJob);
      
      // Stub Application.deleteMany method
      const deleteApplicationsStub = sinon.stub(Application, 'deleteMany').resolves();
      
      // Stub Job.findByIdAndDelete method
      const deleteJobStub = sinon.stub(Job, 'findByIdAndDelete').resolves(existingJob);

      // Mock request and response
      const req = {
        params: { id: mockJobId },
        user: { 
          id: mockUserId, 
          role: 'recruiter' 
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await deleteJob(req, res);

      // Assertions
      expect(findByIdStub.calledOnceWith(mockJobId)).to.be.true;
      expect(deleteApplicationsStub.calledOnceWith({ job: mockJobId })).to.be.true;
      expect(deleteJobStub.calledOnceWith(mockJobId)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Job removed' })).to.be.true;

      // Restore the stubs
      findByIdStub.restore();
      deleteApplicationsStub.restore();
      deleteJobStub.restore();
    });

    it('should prevent job deletion by non-creators', async () => {
      // Mock existing job
      const existingJob = {
        _id: mockJobId,
        userId: new mongoose.Types.ObjectId() // Different user ID
      };

      // Stub Job.findById method
      const findByIdStub = sinon.stub(Job, 'findById').resolves(existingJob);

      // Mock request and response
      const req = {
        params: { id: mockJobId },
        user: { 
          id: mockUserId, 
          role: 'recruiter' 
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await deleteJob(req, res);

      // Assertions
      expect(findByIdStub.calledOnceWith(mockJobId)).to.be.true;
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Not authorized to delete this job' })).to.be.true;

      // Restore the stub
      findByIdStub.restore();
    });
  });
});