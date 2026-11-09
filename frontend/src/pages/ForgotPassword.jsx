import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Alert from '../components/Alert';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const data = await api('/auth/forgot-password', 'POST', { email });
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={submit}>
        <h1>Forgot Password</h1>
        <p className="hint">Enter your registered email and we will show you a password reset link.</p>
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button>Send Reset Link</button>
        {error && <Alert type="error">{error}</Alert>}
        {result && (
          <>
            <Alert type="success">{result.message}</Alert>
            {result.resetUrl && (
              <p>
                <b>Reset link (demo):</b>{' '}
                <Link to={result.resetUrl.replace(window.location.origin, '')}>Reset your password</Link>
              </p>
            )}
            <p className="hint">Demo note: no email service is connected, so the link is shown here. In a real app this link is sent to your email.</p>
          </>
        )}
        <p className="form-link"><Link to="/login">Back to Login</Link></p>
      </form>
    </div>
  );
}
