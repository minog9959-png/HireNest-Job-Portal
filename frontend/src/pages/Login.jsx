import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const user = await login(email, password);
      navigate(user.role === 'employer' ? '/my-jobs' : '/jobs');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={submit}>
      <h1>Login</h1>
      <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button>Login</button>
      {error && <Alert type="error">{error}</Alert>}
      <p className="hint">Demo: seeker@demo.local / 123456 or employer@demo.local / 123456 (after seeding)</p>
    </form>
  );
}
