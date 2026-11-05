import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

// Search + filter: teeno inputs sirf URL query banate hain, backend filter karta hai
export default function Jobs() {
  const [jobs, setJobs] = useState([]);
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
          <h3>{job.title}</h3>
          <p>{job.company} — {job.location} — {job.type}</p>
          <p>{job.salary || ''}</p>
          <Link to={`/jobs/${job._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}
