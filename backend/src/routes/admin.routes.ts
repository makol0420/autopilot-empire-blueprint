import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/users', requireAuth, requireAdmin, async (req, res) => {
	const users = await prisma.user.findMany({
		orderBy: { createdAt: 'desc' },
		select: { id: true, email: true, name: true, role: true, emailVerifiedAt: true, createdAt: true }
	});
	res.json(users);
});

router.get('/subscriptions', requireAuth, requireAdmin, async (req, res) => {
	const subs = await prisma.subscription.findMany({
		orderBy: { createdAt: 'desc' }
	});
	res.json(subs);
});

export default router;