import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for backend authentication
// Using environment variables from backend .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validate that Supabase credentials are configured
if (!supabaseUrl || !supabaseKey) {
    console.error(
        '⚠️ CRITICAL ERROR: Supabase credentials not configured in backend .env!\n' +
        'Required variables:\n' +
        '  - SUPABASE_URL\n' +
        '  - SUPABASE_ANON_KEY\n'
    );
    throw new Error('Missing Supabase configuration in backend environment');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuthRequest extends Request {
    user?: any;
    authId?: string;
    userEmail?: string;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('Auth Error:', error?.message);
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        // Attach user to request
        req.user = user;
        req.authId = user.id;
        req.userEmail = user.email;

        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        res.status(500).json({ error: 'Internal Server Error during auth' });
    }
};
