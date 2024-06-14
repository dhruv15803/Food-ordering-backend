import express from 'express'
import { addCity, addCuisine, deleteCity, deleteCuisine, editCity, editCuisine, getAllCities, getAllCuisines } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/addCuisine',addCuisine);
router.get('/getAllCuisines',getAllCuisines);
router.delete('/deleteCuisine/:id',deleteCuisine);
router.put('/editCuisine',editCuisine);

router.post('/addCity',addCity);
router.get('/getAllCities',getAllCities);
router.delete("/deleteCity/:id",deleteCity);
router.put('/editCity',editCity);

export default router;
