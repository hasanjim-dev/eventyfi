# Eventify — Full-Stack Event Management Platform

A complete event management platform: organizers create and manage events, attendees discover events and reserve tickets. Built for a portfolio as a real, runnable full-stack project.

**Stack:** React (Vite) · Node.js/Express · MySQL · JWT auth

```
eventify/
├── backend/           Express REST API
├── frontend/          React (Vite) client
└── database/          MySQL schema + seed data
```

## 1. Database setup (MySQL)

```bash
mysql -u root -p -e "CREATE DATABASE eventify;"
mysql -u root -p eventify < database/schema.sql
```

## 2. Backend setup

```bash
cd backend
cp .env.example .env      # fill in your MySQL credentials + a JWT secret
npm install
npm run seed                # optional: creates demo accounts + 5 sample events
npm run dev                 # http://localhost:5000
```

The seed script hashes the demo password with bcrypt at run time (a real password hash can't be safely hardcoded in a `.sql` file), so run it with `npm run seed` rather than piping a `.sql` file.

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env      # points to the backend URL, defaults to localhost:5000
npm install
npm run dev                 # http://localhost:5173
```

## Seed accounts (after running `npm run seed`)

| Role      | Email                 | Password   |
|-----------|------------------------|-----------|
| Organizer | jim@admin.com | 123456 |
| Attendee  | attendee@eventify.dev  | password123 |

## Core features

- **Auth** — register/login as an Organizer or Attendee, JWT-based sessions, bcrypt-hashed passwords.
- **Event discovery** — search, filter by category/city, upcoming-events feed.
- **Event management** — organizers create, edit, publish, and delete their own events; capacity tracking.
- **Registration/ticketing** — attendees reserve a spot, get a generated ticket code, can cancel; capacity is enforced server-side.
- **Organizer dashboard** — per-event registrant counts, total attendees, revenue estimate, upcoming vs. past breakdown.
- **My Tickets** — attendee's reserved events in one place.

## API overview

| Method | Route                          | Access            |
|--------|---------------------------------|--------------------|
| POST   | /api/auth/register              | public             |
| POST   | /api/auth/login                 | public             |
| GET    | /api/auth/me                    | logged in          |
| GET    | /api/events                     | public             |
| GET    | /api/events/:id                 | public             |
| GET    | /api/events/mine/list           | organizer          |
| POST   | /api/events                     | organizer          |
| PUT    | /api/events/:id                 | organizer (owner)  |
| DELETE | /api/events/:id                 | organizer (owner)  |
| POST   | /api/events/:id/register        | attendee           |
| DELETE | /api/events/:id/register        | attendee           |
| GET    | /api/registrations/mine         | attendee           |
| GET    | /api/dashboard/stats             | organizer          |

## Notes for extending this

- Swap `mysql2` pool for a connection-pool-per-request pattern if you deploy to serverless.
- Add refresh tokens / httpOnly cookie storage for production-grade auth (this build uses a bearer token in localStorage for simplicity).
- Add image upload (S3/Cloudinary) for event cover photos — currently events use a generated color banner.
- Add payments (Stripe/SSLCommerz) at the registration step — currently price is tracked but payment is not processed.
