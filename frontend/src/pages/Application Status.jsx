import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Make sure this path is correct

const ApplicationStatus = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/applications/my-applications', {
          headers: { 
            Authorization: `Bearer ${user.token}` 
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        
        const data = await response.json();
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError("Failed to load your applications");
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">My Applications</h2>
      
      {loading ? (
        <p>Loading your applications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {applications.length === 0 ? (
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700">You haven't applied to any jobs yet.</p>
            </div>
          ) : (
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Job Title</th>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Applied On</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-t">
                    <td className="px-4 py-2">{app.job.title}</td>
                    <td className="px-4 py-2">{app.job.company}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        app.status === "rejected" ? "bg-red-100 text-red-800" :
                        app.status === "accepted" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationStatus;