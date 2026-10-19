import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ScamDatabase = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (q) => {
    setLoading(true);
    try {
      const { data } = await api.get('/scam-database', { params: q ? { q } : {} });
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="page">
      <h2>🗂️ Verified Scam Database</h2>
      <p>Search known scam phone numbers, accounts, and websites reported and verified by our team.</p>

      <form className="form inline-form" onSubmit={handleSearch}>
        <input
          placeholder="Search phone, account, website, or keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      <div className="scam-list">
        {results.length === 0 && !loading && <p>No verified entries found.</p>}
        {results.map((entry) => (
          <div key={entry.id} className="scam-card">
            <h3>{entry.title}</h3>
            <p className="scam-type">{entry.scamType.replace('_', ' ')}</p>
            <p>{entry.description}</p>
            <div className="scam-meta">
              {entry.scammerPhone && <span>📞 {entry.scammerPhone}</span>}
              {entry.scammerAccount && <span>👤 {entry.scammerAccount}</span>}
              {entry.scammerWebsite && <span>🌐 {entry.scammerWebsite}</span>}
            </div>
            <p className="report-count">Reported {entry.reportCount} time(s)</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScamDatabase;