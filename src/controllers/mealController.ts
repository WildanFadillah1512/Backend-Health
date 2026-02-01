import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Library Data
export const getFoods = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        const where = category ? { category: String(category) } : {};
        const foods = await prisma.food.findMany({ where });
        res.status(200).json(foods);
    } catch (error) {
        console.error('Error fetching foods:', error);
        res.status(500).json({ error: 'Failed to fetch foods' });
    }
};

export const getFoodById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const food = await prisma.food.findUnique({ where: { id } });
        if (!food) return res.status(404).json({ error: 'Food not found' });
        res.status(200).json(food);
    } catch (error) {
        console.error('Error fetching food:', error);
        res.status(500).json({ error: 'Failed to fetch food' });
    }
};

// User Persistence (Meals)
export const logMeal = async (req: AuthRequest, res: Response) => {
    try {
        const authId = req.authId; // Supabase UUID
        if (!authId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({ where: { authId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const userId = user.id; // Internal CUID

        const {
            mealType,
            foodItems, // JSON array of items
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFats,
            date
        } = req.body;

        const meal = await prisma.meal.create({
            data: {
                userId,
                mealType,
                foodItems: JSON.stringify(foodItems),
                totalCalories: Number(totalCalories),
                totalProtein: Number(totalProtein),
                totalCarbs: Number(totalCarbs),
                totalFats: Number(totalFats),
                date: date ? new Date(date) : new Date()
            }
        });

        res.status(201).json(meal);
    } catch (error) {
        console.error('Error logging meal:', error);
        res.status(500).json({ error: 'Failed to log meal' });
    }
};

export const getMeals = async (req: AuthRequest, res: Response) => {
    try {
        const authId = req.authId;
        if (!authId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({ where: { authId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const userId = user.id;

        const { date } = req.query;
        let where: any = { userId };

        if (date) {
            // Filter by specific day
            const startOfDay = new Date(String(date));
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(String(date));
            endOfDay.setHours(23, 59, 59, 999);

            where.date = {
                gte: startOfDay,
                lte: endOfDay
            };
        }

        const meals = await prisma.meal.findMany({
            where,
            orderBy: { date: 'desc' }
        });

        res.status(200).json(meals);
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ error: 'Failed to fetch meals' });
    }
};

// User Persistence (Water & Stats)
export const updateWater = async (req: AuthRequest, res: Response) => {
    try {
        const authId = req.authId;
        if (!authId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({ where: { authId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const userId = user.id;

        const { amount, action } = req.body; // action: 'add' or 'set'
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find today's metric or create
        let metric = await prisma.userMetric.findFirst({
            where: {
                userId,
                date: today
            }
        });

        let newWater = 0;
        if (!metric) {
            // Create new for today
            metric = await prisma.userMetric.create({
                data: {
                    userId,
                    date: today,
                    weight: user?.weight || 0,
                    bmi: user?.bmi || 0,
                    waterIntake: 0
                }
            });
        }

        if (action === 'set') {
            newWater = amount;
        } else {
            newWater = metric.waterIntake + amount;
        }

        const updated = await prisma.userMetric.update({
            where: { id: metric.id },
            data: { waterIntake: newWater }
        });

        res.status(200).json({ waterIntake: updated.waterIntake });
    } catch (error) {
        console.error('Error updating water:', error);
        res.status(500).json({ error: 'Failed to update water' });
    }
};

export const getDailyStats = async (req: AuthRequest, res: Response) => {
    try {
        const authId = req.authId;
        if (!authId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({ where: { authId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const userId = user.id;

        const { date } = req.query;
        const targetDate = date ? new Date(String(date)) : new Date();
        targetDate.setHours(0, 0, 0, 0);

        const metric = await prisma.userMetric.findFirst({
            where: {
                userId,
                date: targetDate
            }
        });

        res.status(200).json({
            waterIntake: metric?.waterIntake || 0,
            weight: metric?.weight || 0,
            steps: metric?.steps || 0
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
