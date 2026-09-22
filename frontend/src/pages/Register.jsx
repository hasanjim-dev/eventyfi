import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'attendee' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const user = await register(form);
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
        <h2 style={{ marginBottom: 24 }}>Create your account</h2>
        {error && <div className="form-error">{error}</div>}

        <div className="role-toggle">
          <div
            className={`role-option ${form.role === 'attendee' ? 'selected' : ''}`}
            onClick={() => setForm({ ...form, role: 'attendee' })}
          >
            I'm attending events
          </div>
          <div
            className={`role-option ${form.role === 'organizer' ? 'selected' : ''}`}
            onClick={() => setForm({ ...form, role: 'organizer' })}
          >
            I'm organizing events
          </div>
        </div>

        <div className="field">
          <label>Full name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" required minLength={6} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>

        <p style={{ marginTop: 18, fontSize: '0.9rem', color: 'var(--muted)', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600 }}>Log in</Link>
        </p>
      </form>
    </div>
  );
}
