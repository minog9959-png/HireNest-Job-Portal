import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, apiUpload } from '../services/api';
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
  const [resumeFile, setResumeFile] = useState(null);
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
      // File ke sath FormData bhejte hain, JSON nahi.
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('applicantName', applicantName);
      formData.append('applicantEmail', applicantEmail);
      formData.append('experience', experience);
      formData.append('phone', phone);
      formData.append('coverLetter', coverLetter);
      if (resumeFile) formData.append('resume', resumeFile);
      await apiUpload('/applications', formData);
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
          <label>Upload your CV (PDF only, max 5MB)</label>
          <input type="file" accept=".pdf,application/pdf" onChange={(e) => setResumeFile(e.target.files[0] || null)} />
          {resumeFile && <p className="hint">Selected: {resumeFile.name}</p>}
          <button>Apply</button>
          {alert && <Alert type={alert.type}>{alert.text}</Alert>}
        </form>
      )}
      {!user && <Alert type="info">Please log in first to apply.</Alert>}
    </div>
  );
}
