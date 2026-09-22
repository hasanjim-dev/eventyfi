import { Router } from 'express';
import { myRegistrations } from '../controllers/registrationController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/mine', requireAuth, requireRole('attendee'), myRegistrations);

export default router;
