import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requireAuth } from './middleware/auth';

// ... (imports)

// Middleware
app.use(helmet()); // Security Headers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import mealRoutes from './routes/meals';
import workoutRoutes from './routes/workouts';
import aiRoutes from './routes/ai';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // POST is public for onboarding, GET is protected by route-level auth
app.use('/api/meals', mealRoutes); // Public for now (seeds)
app.use('/api/workouts', workoutRoutes); // Public for now
app.use('/api/ai', aiRoutes);

// Health Check (MUST be before 404 handler)
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// 404 handler (MUST be last)
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: {
            message: 'Route not found',
            status: 404
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
