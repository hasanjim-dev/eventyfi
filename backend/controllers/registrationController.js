import pool from '../config/db.js';
import { generateTicketCode } from '../utils/ticketCode.js';

export async function registerForEvent(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const eventId = req.params.id;
    const quantity = Number(req.body.quantity) || 1;

    await conn.beginTransaction();

    const [events] = await conn.query('SELECT * FROM events WHERE id = ? FOR UPDATE', [eventId]);
    const event = events[0];
    if (!event) {
      await conn.rollback();
      return res.status(404).json({ message: 'Event not found.' });
    }

    const [[{ taken }]] = await conn.query(
      `SELECT COALESCE(SUM(quantity), 0) AS taken FROM registrations WHERE event_id = ? AND status = 'confirmed'`,
      [eventId]
    );
    if (taken + quantity > event.capacity) {
      await conn.rollback();
      return res.status(409).json({ message: 'Not enough seats left for this event.' });
    }

    const [existing] = await conn.query(
      `SELECT * FROM registrations WHERE event_id = ? AND user_id = ?`,
      [eventId, req.user.id]
    );
    if (existing[0] && existing[0].status === 'confirmed') {
      await conn.rollback();
      return res.status(409).json({ message: "You're already registered for this event." });
    }

    const ticketCode = generateTicketCode();

    if (existing[0]) {
      await conn.query(
        `UPDATE registrations SET status = 'confirmed', quantity = ?, ticket_code = ? WHERE id = ?`,
        [quantity, ticketCode, existing[0].id]
      );
    } else {
      await conn.query(
        `INSERT INTO registrations (event_id, user_id, quantity, ticket_code, status) VALUES (?, ?, ?, ?, 'confirmed')`,
        [eventId, req.user.id, quantity, ticketCode]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Registered! See you there.', ticket_code: ticketCode });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

export async function cancelRegistration(req, res, next) {
  try {
    const [result] = await pool.query(
      `UPDATE registrations SET status = 'cancelled' WHERE event_id = ? AND user_id = ? AND status = 'confirmed'`,
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "You don't have an active registration for this event." });
    }
    res.json({ message: 'Registration cancelled.' });
  } catch (err) {
    next(err);
  }
}

export async function myRegistrations(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT r.id AS registration_id, r.quantity, r.ticket_code, r.status, r.created_at AS registered_at,
              e.id AS event_id, e.title, e.venue, e.city, e.event_date, e.event_time, e.cover_color, e.price
       FROM registrations r
       JOIN events e ON e.id = r.event_id
       WHERE r.user_id = ? AND r.status = 'confirmed'
       ORDER BY e.event_date ASC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}
