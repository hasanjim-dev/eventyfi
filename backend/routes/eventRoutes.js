import { Router } from 'express';
import {
  listEvents, getEvent, myEvents, createEvent, updateEvent, deleteEvent,
} from '../controllers/eventController.js';
import { registerForEvent, cancelRegistration } from '../controllers/registrationController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', listEvents);
router.get('/mine/list', requireAuth, requireRole('organizer'), myEvents);
router.get('/:id', getEvent);
router.post('/', requireAuth, requireRole('organizer'), createEvent);
router.put('/:id', requireAuth, requireRole('organizer'), updateEvent);
router.delete('/:id', requireAuth, requireRole('organizer'), deleteEvent);

router.post('/:id/register', requireAuth, requireRole('attendee'), registerForEvent);
router.delete('/:id/register', requireAuth, requireRole('attendee'), cancelRegistration);

export default router;
