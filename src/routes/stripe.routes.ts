import express from 'express'
import { createCheckoutSession, fullfillOrder } from '../controllers/stripe.controller.js';
import { authenticatedUser } from '../middlewares/authenticated.middleware.js';

const router = express.Router();

router.post('/checkout',authenticatedUser,createCheckoutSession);
router.post('/checkout/webhook',fullfillOrder);


export default router;
