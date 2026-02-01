import { Router } from 'express';
import { getWorkouts, getWorkoutById, logWorkout, getUserWorkouts } from '../controllers/workoutController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public / Library
router.get('/', getWorkouts);
router.get('/:id', getWorkoutById);

// Protected / User Data
router.post('/history', requireAuth, logWorkout);
router.get('/history', requireAuth, getUserWorkouts);

export default router;
