import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page narrow-page">
      <h2>Register</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input name="name" required value={form.name} onChange={handleChange} />
        <label>Email</label>
        <input type="email" name="email" required value={form.email} onChange={handleChange} />
        <label>Phone (optional)</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
        <label>Password</label>
        <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} />
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;