import { Request, Response } from "express";
import { getCloudinaryUrl } from "../utils/cloudinary.util.js";
import { User } from "../models/user.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { City } from "../models/city.model.js";
import { FoodItem } from "../models/foodItem.model.js";

const getFileUrl = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.log(error);
  }
};

const registerRestaurant = async (req: Request, res: Response) => {
  try {
    const {
      restaurantName,
      restaurantCity,
      addressLine1,
      addressLine2,
      restaurantThumbnailUrl,
    }: {
      restaurantName: string;
      restaurantCity: string;
      addressLine1: string;
      addressLine2: string;
      restaurantThumbnailUrl: string;
    } = req.body;
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

    const city = await City.findOne({
      cityName: restaurantCity.trim().toLowerCase(),
    });
    if (!city) {
      res.status(400).json({
        success: false,
        message: "city does not exist",
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
  } catch (error) {
    console.log(error);
  }
};

const getMyRestaurants = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "userId not valid",
      });
      return;
    }
    const myRestaurants = await Restaurant.find({
      restaurantOwner: user._id,
    }).populate("restaurantCity");
    res.status(200).json({
      success: true,
      myRestaurants,
    });
  } catch (error) {
    console.log(error);
  }
};


const getRestaurantById = async (req:Request,res:Response) => {
  try {
    const {restaurantId} = req.params;
    const restaurant = await Restaurant.findOne({_id:restaurantId});
    if(!restaurant) {
      res.status(400).json({
        "success":false,
        "message":"restaurantId invalid"
      })
      return;
    }
    if(String(restaurant.restaurantOwner)!==req.userId) {
      res.status(400).json({
        "success":false,
        "message":"User not authenticated"
      })
      return;
    }
    res.status(200).json({
      "success":true,
      restaurant,
    })
  } catch (error) {
    console.log(error);
  }
}


const getRestaurantFoodItems = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const restaurant = await Restaurant.findOne({ _id: id });
    if (!restaurant) {
      res.status(400).json({
        success: false,
        message: "invalid restaurant id",
      });
      return;
    }
    if (String(restaurant.restaurantOwner) !== userId) {
      res.status(400).json({
        success: false,
        message: "user is not authenticated for this restaurant",
      });
      return;
    }
    const foodItems = await FoodItem.find({ restaurantId: restaurant._id }).populate('foodItemCuisine');
    res.status(200).json({
      success: true,
      foodItems,
    });
  } catch (error) {
    console.log(error);
  }
};

const removeRestaurant = async (req:Request,res:Response) => {
  const {id} = req.params;
  // if the restaurant is deleted then the corresponding foodItems are also deleted
  const restaurant = await Restaurant.findOne({_id:id});
  if(!restaurant) {
    res.status(400).json({
      "success":false,
      "message":"invalid restaurant id"
    })
    return;
  } 
  const userId = req.userId;
  if(String(restaurant.restaurantOwner)!==userId) {
    res.status(400).json({
      "success":false,
      "message":"user not owner of this restaurant"
    })
    return;
  }
  // deleting food items with restaurantId equal to id
  await FoodItem.deleteMany({restaurantId:restaurant._id});
  await Restaurant.deleteOne({_id:restaurant._id});
  res.status(200).json({
    "success":true,
    "message":"successfully removed restaurant and its menu items"
  })
  return;
}



const getRestaurantsByCity = async (req:Request,res:Response) => {
  try {
    const {restaurantCity} = req.params;
    const city = await City.findOne({cityName:restaurantCity});
    if(!city) {
      res.status(400).json({
        "success":false,
        "message":"invalid city name"
      })
      return;
    }
    const restaurants = await Restaurant.find({restaurantCity:city._id}).populate('restaurantCity');
    res.status(200).json({
      "success":true,
      restaurants,
    })
  } catch (error) {
    console.log(error);
  }
}


export {
  getFileUrl,
  registerRestaurant,
  getMyRestaurants,
  getRestaurantFoodItems,
  getRestaurantById,
  removeRestaurant,
  getRestaurantsByCity,
};
