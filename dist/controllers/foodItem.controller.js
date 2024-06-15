import { User } from "../models/user.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { Cuisine } from "../models/cuisine.model.js";
import { FoodItem } from "../models/foodItem.model.js";
const addFoodItem = async (req, res) => {
    try {
        const { foodItemName, foodItemDescription, foodItemPrice, foodItemCuisine, restaurantId, } = req.body;
        if (foodItemName.trim() === "" ||
            foodItemDescription.trim() === "" ||
            foodItemCuisine.trim() === "" ||
            foodItemPrice === 0) {
            res.status(400).json({
                success: false,
                message: "please enter all fields",
            });
            return;
        }
        const userId = req.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "userId invalid",
            });
            return;
        }
        const restaurant = await Restaurant.findOne({ _id: restaurantId });
        if (!restaurant) {
            res.status(400).json({
                success: false,
                message: "invalid restaurant id",
            });
            return;
        }
        console.log(restaurant.restaurantOwner);
        console.log(user._id);
        if (String(restaurant.restaurantOwner) !== String(user._id)) {
            res.status(400).json({
                success: false,
                message: "user is not owner of this restaurant",
            });
            return;
        }
        const cuisine = await Cuisine.findOne({ cuisineName: foodItemCuisine });
        const foodItem = await FoodItem.create({
            foodItemName: foodItemName.trim(),
            foodItemDescription: foodItemDescription.trim(),
            foodItemPrice: foodItemPrice,
            foodItemCuisine: cuisine?._id,
            restaurantId: restaurant._id,
        });
        const newFoodItem = await FoodItem.findOne({ _id: foodItem._id }).populate("foodItemCuisine");
        res.status(201).json({
            success: true,
            message: "successfully added food item",
            newFoodItem,
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { addFoodItem };
