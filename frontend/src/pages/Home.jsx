import FeedbackForm from '../components/FeedbackForm.jsx';

export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Campus Voice home">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>campus<span className="brand-accent">voice</span></span>
        </a>
        <span className="topbar-note"><span className="status-dot" /> Student experience matters</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> YOUR VOICE, YOUR CAMPUS</span>
          <h1 id="page-title">Help us make<br />college <em>better.</em></h1>
          <p className="hero-description">Every perspective helps shape a more welcoming, inspiring place to learn. Tell us what’s working—and what could be even better.</p>
          <div className="hero-footnote"><span className="lock-icon" aria-hidden="true">◈</span> Your feedback is shared with care.</div>
        </div>

        <div className="form-card">
          <div className="form-card-heading">
            <div>
              <span className="section-kicker">STUDENT FEEDBACK</span>
              <h2>Tell us about your experience</h2>
              <p>It takes about 3 minutes. All fields are required.</p>
            </div>
            <span className="card-spark" aria-hidden="true">✳</span>
          </div>
          <FeedbackForm />
        </div>
      </section>

      <footer className="page-footer">
        <span>Made for a campus that keeps growing.</span>
        <span>© {new Date().getFullYear()} Campus Voice</span>
      </footer>
    </main>
  );
}
