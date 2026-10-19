import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/my').then((res) => setReports(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page center-msg">Loading...</p>;

  return (
    <div className="page">
      <h2>My Reports</h2>
      {reports.length === 0 && <p>You haven't submitted any reports yet.</p>}
      <div className="scam-list">
        {reports.map((r) => (
          <div key={r.id} className="scam-card">
            <h3>{r.caseId}</h3>
            <p className="scam-type">{r.scamType.replace('_', ' ')}</p>
            <p>{r.description}</p>
            <p><span className={`status-badge status-${r.status}`}>{r.status.replace('_', ' ')}</span></p>
            <p className="report-count">Submitted {new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReports;