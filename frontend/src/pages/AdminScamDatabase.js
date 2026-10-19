import React, { useState, useEffect } from 'react';
import api from '../api/axios';

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

const AdminScamDatabase = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', scamType: '', description: '',
    scammerPhone: '', scammerAccount: '', scammerWebsite: '', platform: '',
  });

  const loadEntries = async () => {
    setLoading(true);
    const { data } = await api.get('/scam-database');
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/scam-database', form);
      setForm({
        title: '', scamType: '', description: '',
        scammerPhone: '', scammerAccount: '', scammerWebsite: '', platform: '',
      });
      setShowForm(false);
      loadEntries();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this verified scam entry?')) return;
    await api.delete(`/scam-database/${id}`);
    loadEntries();
  };

  return (
    <div className="page">
      <h2>🗂️ Manage Verified Scam Database</h2>
      <p>Publish verified scam entries that the public can search.</p>

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Add New Verified Entry'}
      </button>

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <label>Title *</label>
          <input name="title" required value={form.title} onChange={handleChange}
            placeholder="e.g. Fake 'Dialog Prize Winner' SMS Scam" />

          <label>Scam Type *</label>
          <select name="scamType" value={form.scamType} onChange={handleChange} required>
            <option value="">Select a type</option>
            {SCAM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          <label>Description *</label>
          <textarea name="description" required rows={4} value={form.description} onChange={handleChange}
            placeholder="Describe the scam pattern so the public can recognize it" />

          <div className="form-row">
            <div>
              <label>Scammer Phone</label>
              <input name="scammerPhone" value={form.scammerPhone} onChange={handleChange} />
            </div>
            <div>
              <label>Scammer Account</label>
              <input name="scammerAccount" value={form.scammerAccount} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Scammer Website</label>
              <input name="scammerWebsite" value={form.scammerWebsite} onChange={handleChange} />
            </div>
            <div>
              <label>Platform</label>
              <input name="platform" value={form.platform} onChange={handleChange} />
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Entry'}
          </button>
        </form>
      )}

      <h3 style={{ marginTop: 32 }}>Published Entries</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="scam-list">
          {entries.length === 0 && <p>No entries published yet.</p>}
          {entries.map((entry) => (
            <div key={entry.id} className="scam-card">
              <h3>{entry.title}</h3>
              <p className="scam-type">{entry.scamType.replace('_', ' ')}</p>
              <p>{entry.description}</p>
              <div className="scam-meta">
                {entry.scammerPhone && <span>📞 {entry.scammerPhone}</span>}
                {entry.scammerAccount && <span>👤 {entry.scammerAccount}</span>}
                {entry.scammerWebsite && <span>🌐 {entry.scammerWebsite}</span>}
              </div>
              <button className="btn btn-secondary" onClick={() => handleDelete(entry.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminScamDatabase;