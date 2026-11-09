import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import Alert from '../components/Alert';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      await api(`/auth/reset-password/${token}`, 'POST', { password });
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={submit}>
        <h1>Reset Password</h1>
        {done ? (
          <>
            <Alert type="success">Password has been reset. Please log in with your new password.</Alert>
            <p className="form-link"><Link to="/login">Go to Login</Link></p>
          </>
        ) : (
          <>
            <input type="password" required placeholder="New password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" required placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <button>Reset Password</button>
            {error && <Alert type="error">{error}</Alert>}
            <p className="form-link"><Link to="/login">Back to Login</Link></p>
          </>
        )}
      </form>
    </div>
  );
}
