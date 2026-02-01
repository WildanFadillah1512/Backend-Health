import { Router } from 'express';
import { chatWithAI, getChatHistory } from '../controllers/aiController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/chat', requireAuth, chatWithAI);
router.get('/history', requireAuth, getChatHistory);

export default router;
