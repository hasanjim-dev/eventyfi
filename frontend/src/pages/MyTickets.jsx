import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  function load() {
    api.get('/registrations/mine').then(setTickets).catch((e) => setError(e.message));
  }

  useEffect(() => { load(); }, []);

  async function handleCancel(eventId) {
    if (!confirm('Cancel this registration?')) return;
    try {
      await api.del(`/events/${eventId}/register`);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="page shell section">
      <div className="section-head">
        <div>
          <h2>My tickets</h2>
          <p>Events you're registered for.</p>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      {tickets.length === 0 ? (
        <div className="empty-state">
          <h3>No tickets yet</h3>
          <p>Browse events and reserve your first seat.</p>
          <Link to="/events" className="btn btn-primary" style={{ marginTop: 16 }}>Explore events</Link>
        </div>
      ) : (
        tickets.map((t) => (
          <div className="ticket-stub-full" key={t.registration_id}>
            <div className="stub-main">
              <span className="ticket-category">{formatDate(t.event_date)}</span>
              <h3 className="ticket-title" style={{ margin: '4px 0' }}>{t.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{t.venue}, {t.city}</p>
              <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                <Link to={`/events/${t.event_id}`} className="btn btn-outline btn-sm">View event</Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleCancel(t.event_id)}>Cancel</button>
              </div>
            </div>
            <div className="stub-code">
              <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>TICKET CODE</span>
              <span className="code">{t.ticket_code}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
