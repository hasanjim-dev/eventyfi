import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import EventCard from '../components/EventCard.jsx';

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/events?upcoming=true').then((data) => setEvents(data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <div className="eyebrow-plain">Built for organizers and the people who show up</div>
            <h1>Plan the gathering. We'll handle the guest list.</h1>
            <p className="hero-sub">
              Eventify is where organizers publish conferences, workshops, and festivals — and
              where attendees find them, reserve a seat, and get a ticket in seconds.
            </p>
            <div className="hero-actions">
              <Link to="/events" className="btn btn-primary">Browse events</Link>
              <Link to="/register" className="btn btn-outline">Start organizing</Link>
            </div>
            <div className="hero-stats">
              <div className="stat-block">
                <div className="num">120+</div>
                <div className="label">Events hosted</div>
              </div>
              <div className="stat-block">
                <div className="num">8,400+</div>
                <div className="label">Tickets reserved</div>
              </div>
              <div className="stat-block">
                <div className="num">6</div>
                <div className="label">Cities covered</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="ticket-mini">
              <div>
                <div className="t-title">Dhaka Tech Summit</div>
                <div className="t-meta">Nov 14 · Bangabandhu ICC</div>
              </div>
              <div className="t-stub">Confirmed</div>
            </div>
            <div className="ticket-mini">
              <div>
                <div className="t-title">Sunset Music Fest</div>
                <div className="t-meta">Dec 5 · Cox's Bazar</div>
              </div>
              <div className="t-stub">Confirmed</div>
            </div>
            <div className="ticket-mini">
              <div>
                <div className="t-title">Startup Meetup</div>
                <div className="t-meta">Oct 2 · Gulshan</div>
              </div>
              <div className="t-stub">Free</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-head">
          <div>
            <h2>Happening soon</h2>
            <p>A look at what's coming up across the platform.</p>
          </div>
          <Link to="/events" className="btn btn-outline btn-sm">View all events</Link>
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <h3>No upcoming events yet</h3>
            <p>Check back soon, or start organizing your own.</p>
          </div>
        ) : (
          <div className="event-grid">
            {events.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>
    </div>
  );
}
