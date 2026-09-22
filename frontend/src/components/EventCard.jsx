import { Link } from 'react-router-dom';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function EventCard({ event }) {
  const seatsLeft = event.capacity - (event.registered_count || 0);
  return (
    <Link to={`/events/${event.id}`} className="ticket-card">
      <div className="ticket-band" style={{ background: event.cover_color || '#2A7F6B' }} />
      <div className="ticket-body">
        <span className="ticket-category">{event.category}</span>
        <h3 className="ticket-title">{event.title}</h3>
        <div className="ticket-meta">
          <span>{formatDate(event.event_date)}</span>
          <span>{event.venue}, {event.city}</span>
        </div>
        <div className="ticket-footer">
          <span className="ticket-price">{Number(event.price) > 0 ? `৳${Number(event.price).toFixed(0)}` : 'Free'}</span>
          <span className="ticket-seats">{seatsLeft > 0 ? `${seatsLeft} seats left` : 'Sold out'}</span>
        </div>
      </div>
    </Link>
  );
}
