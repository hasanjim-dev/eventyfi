import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateEditEvent from './pages/CreateEditEvent.jsx';
import MyTickets from './pages/MyTickets.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute role="organizer"><Dashboard /></ProtectedRoute>
        } />
        <Route path="/dashboard/new" element={
          <ProtectedRoute role="organizer"><CreateEditEvent /></ProtectedRoute>
        } />
        <Route path="/dashboard/edit/:id" element={
          <ProtectedRoute role="organizer"><CreateEditEvent /></ProtectedRoute>
        } />

        <Route path="/my-tickets" element={
          <ProtectedRoute role="attendee"><MyTickets /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="site-footer">
        <div className="shell">© {new Date().getFullYear()} Eventify — built as a portfolio project.</div>
      </footer>
    </>
  );
}
