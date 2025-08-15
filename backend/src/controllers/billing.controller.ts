import { Request, Response } from 'express';
import { createCheckoutSession, stripe, upsertSubscriptionFromStripe } from '../services/billing.service.js';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';

export async function createCheckout(req: Request, res: Response) {
	if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });
	const user = await prisma.user.findUnique({ where: { id: req.userId } });
	if (!user || !user.email) return res.status(400).json({ error: 'User email not found' });
	try {
		const url = await createCheckoutSession(req.userId, user.email);
		res.json({ url });
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}

export async function stripeWebhook(req: Request, res: Response) {
	const sig = req.headers['stripe-signature'] as string | undefined;
	if (!sig) return res.status(400).send('Missing signature');
	try {
		const event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
		switch (event.type) {
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
			case 'customer.subscription.deleted': {
				await upsertSubscriptionFromStripe(event.data.object as any);
				break;
			}
			default:
				break;
		}
		res.json({ received: true });
	} catch (err: any) {
		res.status(400).send(`Webhook Error: ${err.message}`);
	}
}