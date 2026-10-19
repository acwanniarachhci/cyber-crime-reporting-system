import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

const AdminReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await api.get(`/reports/${id}`);
    setReport(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateField = async (field, value) => {
    setSaving(true);
    await api.put(`/reports/${id}/status`, { [field]: value });
    await load();
    setSaving(false);
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    await api.post(`/reports/${id}/notes`, { note });
    setNote('');
    load();
  };

  if (!report) return <p className="page center-msg">Loading...</p>;

  return (
    <div className="page">
      <h2>Case {report.caseId}</h2>

      <div className="report-detail-card">
        <p><strong>Type:</strong> {report.scamType.replace('_', ' ')}</p>
        <p><strong>Description:</strong> {report.description}</p>
        <p><strong>Reporter:</strong> {report.isAnonymous ? 'Anonymous' : report.reporter?.name || 'N/A'}</p>
        {report.contactEmail && <p><strong>Contact Email:</strong> {report.contactEmail}</p>}
        {report.contactPhone && <p><strong>Contact Phone:</strong> {report.contactPhone}</p>}
        {report.scammerPhone && <p><strong>Scammer Phone:</strong> {report.scammerPhone}</p>}
        {report.scammerAccount && <p><strong>Scammer Account:</strong> {report.scammerAccount}</p>}
        {report.scammerWebsite && <p><strong>Scammer Website:</strong> {report.scammerWebsite}</p>}
        {report.platform && <p><strong>Platform:</strong> {report.platform}</p>}
        {report.amountLost > 0 && <p><strong>Amount Lost:</strong> {report.amountLost} {report.currency}</p>}

        {report.evidenceFiles?.length > 0 && (
          <div>
            <strong>Evidence:</strong>
            <ul>
              {report.evidenceFiles.map((f, i) => (
                <li key={i}>
                  <a href={`${API_ORIGIN}${f.filePath}`} target="_blank" rel="noreferrer">{f.fileName}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="form">
        <label>Status</label>
        <select value={report.status} disabled={saving} onChange={(e) => updateField('status', e.target.value)}>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="investigating">Investigating</option>
          <option value="verified">Verified</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        <label>Priority</label>
        <select value={report.priority} disabled={saving} onChange={(e) => updateField('priority', e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <h3>Investigation Notes</h3>
      <ul className="notes-list">
        {report.AdminNotes?.map((n, i) => (
          <li key={i}>
            <strong>{n.addedBy?.name || 'Admin'}</strong> ({new Date(n.createdAt).toLocaleString()}): {n.note}
          </li>
        ))}
      </ul>
      <form className="form inline-form" onSubmit={addNote}>
        <input
          placeholder="Add an investigation note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Add Note</button>
      </form>
    </div>
  );
};

export default AdminReportDetail;