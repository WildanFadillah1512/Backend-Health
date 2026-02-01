import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import OpenAI from 'openai'; // or whatever AI lib you use, maybe just mock or deepseek integration

const prisma = new PrismaClient();

// Assuming you have an AI integration somewhere. 
// For now, I'll simulate or use the existing logic if I can find it, 
// but I'll implement the DB persistence wrapper here.

const mockAIResponse = async (prompt: string) => {
    // Fallback if API fails
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `[Offline Mode] This is a personalized advice for: "${prompt}". Stay consistent and drink water!`;
};

export const chatWithAI = async (req: AuthRequest, res: Response) => {
    try {
        const authId = req.authId;
        if (!authId) return res.status(401).json({ error: 'Unauthorized' });

        let user = await prisma.user.findUnique({ where: { authId } });

        // AUTO-SYNC: Create user if missing
        if (!user && req.userEmail) {
            console.log(`Auto-creating user in AI chat for authId: ${authId}`);
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

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

        // 1. Find or create a session
        let session = await prisma.chatSession.findFirst({
            where: { userId },
            orderBy: { updatedAt: 'desc' }
        });

        if (!session) {
            session = await prisma.chatSession.create({
                data: { userId, title: 'HealthFit Coach' }
            });
        }

        // 2. Save User Message
        await prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                role: 'user',
                content: prompt
            }
        });

        // 3. Get AI Response from Groq
        let advice = "";
        try {
            const openai = new OpenAI({
                apiKey: process.env.GROQ_API_KEY,
                baseURL: 'https://api.groq.com/openai/v1'
            });

            const completion = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are a helpful and motivational fitness coach named HealthFit AI. Keep responses concise and encouraging.' },
                    { role: 'user', content: prompt }
                ],
                model: 'llama-3.1-8b-instant',
            });

            advice = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
        } catch (aiError) {
            console.error('Groq API Error:', aiError);
            advice = await mockAIResponse(prompt);
        }

        // 4. Save AI Message
        await prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                role: 'assistant',
                content: advice
            }
        });

        res.status(200).json({ advice });
    } catch (error) {
        console.error('Error in AI chat:', error);
        res.status(500).json({ error: 'Failed to chat with AI' });
    }
};

export const getChatHistory = async (req: AuthRequest, res: Response) => {
    try {
        const authId = req.authId;
        if (!authId) return res.status(401).json({ error: 'Unauthorized' });

        let user = await prisma.user.findUnique({ where: { authId } });

        // AUTO-SYNC
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

        const session = await prisma.chatSession.findFirst({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!session) return res.status(200).json([]);

        res.status(200).json(session.messages);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
};
