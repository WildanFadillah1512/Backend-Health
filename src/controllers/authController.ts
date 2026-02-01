import { Request, Response } from 'express';

// Simple Auth Controller since we use Supabase interactions on Frontend mostly.
// This can be used for verification or custom backend-only auth flows.

export const verifyToken = async (req: Request, res: Response) => {
    // If middleware passed, token is valid
    res.status(200).json({
        valid: true,
        message: 'Token is valid',
        user: (req as any).user
    });
};

export const login = async (req: Request, res: Response) => {
    res.status(501).json({ message: 'Please login via the Mobile App using Supabase.' });
};
