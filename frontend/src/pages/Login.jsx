import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Cold start: backend sota hai, pehli login request fail ho sakti hai.
  // Is liye fail ho to "Server is waking up" dikha kar khud ek dafa dobara try karte hain.
  const [busy, setBusy] = useState(false);
  const [waking, setWaking] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    setWaking(false);
    try {
      const user = await login(email, password);
      navigate(user.role === 'employer' ? '/my-jobs' : '/jobs');
    } catch (err) {
      // Sirf network fail / server waking up par dobara try karo, galat password par nahi
      const msg = err.message || '';
      const isWakeUp = msg.includes('Failed to fetch') || msg.includes('Network') || msg.includes('waking up');
      if (isWakeUp) {
        setWaking(true);
        await new Promise((r) => setTimeout(r, 4000));
        try {
          const user = await login(email, password);
          navigate(user.role === 'employer' ? '/my-jobs' : '/jobs');
          return;
        } catch (err2) {
          setError('Server is waking up, please try again in a few seconds.');
        }
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
      setWaking(false);
    }
  }

  return (
    <div className="auth-page">
    <form onSubmit={submit}>
      <h1>Login</h1>
      <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button disabled={busy}>{busy ? 'Please wait...' : 'Login'}</button>
      <p className="form-link"><Link to="/forgot-password">Forgot password?</Link></p>
      {waking && <Alert type="info">Server is waking up, please wait...</Alert>}
      {error && <Alert type="error">{error}</Alert>}
    </form>
    </div>
  );
}
