import express from 'express';
import { authenticatedUser } from '../middlewares/authenticated.middleware.js';
import { addFoodItem, deleteFoodItem, updateFoodItem } from '../controllers/foodItem.controller.js';
const router = express.Router();
router.post('/add', authenticatedUser, addFoodItem);
router.delete('/delete/:id', authenticatedUser, deleteFoodItem);
router.put('/update', updateFoodItem);
export default router;
