import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import billingRoutes from './routes/billing.routes.js';
import adminRoutes from './routes/admin.routes.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import * as BillingController from './controllers/billing.controller.js';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

// Stripe webhook must be defined before express.json to access raw body
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), BillingController.stripeWebhook);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/health', (req, res) => {
	res.json({ ok: true, env: env.NODE_ENV });
});

const port = env.PORT;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});