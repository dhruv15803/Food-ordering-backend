import express from 'express';
import { authenticatedUser } from '../middlewares/authenticated.middleware.js';
import { addFoodItem } from '../controllers/foodItem.controller.js';
const router = express.Router();
router.post('/add', authenticatedUser, addFoodItem);
export default router;
