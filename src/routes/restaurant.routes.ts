import express from 'express'
import { getFileUrl, registerRestaurant } from '../controllers/restaurant.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { authenticatedUser } from '../middlewares/authenticated.middleware.js';

const router = express.Router();

router.post('/upload',upload.single('restaurantThumbnailFile'),getFileUrl);
router.post('/register',authenticatedUser,registerRestaurant);


export default router;