import express from 'express'
import { getLoggedInUser, loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';
import { authenticatedUser } from '../middlewares/authenticated.middleware.js';

const router = express.Router();


router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',logoutUser);
router.get('/getLoggedInUser',authenticatedUser,getLoggedInUser);

export default router;
