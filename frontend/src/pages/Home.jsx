import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="hero">
      <div className="hero-brand">
        <img src="/logo-icon.png" alt="HireNest logo" className="hero-logo-icon" />
        <div>
          <h1>HireNest</h1>
          <p className="hero-tagline">Find Your Next Job</p>
        </div>
      </div>
      <p>Job seekers can find jobs and apply. Employers can post jobs and view applicants.</p>
      <Link to="/jobs"><button>View Jobs</button></Link>
    </div>
  );
}
