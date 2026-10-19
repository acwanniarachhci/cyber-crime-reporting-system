import React, { useEffect, useState } from 'react';
import StatGauge from '../components/StatGauge';
import { Link } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../api/axios';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const STATUS_COLORS = {
  submitted: '#93c5fd',
  under_review: '#60a5fa',
  investigating: '#3b82f6',
  verified: '#2563eb',
  resolved: '#1d4ed8',
  rejected: '#1e3a8a',
};

const PIE_COLORS = ['#3b82f6', '#2563eb', '#60a5fa', '#1d4ed8', '#93c5fd', '#1e40af', '#bfdbfe', '#1e3a8a', '#dbeafe', '#172554'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ status: '', scamType: '', search: '' });
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.scamType) params.scamType = filters.scamType;
    if (filters.search) params.search = filters.search;
    const { data } = await api.get('/reports', { params });
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    api.get('/reports/stats').then((res) => setStats(res.data));
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    loadReports();
  };

  const pieData = stats && stats.byType.length > 0 && {
    labels: stats.byType.map((t) => t._id.replace('_', ' ')),
    datasets: [
      {
        data: stats.byType.map((t) => t.count),
        backgroundColor: PIE_COLORS,
        borderColor: 'rgba(15,23,42,0.8)',
        borderWidth: 2,
      },
    ],
  };

  const barData = stats && stats.byStatus.length > 0 && {
    labels: stats.byStatus.map((s) => s._id.replace('_', ' ')),
    datasets: [
      {
        label: 'Reports',
        data: stats.byStatus.map((s) => s.count),
        backgroundColor: stats.byStatus.map((s) => STATUS_COLORS[s._id] || '#64748b'),
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#f1f5f9', font: { size: 11 }, boxWidth: 12 },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
      y: { ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.06)' } },
    },
  };

  return (
    <div className="page">
      <h2>🛡️ Admin Investigation Dashboard</h2>

                {stats && (
        <div className="gauge-row">
          <StatGauge label="Total Reports" value={stats.total} max={stats.total} color="#3b82f6" />
          <StatGauge
            label="New / Submitted"
            value={stats.byStatus.find((s) => s._id === 'submitted')?.count || 0}
            max={stats.total}
            color="#93c5fd"
          />
          <StatGauge
            label="Investigating"
            value={stats.byStatus.find((s) => s._id === 'investigating')?.count || 0}
            max={stats.total}
            color="#60a5fa"
          />
          <StatGauge
            label="Resolved"
            value={stats.byStatus.find((s) => s._id === 'resolved')?.count || 0}
            max={stats.total}
            color="#1d4ed8"
          />
          <div className="stat-box">
            <h3>{stats.totalAmountLost?.toLocaleString()}</h3><p>Total Reported Loss (LKR)</p>
          </div>
        </div>
      )}

      {stats && stats.total > 0 && (
        <div className="charts-row">
          {pieData && (
            <div className="chart-card">
              <h3>Scam Types Breakdown</h3>
              <div className="chart-wrap">
                <Pie data={pieData} options={chartOptions} />
              </div>
            </div>
          )}
          {barData && (
            <div className="chart-card">
              <h3>Reports by Status</h3>
              <div className="chart-wrap">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          )}
        </div>
      )}

      <form className="form filter-form" onSubmit={handleFilterSubmit}>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="investigating">Investigating</option>
          <option value="verified">Verified</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          placeholder="Search case ID, phone, account, website"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <button type="submit" className="btn btn-primary">Filter</button>
      </form>

      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Submitted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.caseId}</td>
                <td>{r.scamType.replace('_', ' ')}</td>
                <td><span className={`status-badge status-${r.status}`}>{r.status.replace('_', ' ')}</span></td>
                <td>{r.priority}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td><Link to={`/admin/reports/${r.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;