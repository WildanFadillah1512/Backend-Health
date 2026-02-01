import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Library
export const getWorkouts = async (req: Request, res: Response) => {
    try {
        const workouts = await prisma.workout.findMany();
        res.status(200).json(workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
};

export const getWorkoutById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const workout = await prisma.workout.findUnique({ where: { id } });
        if (!workout) return res.status(404).json({ error: 'Workout not found' });
        res.status(200).json(workout);
    } catch (error) {
        console.error('Error fetching workout:', error);
        res.status(500).json({ error: 'Failed to fetch workout' });
    }
};

// User History
export const logWorkout = async (req: AuthRequest, res: Response) => {
    try {
        const authId = req.authId;
        if (!authId) return res.status(401).json({ error: 'Unauthorized' });

        let user = await prisma.user.findUnique({ where: { authId } });
        if (!user && req.userEmail) {
            user = await prisma.user.create({
                data: {
                    authId,
                    email: req.userEmail,
                    name: 'New User',
                    age: 0, weight: 0, height: 0,
                    gender: 'male',
                    goal: 'get_fit',
                    activityLevel: 'sedentary'
                }
            });
        } else if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userId = user.id;

        const { workoutId, completionTime, caloriesBurned, date } = req.body;

        if (!workoutId) {
            return res.status(400).json({ error: 'Missing workoutId' });
        }

        // Validate workout exists
        const workout = await prisma.workout.findUnique({ where: { id: workoutId } });
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        const history = await prisma.userWorkout.create({
            data: {
                userId,
                workoutId,
                completionTime: Number(completionTime) || 0,
                caloriesBurned: Number(caloriesBurned) || 0,
                date: date ? new Date(date) : new Date()
            }
        });

        res.status(201).json(history);
    } catch (error) {
        console.error('Error logging workout:', error);
        res.status(500).json({ error: 'Failed to log workout' });
    }
};

export const getUserWorkouts = async (req: AuthRequest, res: Response) => {
    try {
        const authId = req.authId;
        if (!authId) return res.status(401).json({ error: 'Unauthorized' });

        let user = await prisma.user.findUnique({ where: { authId } });

        // Auto-create user if missing (Ideal Solution)
        if (!user && req.userEmail) {
            console.log(`Auto-creating user for authId: ${authId}`);
            user = await prisma.user.create({
                data: {
                    authId,
                    email: req.userEmail,
                    name: 'New User',
                    age: 0, weight: 0, height: 0, // Defaults to 0 to trigger onboarding
                    gender: 'male',
                    goal: 'get_fit',
                    activityLevel: 'sedentary'
                }
            });
        } else if (!user) {
            return res.status(200).json([]);
        }
        const userId = user.id;

        const history = await prisma.userWorkout.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            include: { workout: true } // Include details like name
        });

        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching user workouts:', error);
        res.status(500).json({ error: 'Failed to fetch user workouts' });
    }
};
