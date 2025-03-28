import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const ManageApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosInstance.get('/api/applications/recruiter-applications', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setApplications(response.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const handleStatusChange = async (id, status) => {
    try {
      await axiosInstance.put(`/api/applications/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setApplications(applications.map(app => app._id === id ? { ...app, status } : app));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading applications...</div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Applications</h1>
      {applications.length === 0 ? (
        <p>No applications found for your job posts.</p>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{app.job.title}</h2>
              <p className="text-gray-600">Applicant: {app.applicant.name} ({app.applicant.email})</p>
              <p className="text-gray-600">Status: <span className="font-bold">{app.status}</span></p>
              <p className="text-gray-600">Cover Letter: {app.coverLetter}</p>
              <div className="mt-4">
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleStatusChange(app._id, 'accepted')}
                >Accept</button>
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleStatusChange(app._id, 'rejected')}
                >Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageApplications;