import { Router } from 'express';
import { getFoods, getFoodById, logMeal, getMeals, updateWater, getDailyStats } from '../controllers/mealController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public / Library
router.get('/foods', getFoods);
router.get('/foods/:id', getFoodById);

// Protected / User Data
router.post('/', requireAuth, logMeal);
router.get('/', requireAuth, getMeals);
router.post('/water', requireAuth, updateWater);
router.get('/stats', requireAuth, getDailyStats);

export default router;
