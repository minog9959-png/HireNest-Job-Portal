import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyApplications from './pages/MyApplications';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import Applicants from './pages/Applicants';

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container">
      <nav className="navbar">
        <Link className="brand" to="/">
          <img src="/logo-icon.png" alt="HireNest logo" className="nav-logo-icon" />
          <span>HireNest</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          {user?.role === 'seeker' && <Link to="/my-applications">My Applications</Link>}
          {user?.role === 'employer' && <Link to="/my-jobs">My Jobs</Link>}
          {user?.role === 'employer' && <Link to="/post-job">Post Job</Link>}
          {!user && <><Link to="/login">Login</Link><Link to="/register">Register</Link></>}
          {user && (
            <>
              <span className="user-chip">{user.name} • {user.role === 'seeker' ? 'Seeker' : 'Employer'}</span>
              <button onClick={() => { logout(); navigate('/'); }}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-applications" element={<ProtectedRoute role="seeker"><MyApplications /></ProtectedRoute>} />
        <Route path="/my-jobs" element={<ProtectedRoute role="employer"><MyJobs /></ProtectedRoute>} />
        <Route path="/post-job" element={<ProtectedRoute role="employer"><PostJob /></ProtectedRoute>} />
        <Route path="/post-job/:id" element={<ProtectedRoute role="employer"><PostJob /></ProtectedRoute>} />
        <Route path="/applicants/:jobId" element={<ProtectedRoute role="employer"><Applicants /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}
