import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import StatCard from '../components/StatCard.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  function load() {
    api.get('/dashboard/stats').then(setStats).catch((e) => setError(e.message));
    api.get('/events/mine/list').then(setEvents).catch((e) => setError(e.message));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    try {
      await api.del(`/events/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="page shell section">
      <div className="section-head">
        <div>
          <h2>Your dashboard</h2>
          <p>Everything you're organizing, in one place.</p>
        </div>
        <Link to="/dashboard/new" className="btn btn-primary">Create event</Link>
      </div>

      {error && <div className="form-error">{error}</div>}

      {stats && (
        <div className="dash-grid">
          <StatCard label="Total events" value={stats.totals.total_events} />
          <StatCard label="Upcoming events" value={stats.totals.upcoming_events} />
          <StatCard label="Total registrations" value={stats.totals.total_registrations} />
          <StatCard label="Estimated revenue" value={`৳${Number(stats.totals.total_revenue).toFixed(0)}`} />
        </div>
      )}

      {events.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't created an event yet</h3>
          <p>Publish your first event and start collecting registrations.</p>
        </div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Status</th>
              <th>Capacity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => {
              const pct = Math.min(100, Math.round((e.registered_count / e.capacity) * 100));
              return (
                <tr key={e.id}>
                  <td>{e.title}</td>
                  <td>{new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td><span className={`badge badge-${e.status}`}>{e.status}</span></td>
                  <td>
                    <div className="capacity-cell">
                      <div className="bar"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
                      <span>{e.registered_count}/{e.capacity}</span>
                    </div>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/dashboard/edit/${e.id}`} className="btn btn-outline btn-sm">Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
