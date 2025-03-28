import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const JobForm = ({ jobs, setJobs, editingJob, setEditingJob }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title || '',
        description: editingJob.description || '',
        location: editingJob.location || '',
        salary: editingJob.salary || '',
        deadline: editingJob.deadline ? editingJob.deadline.split('T')[0] : '',
      });
    } else {
      setFormData({ title: '', description: '', location: '', salary: '', deadline: '' });
    }
  }, [editingJob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingJob) {
        console.log('Updating job:', editingJob._id);
        const response = await axiosInstance.put(`/api/jobs/${editingJob._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('Update response:', response.data);
        
        // Update jobs state with new data
        if (setJobs) {
          setJobs(prevJobs => prevJobs.map(job => 
            job._id === response.data._id ? response.data : job
          ));
        }
        
        // Reset form and editing state
        if (setEditingJob) {
          setEditingJob(null);
        }
      } else {
        console.log('Creating new job with data:', formData);
        const response = await axiosInstance.post('/api/jobs', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('Create response:', response.data);
        
        // Add new job to state if setJobs is provided
        if (setJobs) {
          setJobs(prevJobs => {
            // Make sure prevJobs is an array
            const jobsArray = Array.isArray(prevJobs) ? prevJobs : [];
            return [...jobsArray, response.data];
          });
        }
      }
      
      // Reset form
      setFormData({ title: '', description: '', location: '', salary: '', deadline: '' });
      
      // Use React Router's navigate instead of window.location
      navigate('/');
      
    } catch (error) {
      console.error('Job save error:', error);
      setError(error.response?.data?.message || 'Failed to save job post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingJob ? 'Edit Job Post' : 'Create Job Post'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <input
        type="text"
        placeholder="Job Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <textarea
        placeholder="Job Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Salary"
        value={formData.salary}
        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? 'Saving...' : (editingJob ? 'Update Job Post' : 'Create Job Post')}
      </button>
    </form>
  );
};

export default JobForm;