import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', AuthController.postSignup);
router.post('/login', AuthController.postLogin);
router.get('/me', requireAuth, AuthController.getMe);
router.get('/verify-email', AuthController.verifyEmail);

export default router;