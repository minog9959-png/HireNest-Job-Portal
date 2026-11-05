import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Login na ho to login page par bhej do.
// role diya ho (seeker/employer) to sirf wohi role ye page khole.
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <p>You do not have permission to view this page.</p>;
  return children;
}
