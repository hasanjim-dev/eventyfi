// Seeds the database with a demo organizer, a demo attendee, and sample
// events. Run this after applying database/schema.sql:
//
//   npm run seed
//
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();

const DEMO_PASSWORD = 'password123';

const SAMPLE_EVENTS = [
  {
    title: 'Dhaka Tech Summit 2026',
    description: 'A full-day summit on AI, fintech, and startups building for the South Asian market. Keynotes, panels, and a startup showcase.',
    category: 'Conference', venue: 'Bangabandhu International Conference Center', city: 'Dhaka',
    event_date: '2026-11-14', event_time: '09:30:00', price: 1500, capacity: 300, cover_color: '#2A7F6B',
  },
  {
    title: "Cox's Bazar Sunset Music Fest",
    description: 'An evening of live band performances on the beach — folk, rock, and fusion acts from across the country.',
    category: 'Music Festival', venue: 'Laboni Beach Grounds', city: "Cox's Bazar",
    event_date: '2026-12-05', event_time: '17:00:00', price: 800, capacity: 1000, cover_color: '#E3B23C',
  },
  {
    title: 'Startup Bangladesh Meetup',
    description: 'Monthly founder meetup: pitch practice, investor office hours, and networking over chai.',
    category: 'Networking', venue: 'Gulshan Innovation Hub', city: 'Dhaka',
    event_date: '2026-10-02', event_time: '18:30:00', price: 0, capacity: 120, cover_color: '#14213D',
  },
  {
    title: 'UX Bangladesh Workshop: Product Thinking',
    description: 'A hands-on half-day workshop on product discovery and UX research methods, with real case studies.',
    category: 'Workshop', venue: 'BUET Auditorium', city: 'Dhaka',
    event_date: '2026-10-20', event_time: '10:00:00', price: 500, capacity: 80, cover_color: '#8B5E3C',
  },
  {
    title: 'Chattogram Photography Walk & Exhibition',
    description: 'A guided street photography walk through old Chattogram, followed by an evening exhibition of selected shots.',
    category: 'Cultural', venue: 'DC Hill Park', city: 'Chattogram',
    event_date: '2026-11-01', event_time: '07:00:00', price: 200, capacity: 60, cover_color: '#7B4B94',
  },
];

async function upsertUser(name, email, role) {
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing[0]) return existing[0].id;

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  return result.insertId;
}

async function run() {
  console.log('Seeding Eventify database…');

  const organizerId = await upsertUser('Rafiul Karim', 'organizer@eventify.dev', 'organizer');
  await upsertUser('Nusrat Jahan', 'attendee@eventify.dev', 'attendee');

  const [existingEvents] = await pool.query('SELECT COUNT(*) AS c FROM events WHERE organizer_id = ?', [organizerId]);
  if (existingEvents[0].c === 0) {
    for (const ev of SAMPLE_EVENTS) {
      await pool.query(
        `INSERT INTO events (organizer_id, title, description, category, venue, city, event_date, event_time, price, capacity, cover_color)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [organizerId, ev.title, ev.description, ev.category, ev.venue, ev.city, ev.event_date, ev.event_time, ev.price, ev.capacity, ev.cover_color]
      );
    }
    console.log(`Inserted ${SAMPLE_EVENTS.length} sample events.`);
  } else {
    console.log('Sample events already exist, skipping.');
  }

  console.log('Done. Demo login (both accounts use the same password):');
  console.log('  organizer@eventify.dev / password123');
  console.log('  attendee@eventify.dev  / password123');
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
