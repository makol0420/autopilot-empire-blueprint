import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';

export const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	secure: env.SMTP_PORT === 465,
	auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
});

export async function issueEmailVerificationToken(userId: string): Promise<string> {
	const rawToken = crypto.randomBytes(32).toString('hex');
	const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

	await prisma.verificationToken.create({
		data: { userId, tokenHash, expiresAt }
	});

	return rawToken;
}

export async function sendVerificationEmail(to: string, rawToken: string): Promise<void> {
	const url = `${env.APP_URL}/api/auth/verify-email?token=${rawToken}`;
	await transporter.sendMail({
		from: env.SMTP_FROM,
		to,
		subject: 'Verify your email',
		html: `<p>Thanks for signing up! Click the link below to verify your email:</p>
			<p><a href="${url}">Verify Email</a></p>
			<p>If you did not sign up, you can ignore this email.</p>`
	});
}