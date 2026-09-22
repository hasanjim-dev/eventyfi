# Eventify — Full-Stack Event Management Platform

Eventify is a full-stack event management platform where **organizers can create and manage events**, while **attendees can discover events, register, and manage their tickets**.

Built as a real, deployable full-stack project using React, Node.js, Express, MySQL, and JWT authentication.

## 🚀 Live Demo

- **Frontend:** [Eventify Live Website](https://eventyfi.vercel.app/)
- **Backend API:** [Eventify Backend API](https://eventyfi-production.up.railway.app)

> The frontend is deployed on Vercel, while the backend and MySQL database are deployed on Railway.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* CSS

### Backend

* Node.js
* Express.js
* REST API
* JWT Authentication
* bcrypt

### Database

* MySQL

### Deployment

* Vercel — Frontend
* Railway — Backend & MySQL Database

---

## ✨ Core Features

### 🔐 Authentication

* User registration and login
* Organizer and Attendee roles
* JWT-based authentication
* Passwords securely hashed with bcrypt
* Protected routes

### 📅 Event Discovery

* Browse upcoming events
* Search events
* Filter by category
* Filter by city
* View detailed event information

### 🎫 Event Registration

* Attendees can register for events
* Automatic ticket code generation
* Ticket cancellation
* Server-side capacity checking
* Prevents duplicate registration for the same event

### 🧑‍💼 Organizer Dashboard

* Create events
* Edit events
* Delete events
* Manage event status
* View registration statistics
* View attendee counts
* View estimated revenue
* Track upcoming and past events

### 🎟️ My Tickets

* View registered events
* View ticket information
* Manage registered events

---

## 📂 Project Structure

```text
eventify/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── ...
│
└── database/
    └── schema.sql
```

---

## 🗄️ Database Structure

The application uses MySQL with the following main tables:

* `users` — stores organizer and attendee accounts
* `events` — stores event information
* `registrations` — stores attendee registrations and ticket information

### Relationships

```text
users
  │
  ├── organizers
  │       │
  │       └── events
  │              │
  │              └── registrations
  │
  └── attendees
          │
          └── registrations
```

---

# 💻 Run Locally

## 1. Clone the repository

```bash
git clone https://github.com/hasanjim-dev/eventyfi.git
cd eventyfi
```

## 2. Database Setup

Create the MySQL database:

```bash
mysql -u root -p -e "CREATE DATABASE eventify;"
```

Then import the schema:

```bash
mysql -u root -p eventify < database/schema.sql
```

---

## 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`.

Example:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=eventify

JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

### Optional: Seed Demo Data

```bash
npm run seed
```

This creates sample users and sample events for local development.

> Do not use real production passwords or secrets inside `seed.js`, `.env`, or GitHub.

---

## 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create the frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

## 🔌 API Overview

| Method | Route                      | Access    |
| ------ | -------------------------- | --------- |
| POST   | `/api/auth/register`       | Public    |
| POST   | `/api/auth/login`          | Public    |
| GET    | `/api/auth/me`             | Logged in |
| GET    | `/api/events`              | Public    |
| GET    | `/api/events/:id`          | Public    |
| GET    | `/api/events/mine/list`    | Organizer |
| POST   | `/api/events`              | Organizer |
| PUT    | `/api/events/:id`          | Organizer |
| DELETE | `/api/events/:id`          | Organizer |
| POST   | `/api/events/:id/register` | Attendee  |
| DELETE | `/api/events/:id/register` | Attendee  |
| GET    | `/api/registrations/mine`  | Attendee  |
| GET    | `/api/dashboard/stats`     | Organizer |

---

## 🔒 Security

* JWT authentication
* bcrypt password hashing
* Role-based authorization
* Protected organizer routes
* Protected attendee routes
* Server-side event capacity validation
* Environment variables for deployment configuration

---

## 🌐 Deployment Architecture

```text
                    ┌──────────────────┐
                    │     Vercel       │
                    │ React + Vite     │
                    └────────┬─────────┘
                             │
                             │ REST API
                             ▼
                    ┌──────────────────┐
                    │     Railway      │
                    │ Node + Express   │
                    └────────┬─────────┘
                             │
                             │ MySQL
                             ▼
                    ┌──────────────────┐
                    │ Railway MySQL    │
                    │    Database      │
                    └──────────────────┘
```

---

## 📌 Future Improvements

Possible future improvements include:

* Online payment integration
* Email notifications
* Event image uploads
* QR-code based ticket verification
* Admin panel
* Pagination
* Advanced event analytics
* Multi-device real-time updates

---

## 👨‍💻 About the Project

Eventify was built as a portfolio project to demonstrate practical full-stack development skills, including:

* React frontend development
* REST API development
* Authentication and authorization
* MySQL database design
* CRUD operations
* Role-based access control
* Deployment and environment configuration
* Frontend/backend integration

---

## 📄 License

This project is for educational and portfolio purposes.
