import pool from '../config/db.js';

export async function stats(req, res, next) {
  try {
    const organizerId = req.user.id;

    const [[totals]] = await pool.query(
      `SELECT
         COUNT(DISTINCT e.id) AS total_events,
         COALESCE(SUM(CASE WHEN e.event_date >= CURDATE() THEN 1 ELSE 0 END), 0) AS upcoming_events,
         COALESCE((SELECT COUNT(*) FROM registrations r JOIN events e2 ON e2.id = r.event_id
                    WHERE e2.organizer_id = ? AND r.status = 'confirmed'), 0) AS total_registrations,
         COALESCE((SELECT SUM(r.quantity * e2.price) FROM registrations r JOIN events e2 ON e2.id = r.event_id
                    WHERE e2.organizer_id = ? AND r.status = 'confirmed'), 0) AS total_revenue
       FROM events e WHERE e.organizer_id = ?`,
      [organizerId, organizerId, organizerId]
    );

    const [perEvent] = await pool.query(
      `SELECT e.id, e.title, e.event_date, e.capacity,
              COALESCE(SUM(CASE WHEN r.status = 'confirmed' THEN r.quantity ELSE 0 END), 0) AS registered
       FROM events e
       LEFT JOIN registrations r ON r.event_id = e.id
       WHERE e.organizer_id = ?
       GROUP BY e.id
       ORDER BY e.event_date DESC
       LIMIT 8`,
      [organizerId]
    );

    res.json({ totals, per_event: perEvent });
  } catch (err) {
    next(err);
  }
}
