import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker', company: '', skills: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    try {
      const user = await register(form);
      navigate(user.role === 'employer' ? '/my-jobs' : '/jobs');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
    <form onSubmit={submit}>
      <h1>Register</h1>
      <input required placeholder="Name" value={form.name} onChange={set('name')} />
      <input required type="email" placeholder="Email" value={form.email} onChange={set('email')} />
      <input required type="password" placeholder="Password (min 6)" value={form.password} onChange={set('password')} />
      <select value={form.role} onChange={set('role')}>
        <option value="seeker">Job Seeker</option>
        <option value="employer">Employer</option>
      </select>
      {/* Role ke hisab se sirf ek extra field dikhta hai — yehi simple hai */}
      {form.role === 'employer'
        ? <input placeholder="Company name" value={form.company} onChange={set('company')} />
        : <input placeholder="Skills: React, Node.js" value={form.skills} onChange={set('skills')} />}
      <button>Register</button>
      {error && <Alert type="error">{error}</Alert>}
    </form>
    </div>
  );
}
