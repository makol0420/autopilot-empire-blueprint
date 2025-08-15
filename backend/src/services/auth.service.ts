import { prisma } from '../config/prisma.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { issueEmailVerificationToken, sendVerificationEmail } from '../utils/email.js';
import { signJwt } from '../utils/jwt.js';
import crypto from 'crypto';

export async function signup(email: string, password: string, name?: string) {
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		throw new Error('Email already in use');
	}
	const passwordHash = await hashPassword(password);
	const user = await prisma.user.create({ data: { email, passwordHash, name } });

	const token = await issueEmailVerificationToken(user.id);
	await sendVerificationEmail(user.email, token);

	const jwt = signJwt({ sub: user.id, role: user.role }, { expiresIn: '1h' });
	return { user: sanitizeUser(user), token: jwt };
}

export async function login(email: string, password: string) {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new Error('Invalid credentials');
	}
	const valid = await verifyPassword(password, user.passwordHash);
	if (!valid) {
		throw new Error('Invalid credentials');
	}
	const jwt = signJwt({ sub: user.id, role: user.role }, { expiresIn: '1h' });
	return { user: sanitizeUser(user), token: jwt };
}

export async function verifyEmail(rawToken: string) {
	const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
	const token = await prisma.verificationToken.findUnique({ where: { tokenHash } });
	if (!token || token.usedAt || token.expiresAt < new Date()) {
		throw new Error('Invalid or expired token');
	}
	await prisma.$transaction([
		prisma.user.update({ where: { id: token.userId }, data: { emailVerifiedAt: new Date() } }),
		prisma.verificationToken.update({ where: { id: token.id }, data: { usedAt: new Date() } })
	]);
	return { verified: true };
}

export function sanitizeUser(user: any) {
	// remove sensitive fields
	const { passwordHash, ...rest } = user;
	return rest;
}