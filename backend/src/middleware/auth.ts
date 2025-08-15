import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.js';

declare global {
	namespace Express {
		interface Request {
			userId?: string;
			userRole?: string;
		}
	}
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const header = req.headers.authorization;
	if (!header || !header.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Missing Authorization header' });
	}
	const token = header.split(' ')[1];
	try {
		const payload = verifyJwt<{ sub: string; role?: string }>(token);
		req.userId = payload.sub;
		req.userRole = payload.role;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' });
	}
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
	if (req.userRole !== 'ADMIN') {
		return res.status(403).json({ error: 'Forbidden' });
	}
	next();
}