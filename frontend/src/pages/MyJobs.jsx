import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  function load() {
    api('/jobs/mine/list').then(setJobs);
  }
  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    await api(`/jobs/${id}`, 'DELETE');
    load();
  }

  return (
    <div>
      <h1>My Jobs</h1>
      <Link to="/post-job"><button>Post a New Job</button></Link>
      {jobs.map((job) => (
        <div key={job._id} className="card">
          <h3>{job.title}</h3>
          <p>{job.location} — {job.type}</p>
          <Link to={`/post-job/${job._id}`}>Edit</Link>{' '}
          <button onClick={() => remove(job._id)}>Delete</button>{' '}
          <Link to={`/applicants/${job._id}`}>View Applicants</Link>
        </div>
      ))}
    </div>
  );
}
