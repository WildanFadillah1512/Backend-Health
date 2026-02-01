import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    try {
        const {
            authId, email, name,
            age, weight, height, gender, goal, activityLevel,
            bmi, bmr, tdee, targetCalories, targetWeight
        } = req.body;

        if (!authId || !email) {
            return res.status(400).json({ error: 'Missing required fields: authId, email' });
        }

        // Upsert user (create if new, update if exists)
        // We ensure we save ALL the profile data provided
        const user = await prisma.user.upsert({
            where: { authId },
            update: {
                email,
                name,
                age,
                weight,
                height,
                gender,
                goal,
                activityLevel,
                bmi,
                bmr,
                tdee,
                targetCalories,
                targetWeight
            },
            create: {
                authId,
                email,
                name: name || 'User',
                age: age || 0,
                weight: weight || 0,
                height: height || 0,
                gender: gender || 'male',
                goal: goal || 'get_fit',
                activityLevel: activityLevel || 'sedentary',
                bmi,
                bmr,
                tdee,
                targetCalories,
                targetWeight
            }
        });

        res.status(200).json(user);
    } catch (error: any) {
        console.error('Error creating/updating user:', error);
        res.status(500).json({ error: 'Failed to create/update user' });
    }
};

export const getUser = async (req: AuthRequest, res: Response) => {
    try {
        const { authId } = req.params;

        let user = await prisma.user.findUnique({
            where: { authId }
        });

        // AUTO-SYNC: If user not found, create with defaults (MAIN FIX)
        if (!user && req.userEmail) {
            console.log(`[CRITICAL AUTO-SYNC] Creating user in getUser for authId: ${authId}`);
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

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
