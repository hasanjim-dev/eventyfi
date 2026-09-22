import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function formatTime(timeStr) {
  const [h, m] = timeStr.split(':');
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  function load() {
    api.get(`/events/${id}`).then(setEvent).catch((e) => setError(e.message));
  }

  useEffect(() => { load(); }, [id]);

  async function handleRegister() {
    if (!user) return navigate('/login');
    setError(''); setSuccess(''); setBusy(true);
    try {
      const res = await api.post(`/events/${id}/register`, { quantity: 1 });
      setSuccess(`You're in! Ticket code: ${res.ticket_code}`);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!event) return <div className="page shell section">{error || 'Loading…'}</div>;

  const seatsLeft = event.capacity - (event.registered_count || 0);
  const fillPct = Math.min(100, Math.round((event.registered_count / event.capacity) * 100));

  return (
    <div className="page shell section">
      <div className="detail-banner" style={{ background: `linear-gradient(120deg, ${event.cover_color}, var(--ink))` }} />

      <div className="detail-grid">
        <div>
          <span className="ticket-category">{event.category}</span>
          <h1 style={{ fontSize: '2.1rem', marginTop: 8 }}>{event.title}</h1>

          <div className="detail-meta-row">
            <div className="meta-item">
              <div className="k">Date</div>
              <div className="v">{formatDate(event.event_date)}</div>
            </div>
            <div className="meta-item">
              <div className="k">Time</div>
              <div className="v">{formatTime(event.event_time)}</div>
            </div>
            <div className="meta-item">
              <div className="k">Venue</div>
              <div className="v">{event.venue}, {event.city}</div>
            </div>
            <div className="meta-item">
              <div className="k">Organizer</div>
              <div className="v">{event.organizer_name}</div>
            </div>
          </div>

          <p className="detail-desc">{event.description}</p>
        </div>

        <div className="booking-card">
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="booking-price">{Number(event.price) > 0 ? `৳${Number(event.price).toFixed(0)}` : 'Free'}</div>

          <div className="seats-bar"><div className="seats-bar-fill" style={{ width: `${fillPct}%` }} /></div>
          <div className="booking-row">
            <span>{event.registered_count} registered</span>
            <span>{seatsLeft} seats left</span>
          </div>

          {user?.role === 'organizer' ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Organizer accounts can't reserve tickets.</p>
          ) : (
            <button
              className="btn btn-gold btn-block"
              disabled={busy || seatsLeft <= 0 || !!success}
              onClick={handleRegister}
            >
              {success ? 'Registered' : seatsLeft <= 0 ? 'Sold out' : user ? 'Reserve my seat' : 'Log in to register'}
            </button>
          )}

          {!user && (
            <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--muted)' }}>
              New here? <Link to="/register" style={{ color: 'var(--teal)', fontWeight: 600 }}>Create an account</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
