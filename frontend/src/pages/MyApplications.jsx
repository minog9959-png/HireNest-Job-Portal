import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

// My Applications me kuch edit nahi karna hota:
// Sirf apni applications aur un ka status dekhna hota hai.
// pending = employer ne abhi nahi dekha, shortlisted / rejected / hired = employer ka faisla.
export default function MyApplications() {
  const [apps, setApps] = useState([]);
  useEffect(() => {
    api('/applications/mine').then(setApps);
  }, []);
  return (
    <div>
      <h1>My Applications</h1>
      <p className="hint">This page is view-only. Check your status: pending, reviewed, shortlisted, rejected, or hired. Only the employer changes the status; you cannot edit it here.</p>
      {apps.length === 0 && (
        <div className="card">
          <p>You have no applications yet.</p>
          <Link to="/jobs">Apply from Jobs</Link>
        </div>
      )}
      {apps.map((a) => (
        <div key={a._id} className="card">
          <h3>{a.job?.title} <span className="applied-badge">✓ Applied</span></h3>
          <p>{a.job?.company} — {a.job?.location}</p>
          <p>{a.applicantName} — {a.applicantEmail}</p>
          <p>Phone: {a.phone || '-'}</p>
          <p>Experience: {a.experience || '-'}</p>
          {a.coverLetter && <p><b>Cover letter:</b> {a.coverLetter}</p>}
          {a.resumeLink && <p><a href={a.resumeLink} target="_blank" rel="noreferrer">Download CV</a></p>}
          <p>Status: <b>{a.status}</b></p>
        </div>
      ))}
    </div>
  );
}
