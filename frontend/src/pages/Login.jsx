import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'organizer' ? '/dashboard' : '/events');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 24 }}>Welcome back</h2>
        {error && <div className="form-error">{error}</div>}

        <div className="field">
          <label>Email</label>
          <input type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>

        <p style={{ marginTop: 18, fontSize: '0.9rem', color: 'var(--muted)', textAlign: 'center' }}>
          New to Eventify? <Link to="/register" style={{ color: 'var(--teal)', fontWeight: 600 }}>Create an account</Link>
        </p>
      </form>
    </div>
  );
}
