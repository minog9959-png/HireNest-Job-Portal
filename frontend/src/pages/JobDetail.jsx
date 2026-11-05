import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  // Name aur email login se pehle se bhar diye hain, seeker chahe to badal sakta hai.
  // Experience aur phone har job ke liye apply form me hi liye jate hain.
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    api(`/jobs/${id}`).then(setJob);
  }, [id]);

  useEffect(() => {
    if (user) {
      setApplicantName(user.name || '');
      setApplicantEmail(user.email || '');
    }
  }, [user]);

  async function apply(e) {
    e.preventDefault();
    setAlert(null);
    try {
      await api('/applications', 'POST', {
        jobId: id,
        applicantName,
        applicantEmail,
        experience,
        phone,
        coverLetter,
        resumeLink,
      });
      setAlert({ type: 'success', text: 'Application submitted successfully! You can check your status in My Applications.' });
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    }
  }

  if (!job) return <p>Loading...</p>;
  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.company} — {job.location} — {job.type}</p>
      <p>{job.salary || ''}</p>
      <p>{job.description}</p>
      <p><b>Requirements:</b> {job.requirements}</p>

      {/* Sirf seeker ko Apply form dikhega, employer ko nahi */}
      {user?.role === 'seeker' && (
        <form onSubmit={apply}>
          <h3>Apply Now</h3>
          <input required placeholder="Full name" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} />
          <input required type="email" placeholder="Email" value={applicantEmail} onChange={(e) => setApplicantEmail(e.target.value)} />
          <input required placeholder="Experience (e.g. 2 years, Fresher)" value={experience} onChange={(e) => setExperience(e.target.value)} />
          <input required type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <textarea placeholder="Cover letter (optional)" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
          <input placeholder="CV link (Google Drive link, optional)" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} />
          <p className="hint">No CV file upload here. Upload your CV to Google Drive, set Share to Anyone with the link, and paste that link here. The employer will open the same link to view your CV.</p>
          <button>Apply</button>
          {alert && <Alert type={alert.type}>{alert.text}</Alert>}
        </form>
      )}
      {!user && <Alert type="info">Please log in first to apply.</Alert>}
    </div>
  );
}
