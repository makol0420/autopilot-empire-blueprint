import { Router } from 'express';
import * as BillingController from '../controllers/billing.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/checkout', requireAuth, BillingController.createCheckout);

export default router;