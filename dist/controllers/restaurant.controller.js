import { getCloudinaryUrl } from "../utils/cloudinary.util.js";
import { User } from "../models/user.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { City } from "../models/city.model.js";
const getFileUrl = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "file not available",
            });
            return;
        }
        const localFilePath = req.file.path;
        const url = await getCloudinaryUrl(localFilePath);
        res.status(200).json({
            success: true,
            url,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const registerRestaurant = async (req, res) => {
    try {
        const { restaurantName, restaurantCity, addressLine1, addressLine2, restaurantThumbnailUrl, } = req.body;
        const inputs = [
            restaurantName,
            restaurantCity,
            addressLine1,
            addressLine2,
            restaurantThumbnailUrl,
        ];
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].trim() === "") {
                res.status(400).json({
                    success: false,
                    message: "please enter all fields",
                });
                return;
            }
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
        const city = await City.findOne({ cityName: restaurantCity.trim().toLowerCase() });
        if (!city) {
            res.status(400).json({
                "success": false,
                "message": "city does not exist"
            });
            return;
        }
        // creating a restaurant
        const newRestaurant = await Restaurant.create({
            restaurantOwner: user._id,
            restaurantThumbnail: restaurantThumbnailUrl,
            restaurantName: restaurantName.trim(),
            restaurantCity: city._id,
            restaurantAddressLine1: addressLine1,
            restaurantAddressLine2: addressLine2,
        });
        res.status(201).json({
            success: true,
            newRestaurant,
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { getFileUrl, registerRestaurant };
