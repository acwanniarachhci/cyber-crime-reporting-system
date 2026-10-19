import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SCAM_TYPES = [
  { value: 'phishing', label: 'Phishing' },
  { value: 'fake_account', label: 'Fake Account' },
  { value: 'payment_scam', label: 'Payment Scam' },
  { value: 'online_shopping_scam', label: 'Online Shopping Scam' },
  { value: 'investment_scam', label: 'Investment Scam' },
  { value: 'job_scam', label: 'Job Scam' },
  { value: 'romance_scam', label: 'Romance Scam' },
  { value: 'sim_swap', label: 'SIM Swap' },
  { value: 'malware', label: 'Malware' },
  { value: 'other', label: 'Other' },
];

const ReportScam = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    scamType: '', description: '', scammerPhone: '', scammerAccount: '',
    scammerName: '', scammerWebsite: '', platform: '', amountLost: '',
    contactEmail: '', contactPhone: '',
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFiles = (e) => setFiles([...e.target.files].slice(0, 5));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      files.forEach((file) => formData.append('evidence', file));

      const { data } = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while submitting your report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="page">
        <div className="success-box">
          <h2>✅ Report Submitted</h2>
          <p>{result.message}</p>
          <p className="case-id">Your Case ID: <strong>{result.caseId}</strong></p>
          <p>Save this ID — you'll need it to track your case's progress.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Report a Scam</h2>
      {!user && (
        <p className="hint">
          You're reporting anonymously. Want updates by account instead? <a href="/register">Register</a> or{' '}
          <a href="/login">Login</a> first.
        </p>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <label>Scam Type *</label>
        <select name="scamType" value={form.scamType} onChange={handleChange} required>
          <option value="">Select a type</option>
          {SCAM_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <label>Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          required
          placeholder="Describe what happened, in as much detail as possible"
        />

        <div className="form-row">
          <div>
            <label>Scammer Phone Number</label>
            <input name="scammerPhone" value={form.scammerPhone} onChange={handleChange} />
          </div>
          <div>
            <label>Scammer Account / Username</label>
            <input name="scammerAccount" value={form.scammerAccount} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Scammer Website / Link</label>
            <input name="scammerWebsite" value={form.scammerWebsite} onChange={handleChange} />
          </div>
          <div>
            <label>Platform (Facebook, WhatsApp, SMS, etc.)</label>
            <input name="platform" value={form.platform} onChange={handleChange} />
          </div>
        </div>

        <label>Amount Lost (LKR, if any)</label>
        <input type="number" min="0" name="amountLost" value={form.amountLost} onChange={handleChange} />

        {!user && (
          <>
            <p className="hint">Optional: leave contact info if you'd like to be reachable about this case.</p>
            <div className="form-row">
              <div>
                <label>Contact Email</label>
                <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} />
              </div>
              <div>
                <label>Contact Phone</label>
                <input name="contactPhone" value={form.contactPhone} onChange={handleChange} />
              </div>
            </div>
          </>
        )}

        <label>Evidence (screenshots / PDF, up to 5 files, 10MB each)</label>
        <input type="file" multiple accept="image/*,.pdf" onChange={handleFiles} />

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportScam;