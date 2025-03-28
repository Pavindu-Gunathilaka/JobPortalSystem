import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosInstance.get('/api/applications/my-applications', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setApplications(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  if (loading) {
    return <div className="text-center py-8">Loading your applications...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {!Array.isArray(applications) || applications.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-lg text-gray-600">You haven't applied to any jobs yet.</p>
          <a href="/jobs" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications
            .filter(application => application.job && typeof application.job === 'object')
            .map((application) => (
              <div key={application._id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {application.job?.title || "Job Title Not Available"}
                </h2>
                <p className="text-gray-500 mb-4">
                  Applied on: {new Date(application.createdAt).toLocaleDateString()}
                </p>

                <div className="mb-4">
                  <span className="font-medium">Status: </span>
                  <span className={`inline-block px-2 py-1 rounded text-sm ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>

                {application.coverLetter && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-2">Your Cover Letter:</h3>
                    <p className="text-gray-700">{application.coverLetter}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;