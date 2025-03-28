import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
<<<<<<< HEAD
      <Link to="/" className="text-2xl font-bold">Task Manager</Link>
      <div>
        {user ? (
          <>
            <Link to="/tasks" className="mr-4">Tasks</Link>
=======
      <Link to="/" className="text-2xl font-bold">Your apps name</Link>
      <div>
        {user ? (
          <>
            <Link to="/tasks" className="mr-4">CRUD</Link>
>>>>>>> 6acaafe9b9fc5f71347a09db32b43a6f1f423e99
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
