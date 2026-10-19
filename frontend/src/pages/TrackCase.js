import React, { useState } from 'react';
import api from '../api/axios';

const statusLabels = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  investigating: 'Investigating',
  verified: 'Verified',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

const TrackCase = () => {
  const [caseId, setCaseId] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setReport(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/reports/track/${caseId.trim()}`);
      setReport(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not find that case.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Track Your Case</h2>
      <form className="form inline-form" onSubmit={handleSearch}>
        <input
          placeholder="Enter your Case ID (e.g. SC-8F3K9A)"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      {report && (
        <div className="report-detail-card">
          <h3>Case: {report.caseId}</h3>
          <p><strong>Status:</strong> <span className={`status-badge status-${report.status}`}>{statusLabels[report.status]}</span></p>
          <p><strong>Scam Type:</strong> {report.scamType.replace('_', ' ')}</p>
          <p><strong>Submitted:</strong> {new Date(report.createdAt).toLocaleString()}</p>
          <p><strong>Description:</strong> {report.description}</p>
        </div>
      )}
    </div>
  );
};

export default TrackCase;