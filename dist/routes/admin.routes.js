import express from 'express';
import { addCuisine, deleteCuisine, editCuisine, getAllCuisines } from '../controllers/admin.controller.js';
const router = express.Router();
router.post('/addCuisine', addCuisine);
router.get('/getAllCuisines', getAllCuisines);
router.delete('/deleteCuisine/:id', deleteCuisine);
router.put('/editCuisine', editCuisine);
export default router;
