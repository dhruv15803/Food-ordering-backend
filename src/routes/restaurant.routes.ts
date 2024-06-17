import express from 'express'
import { getFileUrl, getMyRestaurants, getRestaurantById, getRestaurantFoodItems, getRestaurantsByCity, registerRestaurant, removeRestaurant } from '../controllers/restaurant.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { authenticatedUser } from '../middlewares/authenticated.middleware.js';

const router = express.Router();

router.post('/upload',upload.single('restaurantThumbnailFile'),getFileUrl);
router.post('/register',authenticatedUser,registerRestaurant);
router.get('/getMyRestaurants',authenticatedUser,getMyRestaurants);
router.get('/getRestaurantFoodItems/:id',authenticatedUser,getRestaurantFoodItems);
router.get('/getRestaurantById/:restaurantId',authenticatedUser,getRestaurantById);
router.delete('/delete/:id',authenticatedUser,removeRestaurant);
router.get('/getRestaurantsByCity/:restaurantCity',getRestaurantsByCity);




export default router;