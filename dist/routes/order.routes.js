import express from 'express';
import { authenticatedUser } from '../middlewares/authenticated.middleware.js';
import { getMyOrders, getUserOrder } from '../controllers/orders.controller.js';
const router = express.Router();
router.get('/getMyOrders', authenticatedUser, getMyOrders);
router.get('/getUserOrder/:orderId', getUserOrder);
export default router;
