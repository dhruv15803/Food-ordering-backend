import { Cuisine } from "../models/cuisine.model.js";
const addCuisine = async (req, res) => {
    try {
        const { cuisineName } = req.body;
        if (cuisineName.trim() === "") {
            res.status(400).json({
                "success": false,
                "message": "cuisine name empty"
            });
            return;
        }
        // check if cuisinename already exists;
        const isCuisine = await Cuisine.findOne({ cuisineName: cuisineName.trim().toLowerCase() });
        if (isCuisine) {
            res.status(400).json({
                "success": false,
                "message": "cuisine already exists"
            });
            return;
        }
        const newCuisine = await Cuisine.create({ cuisineName: cuisineName.trim().toLowerCase() });
        res.status(201).json({
            "success": true,
            "message": "successfully added cuisine",
            newCuisine,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const deleteCuisine = async (req, res) => {
    try {
        const { id } = req.params;
        await Cuisine.deleteOne({ _id: id });
        // check if cuisine is deleted
        const cuisine = await Cuisine.findOne({ _id: id });
        if (cuisine) {
            res.status(400).json({
                "success": false,
                "message": "cuisine was not deleted"
            });
            return;
        }
        res.status(200).json({
            "success": true,
            "message": "successfully deleted cuisine"
        });
    }
    catch (error) {
        console.log(error);
    }
};
const editCuisine = async (req, res) => {
    try {
        const { newCuisineName, id } = req.body;
        if (newCuisineName.trim() === "") {
            res.status(400).json({
                "success": false,
                "message": "empty cuisine field error"
            });
            return;
        }
        // check if newCuisineName already exists
        const cuisine = await Cuisine.findOne({ cuisineName: newCuisineName.trim().toLowerCase() });
        if (cuisine) {
            res.status(400).json({
                "success": false,
                "message": "cuisine already exists"
            });
            return;
        }
        await Cuisine.updateOne({ _id: id }, { $set: { cuisineName: newCuisineName.trim().toLowerCase() } });
        const newCuisine = await Cuisine.findOne({ _id: id });
        res.status(200).json({
            "success": true,
            newCuisine,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const getAllCuisines = async (req, res) => {
    try {
        const cuisines = await Cuisine.find({});
        res.status(200).json({
            "success": true,
            cuisines,
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { addCuisine, getAllCuisines, deleteCuisine, editCuisine, };
