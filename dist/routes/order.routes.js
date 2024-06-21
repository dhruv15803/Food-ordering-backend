import express from 'express';
import { authenticatedUser } from '../middlewares/authenticated.middleware.js';
import { getMyOrders, getRestaurantOrders, getUserOrder, updateOrderStatus } from '../controllers/orders.controller.js';
const router = express.Router();
router.get('/getMyOrders', authenticatedUser, getMyOrders);
router.get('/getUserOrder/:orderId', getUserOrder);
router.get('/getRestaurantOrders/:restaurantId', getRestaurantOrders);
router.post('/updateOrderStatus', authenticatedUser, updateOrderStatus);
export default router;
