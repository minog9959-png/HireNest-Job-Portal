import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Search + filter: teeno inputs sirf URL query banate hain, backend filter karta hai
export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  async function load() {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (location) q.set('location', location);
    if (type) q.set('type', type);
    setJobs(await api(`/jobs?${q.toString()}`));
  }

  useEffect(() => {
    load();
    // Seeker ke liye apni applications bhi lao, taake applied jobs par green badge lage
    if (user?.role === 'seeker') {
      api('/applications/mine')
        .then((apps) => setAppliedIds(new Set(apps.map((a) => String(a.job?._id || a.job)))))
        .catch(() => setAppliedIds(new Set()));
    } else {
      setAppliedIds(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Jobs</h1>
      <div>
        <input placeholder="Search: React, MERN..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <input placeholder="Location: Lahore, Remote..." value={location} onChange={(e) => setLocation(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Remote</option>
          <option>Internship</option>
        </select>
        <button onClick={load}>Search</button>
      </div>
      {jobs.length === 0 && <p>No jobs found.</p>}
      {jobs.map((job) => (
        <div key={job._id} className="card">
          <h3>{job.title} {appliedIds.has(String(job._id)) && <span className="applied-badge">✓ Applied</span>}</h3>
          <p>{job.company} — {job.location} — {job.type}</p>
          <p>{job.salary || ''}</p>
          <Link to={`/jobs/${job._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}
