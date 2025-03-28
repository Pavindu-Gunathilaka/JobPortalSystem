import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobForm from "./components/JobForm";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import Apply from "./pages/Apply";
import ManageApplications from './pages/ManageApplications';
import { useAuth } from "./context/AuthContext";


const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        
        {/* Protected route: Profile */}
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

        {/* Applicant-only routes */}
        <Route path="/jobs" element={user?.role === "applicant" ? <Home /> : <Navigate to="/" />} />
        <Route
          path="/apply/:jobId"
          element={
            user?.role === "applicant" ? (
              <Apply />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/my-applications" element={user?.role === "applicant" ? <MyApplications /> : <Navigate to="/" />} />

        {/* Recruiter-only routes */}
        <Route path="/add-job" element={user?.role === "recruiter" ? <JobForm /> : <Navigate to="/" />} />
        <Route path="/manage-applications" element={user?.role === "recruiter" ? <ManageApplications /> : <Navigate to="/" />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;