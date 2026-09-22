import pool from '../config/db.js';

const REQUIRED_FIELDS = ['title', 'category', 'venue', 'city', 'event_date', 'event_time'];

export async function listEvents(req, res, next) {
  try {
    const { search, category, city, upcoming } = req.query;
    const clauses = ["status = 'published'"];
    const params = [];

    if (search) {
      clauses.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      clauses.push('category = ?');
      params.push(category);
    }
    if (city) {
      clauses.push('city = ?');
      params.push(city);
    }
    if (upcoming === 'true') {
      clauses.push('event_date >= CURDATE()');
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const [rows] = await pool.query(
      `SELECT e.*, u.name AS organizer_name,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') AS registered_count
       FROM events e
       JOIN users u ON u.id = e.organizer_id
       ${where}
       ORDER BY e.event_date ASC`,
      params
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function getEvent(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, u.name AS organizer_name,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') AS registered_count
       FROM events e
       JOIN users u ON u.id = e.organizer_id
       WHERE e.id = ?`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Event not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function myEvents(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT e.*,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') AS registered_count
       FROM events e
       WHERE e.organizer_id = ?
       ORDER BY e.event_date DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req, res, next) {
  try {
    const body = req.body;
    for (const field of REQUIRED_FIELDS) {
      if (!body[field]) return res.status(400).json({ message: `Field "${field}" is required.` });
    }

    const [result] = await pool.query(
      `INSERT INTO events
        (organizer_id, title, description, category, venue, city, event_date, event_time, price, capacity, cover_color, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        body.title,
        body.description || '',
        body.category,
        body.venue,
        body.city,
        body.event_date,
        body.event_time,
        body.price || 0,
        body.capacity || 50,
        body.cover_color || '#2A7F6B',
        body.status || 'published',
      ]
    );

    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function assertOwnership(eventId, userId) {
  const [rows] = await pool.query('SELECT organizer_id FROM events WHERE id = ?', [eventId]);
  if (!rows[0]) return { ok: false, status: 404, message: 'Event not found.' };
  if (rows[0].organizer_id !== userId) return { ok: false, status: 403, message: "You can only manage your own events." };
  return { ok: true };
}

export async function updateEvent(req, res, next) {
  try {
    const check = await assertOwnership(req.params.id, req.user.id);
    if (!check.ok) return res.status(check.status).json({ message: check.message });

    const fields = ['title', 'description', 'category', 'venue', 'city', 'event_date', 'event_time', 'price', 'capacity', 'cover_color', 'status'];
    const updates = [];
    const params = [];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = ?`);
        params.push(req.body[f]);
      }
    }
    if (updates.length === 0) return res.status(400).json({ message: 'No fields to update.' });

    params.push(req.params.id);
    await pool.query(`UPDATE events SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const check = await assertOwnership(req.params.id, req.user.id);
    if (!check.ok) return res.status(check.status).json({ message: check.message });

    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted.' });
  } catch (err) {
    next(err);
  }
}
