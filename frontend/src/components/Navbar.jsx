import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Debug user data
  useEffect(() => {
    console.log("User in Navbar:", user);
  }, [user]);
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold">Job Portal</Link>
      <div>
        {user ? (
          <>
            {/* Conditional Links based on user role */}
            {user.role === "applicant" && (
              <>
                <Link to="/" className="mr-4 hover:text-blue-200">Home</Link>
                <Link to="/my-applications" className="mr-4 hover:text-blue-200">Applications</Link>
                <Link to="/profile" className="mr-4 hover:text-blue-200">Profile</Link>
              </>
            )}
            
            {user.role === "recruiter" && (
              <>
                <Link to="/" className="mr-4 hover:text-blue-200">Home</Link>
                <Link to="/add-job" className="mr-4 hover:text-blue-200">Add Job</Link>
                <Link to="/manage-applications" className="mr-4 hover:text-blue-200">Manage Applications</Link>
                <Link to="/profile" className="mr-4 hover:text-blue-200">Profile</Link>
              </>
            )}
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* If not logged in, show login and register buttons */}
            <Link to="/login" className="mr-4 hover:text-blue-200">Login</Link>
            <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-700 transition duration-200">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;