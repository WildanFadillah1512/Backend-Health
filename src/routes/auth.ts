import { Router } from 'express';
import { verifyToken, login } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Routes
router.post('/login', login); // Placeholder
router.get('/verify', requireAuth, verifyToken); // Test endpoint for token

export default router;
