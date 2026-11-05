import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function Applicants() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  function load() {
    api(`/applications/job/${jobId}`).then(setApps);
  }
  useEffect(() => { load(); }, [jobId]);

  async function setStatus(id, status) {
    await api(`/applications/${id}/status`, 'PUT', { status });
    load();
  }

  return (
    <div>
      <h1>Applicants</h1>
      {apps.length === 0 && <p>No applicants yet.</p>}
      {apps.map((a) => (
        <div key={a._id} className="card">
          <h3>{a.applicantName || a.applicant?.name}</h3>
          <p>{a.applicantEmail || a.applicant?.email}</p>
          <p>Phone: {a.phone || '-'}</p>
          <p>Experience: {a.experience || '-'}</p>
          <p>Skills: {a.applicant?.skills || '-'}</p>
          {a.coverLetter && <p><b>Cover letter:</b> {a.coverLetter}</p>}
          {a.resumeLink && <p><a href={a.resumeLink} target="_blank" rel="noreferrer">Open CV</a></p>}
          <p>Status: <b>{a.status}</b></p>
          <button onClick={() => setStatus(a._id, 'shortlisted')}>Shortlist</button>{' '}
          <button onClick={() => setStatus(a._id, 'rejected')}>Reject</button>{' '}
          <button onClick={() => setStatus(a._id, 'hired')}>Hire</button>
        </div>
      ))}
    </div>
  );
}
