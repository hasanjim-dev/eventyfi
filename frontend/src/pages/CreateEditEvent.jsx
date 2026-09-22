import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';

const CATEGORIES = ['Conference', 'Music Festival', 'Networking', 'Workshop', 'Cultural', 'Sports'];
const COLORS = ['#2A7F6B', '#E3B23C', '#14213D', '#8B5E3C', '#7B4B94', '#B34A2C'];

const EMPTY = {
  title: '', description: '', category: 'Conference', venue: '', city: '',
  event_date: '', event_time: '', price: 0, capacity: 50, cover_color: COLORS[0], status: 'published',
};

export default function CreateEditEvent() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/events/${id}`).then((e) => setForm({
        ...e,
        event_date: e.event_date.slice(0, 10),
        event_time: e.event_time.slice(0, 5),
      })).catch((e) => setError(e.message));
    }
  }, [id]);

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      if (isEdit) {
        await api.put(`/events/${id}`, form);
      } else {
        await api.post('/events', form);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <form className="form-card wide" onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 24 }}>{isEdit ? 'Edit event' : 'Create a new event'}</h2>
        {error && <div className="form-error">{error}</div>}

        <div className="field">
          <label>Title</label>
          <input required value={form.title} onChange={(e) => set('title', e.target.value)} />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Venue</label>
            <input required value={form.venue} onChange={(e) => set('venue', e.target.value)} />
          </div>
          <div className="field">
            <label>City</label>
            <input required value={form.city} onChange={(e) => set('city', e.target.value)} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Date</label>
            <input type="date" required value={form.event_date} onChange={(e) => set('event_date', e.target.value)} />
          </div>
          <div className="field">
            <label>Time</label>
            <input type="time" required value={form.event_time} onChange={(e) => set('event_time', e.target.value)} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Ticket price (৳, 0 = free)</label>
            <input type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} />
          </div>
          <div className="field">
            <label>Capacity</label>
            <input type="number" min="1" value={form.capacity} onChange={(e) => set('capacity', e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label>Banner color</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {COLORS.map((c) => (
              <div
                key={c}
                onClick={() => set('cover_color', c)}
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer',
                  border: form.cover_color === c ? '3px solid var(--ink)' : '3px solid transparent',
                }}
              />
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-block" disabled={busy} style={{ marginTop: 10 }}>
          {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Publish event'}
        </button>
      </form>
    </div>
  );
}
