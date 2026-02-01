import { Router } from 'express';
import { createUser, getUser } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Routes
router.post('/', createUser);  // Public for onboarding
router.get('/:authId', requireAuth, getUser);  // Protected

export default router;
