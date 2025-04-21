import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: { id: string, email: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader); // Debug log

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided or invalid format' });
        return;
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token); // Debug log

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
            email: string; id: string
        };
        console.log('Decoded token:', decoded); // Debug log
        if (!decoded.id) {
            res.status(401).json({ error: 'Token missing id field' });
            return;
        }
        req.user = { id: decoded.id, email: decoded.email };
        next();
    } catch (error) {
        console.error('Token verification error:', error); // Debug log
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
};