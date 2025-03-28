import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import JobForm from '../components/JobForm';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [error, setError] = useState('');

  // Function to fetch jobs
  useEffect(() => {
    if (!user) return;

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Different endpoint based on user role
      const endpoint = user.role === 'recruiter' ? '/api/jobs/my-jobs' : '/api/jobs';
      console.log(`Fetching jobs from ${endpoint} for ${user.role}`);
      
      const response = await axiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      
      console.log('Fetched jobs:', response.data);
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

    fetchJobs();
  }, [user]);

  // Function to handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await axiosInstance.delete(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // Remove the deleted job from state
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome to Job Portal</h1>
        <p className="text-lg text-gray-600">
          {user && user.role === 'applicant'
            ? 'Find your dream job and start your career journey today.'
            : 'Manage your job postings and find the perfect candidates for your positions.'}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {user && user.role === 'applicant' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Available Jobs</h2>
            <Link
              to="/my-applications"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              View My Applications
            </Link>
          </div>
          
          {loading ? (
            <p className="text-center py-4">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-gray-700">No jobs available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="text-sm text-gray-500 mb-4">
                      <p><span className="font-semibold">Location:</span> {job.location}</p>
                      <p><span className="font-semibold">Salary:</span> ${job.salary}</p>
                      <p>
                        <span className="font-semibold">Deadline:</span>{' '}
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to={`/apply/${job._id}`}
                      className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user && user.role === 'recruiter' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Job Postings</h2>
            <div className="flex space-x-4">
              <Link
                to="/add-job"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
              >
                Add New Job
              </Link>
              <Link
                to="/manage-applications"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Manage Applications
              </Link>
            </div>
          </div>
          
          {/* Show job form when editing */}
          {editingJob && (
            <JobForm 
              jobs={jobs} 
              setJobs={setJobs} 
              editingJob={editingJob} 
              setEditingJob={setEditingJob} 
            />
          )}
          
          {/* Display recruiter's jobs */}
          {loading ? (
            <p className="text-center py-4">Loading your job postings...</p>
          ) : jobs.length === 0 ? (
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-gray-700">You haven't posted any jobs yet.</p>
              <button 
                onClick={() => navigate('/add-job')}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
              >
                Create Your First Job Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="text-sm text-gray-500 mb-4">
                      <p><span className="font-semibold">Location:</span> {job.location}</p>
                      <p><span className="font-semibold">Salary:</span> ${job.salary}</p>
                      <p>
                        <span className="font-semibold">Deadline:</span>{' '}
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        onClick={() => setEditingJob(job)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;