import { Request, Response } from 'express';
import { z } from 'zod';
import * as AuthService from '../services/auth.service.js';
import { prisma } from '../config/prisma.js';

const signupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	name: z.string().optional()
});

export async function postSignup(req: Request, res: Response) {
	const parsed = signupSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const result = await AuthService.signup(parsed.data.email, parsed.data.password, parsed.data.name);
		res.status(201).json(result);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export async function postLogin(req: Request, res: Response) {
	const parsed = loginSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const result = await AuthService.login(parsed.data.email, parsed.data.password);
		res.json(result);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}

export async function getMe(req: Request, res: Response) {
	if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });
	const user = await prisma.user.findUnique({ where: { id: req.userId } });
	if (!user) return res.status(404).json({ error: 'User not found' });
	res.json(AuthService.sanitizeUser(user));
}

export async function verifyEmail(req: Request, res: Response) {
	const token = req.query.token as string | undefined;
	if (!token) return res.status(400).json({ error: 'Missing token' });
	try {
		await AuthService.verifyEmail(token);
		res.json({ message: 'Email verified' });
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}