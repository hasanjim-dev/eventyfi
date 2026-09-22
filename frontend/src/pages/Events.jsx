import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import EventCard from '../components/EventCard.jsx';

const CATEGORIES = ['Conference', 'Music Festival', 'Networking', 'Workshop', 'Cultural', 'Sports'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (city) params.set('city', city);

    setLoading(true);
    const timer = setTimeout(() => {
      api.get(`/events?${params.toString()}`)
        .then(setEvents)
        .catch(() => setEvents([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, city]);

  return (
    <div className="page shell section">
      <div className="section-head">
        <div>
          <h2>Explore events</h2>
          <p>Search across every published event on Eventify.</p>
        </div>
      </div>

      <div className="filters">
        <input
          placeholder="Search by name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading events…</p>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <h3>No events match your search</h3>
          <p>Try a different keyword, category, or city.</p>
        </div>
      ) : (
        <div className="event-grid">
          {events.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  );
}
