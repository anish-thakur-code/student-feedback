import { Link } from 'react-router-dom';

export default function SubmissionSuccess() {
  return (
    <main className="page-shell confirmation-page">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Campus Voice home">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>campus<span className="brand-accent">voice</span></span>
        </Link>
        <span className="topbar-note"><span className="status-dot" /> Student experience matters</span>
      </header>

      <section className="confirmation-content" aria-labelledby="confirmation-title">
        <div className="confirmation-card">
          <div className="confirmation-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" />
              <path d="m14 24 7 7 14-15" />
            </svg>
          </div>
          <span className="section-kicker">FEEDBACK RECEIVED</span>
          <h1 id="confirmation-title">Thank you for<br /><em>speaking up.</em></h1>
          <p className="confirmation-lead">Your feedback has been submitted successfully.</p>
          <p className="confirmation-copy">A better college experience starts with listening. Your perspective matters, and it will help us understand what’s working and where we can do better.</p>
          <div className="confirmation-note"><span aria-hidden="true">✳</span><span><strong>Student experience matters.</strong><br />Together, we can make college better.</span></div>
          <Link className="submit-button confirmation-button" to="/">Return to home <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <footer className="page-footer">
        <span>Made for a campus that keeps growing.</span>
        <span>© {new Date().getFullYear()} Campus Voice</span>
      </footer>
    </main>
  );
}
