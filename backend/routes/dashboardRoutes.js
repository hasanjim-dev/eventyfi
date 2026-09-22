import { Router } from 'express';
import { stats } from '../controllers/dashboardController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/stats', requireAuth, requireRole('organizer'), stats);

export default router;
