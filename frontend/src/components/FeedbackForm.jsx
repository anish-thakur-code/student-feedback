import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitFeedback } from '../services/api.js';

const initialForm = {
  studentName: '',
  email: '',
  semester: '',
  department: '',
  satisfaction: '',
  academicExperience: '',
  campusLife: '',
  favoriteThing: '',
  improvements: '',
  overallRating: '',
};

const departments = ['CSE', 'IT', 'AI/ML', 'CE', 'ECE', 'Mechanical', 'Other'];
const satisfactionOptions = ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'];

export default function FeedbackForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status.message) setStatus({ type: '', message: '' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setSubmitting(true);
    try {
      const response = await submitFeedback({ ...form, semester: Number(form.semester), overallRating: Number(form.overallRating) });
      if (response.success) {
        navigate('/thanks', { replace: true });
      } else {
        setStatus({ type: 'error', message: response.message || 'Your feedback could not be submitted. Please try again.' });
      }
    } catch (error) {
      const message = error.response?.status === 409
        ? 'You have already submitted feedback using this email address.'
        : error.response?.data?.message || 'We couldn’t submit your feedback. Please check your connection and try again.';
      setStatus({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <div className="form-grid two-columns">
        <label className="field">
          <span>Student name <b>*</b></span>
          <input autoComplete="name" name="studentName" value={form.studentName} onChange={handleChange} placeholder="e.g. Anish Thakur" required maxLength="100" />
        </label>
        <label className="field">
          <span>Email address <b>*</b></span>
          <input autoComplete="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@college.edu" required maxLength="254" />
        </label>
      </div>

      <div className="form-grid two-columns compact-gap">
        <label className="field">
          <span>Current semester <b>*</b></span>
          <select name="semester" value={form.semester} onChange={handleChange} required>
            <option value="" disabled>Select semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => <option key={semester} value={semester}>Semester {semester}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Department <b>*</b></span>
          <select name="department" value={form.department} onChange={handleChange} required>
            <option value="" disabled>Select department</option>
            {departments.map((department) => <option key={department} value={department}>{department}</option>)}
          </select>
        </label>
      </div>

      <fieldset className="field satisfaction-field">
        <legend>How satisfied are you with college overall? <b>*</b></legend>
        <div className="satisfaction-options">
          {satisfactionOptions.map((option, index) => (
            <label className="radio-option" key={option}>
              <input type="radio" name="satisfaction" value={option} checked={form.satisfaction === option} onChange={handleChange} required={index === 0} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field textarea-field">
        <span>How would you describe your academic experience? <b>*</b></span>
        <textarea name="academicExperience" value={form.academicExperience} onChange={handleChange} placeholder="Think about classes, faculty, learning resources…" rows="3" required maxLength="2000" />
      </label>
      <label className="field textarea-field">
        <span>What’s campus life like for you? <b>*</b></span>
        <textarea name="campusLife" value={form.campusLife} onChange={handleChange} placeholder="Share a little about the community, activities, and spaces…" rows="3" required maxLength="2000" />
      </label>
      <label className="field textarea-field">
        <span>What do you like most about the college? <b>*</b></span>
        <textarea name="favoriteThing" value={form.favoriteThing} onChange={handleChange} placeholder="The people, a program, a moment—anything that stands out…" rows="3" required maxLength="2000" />
      </label>
      <label className="field textarea-field">
        <span>What should the college improve? <b>*</b></span>
        <textarea name="improvements" value={form.improvements} onChange={handleChange} placeholder="Your ideas can help make a real difference…" rows="3" required maxLength="2000" />
      </label>

      <fieldset className="field rating-field">
        <legend>Give your overall college experience a rating <b>*</b></legend>
        <div className="rating-row">
          <div className="rating-options" role="radiogroup" aria-label="Overall rating, 1 to 5">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label className={`rating-choice ${form.overallRating === String(rating) ? 'selected' : ''}`} key={rating}>
                <input type="radio" name="overallRating" value={rating} checked={form.overallRating === String(rating)} onChange={handleChange} required={rating === 1} />
                <span>{rating}</span>
              </label>
            ))}
          </div>
          <span className="rating-hint">1 = needs work <span aria-hidden="true">→</span> 5 = excellent</span>
        </div>
      </fieldset>

      {status.message && <div className={`form-message ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.type === 'success' && <span aria-hidden="true">✓ </span>}{status.message}</div>}

      <button className="submit-button" type="submit" disabled={submitting}>
        {submitting ? <><span className="button-spinner" /> Sending your feedback…</> : <>Submit my feedback <span aria-hidden="true">↗</span></>}
      </button>
      <p className="privacy-note"><span aria-hidden="true">✳</span> A little honesty goes a long way. Thanks for being part of it.</p>
    </form>
  );
}
