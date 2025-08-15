import Stripe from 'stripe';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function ensureStripeCustomer(userId: string, email: string) {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw new Error('User not found');
	if (user.stripeCustomerId) return user.stripeCustomerId;
	const customer = await stripe.customers.create({ email });
	await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customer.id } });
	return customer.id;
}

export async function createCheckoutSession(userId: string, email: string) {
	const customerId = await ensureStripeCustomer(userId, email);
	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		customer: customerId,
		line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
		success_url: env.STRIPE_SUCCESS_URL,
		cancel_url: env.STRIPE_CANCEL_URL,
		allow_promotion_codes: true
	});
	return session.url as string;
}

export async function upsertSubscriptionFromStripe(subscription: Stripe.Subscription) {
	const customerId = typeof subscription.customer === 'string' ? subscription.customer : (subscription.customer as Stripe.Customer).id;
	if (!customerId) return;
	const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
	if (!user) return;

	const firstItem = subscription.items?.data?.[0];
	const priceId = (firstItem?.price as Stripe.Price | undefined)?.id;
	const status = subscription.status?.toUpperCase().replace(/-/g, '_') as any;

	const currentPeriodEndSeconds = (subscription as any).current_period_end as number | undefined;
	const currentPeriodEnd = currentPeriodEndSeconds ? new Date(currentPeriodEndSeconds * 1000) : null;
	const cancelAtPeriodEnd = Boolean((subscription as any).cancel_at_period_end);

	await prisma.subscription.upsert({
		where: { stripeSubscriptionId: subscription.id },
		update: {
			priceId: priceId || env.STRIPE_PRICE_ID,
			status,
			currentPeriodEnd,
			cancelAtPeriodEnd
		},
		create: {
			stripeSubscriptionId: subscription.id,
			userId: user.id,
			priceId: priceId || env.STRIPE_PRICE_ID,
			status,
			currentPeriodEnd,
			cancelAtPeriodEnd
		}
	});
}