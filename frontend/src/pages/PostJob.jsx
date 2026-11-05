import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import Alert from '../components/Alert';

// Ek hi form: id ho to Edit, na ho to nayi job Post
export default function PostJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time',
    salary: '', description: '', requirements: '',
  });
  const [error, setError] = useState('');
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  useEffect(() => {
    if (id) api(`/jobs/${id}`).then((j) => setForm({
      title: j.title, company: j.company, location: j.location, type: j.type,
      salary: j.salary || '', description: j.description, requirements: j.requirements || '',
    }));
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    try {
      if (id) await api(`/jobs/${id}`, 'PUT', form);
      else await api('/jobs', 'POST', form);
      navigate('/my-jobs');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={submit}>
      <h1>{id ? 'Edit Job' : 'Post a New Job'}</h1>
      <input required placeholder="Job title" value={form.title} onChange={set('title')} />
      <input required placeholder="Company" value={form.company} onChange={set('company')} />
      <input required placeholder="Location" value={form.location} onChange={set('location')} />
      <select value={form.type} onChange={set('type')}>
        <option>Full-time</option><option>Part-time</option><option>Remote</option><option>Internship</option>
      </select>
      <input placeholder="Salary" value={form.salary} onChange={set('salary')} />
      <textarea required placeholder="Job description" value={form.description} onChange={set('description')} />
      <input placeholder="Requirements: React, JavaScript" value={form.requirements} onChange={set('requirements')} />
      <button>{id ? 'Save Changes' : 'Post Job'}</button>
      {error && <Alert type="error">{error}</Alert>}
    </form>
  );
}
