import mongoose from "mongoose";


const FoodItemSchema = new mongoose.Schema({
    foodItemName:{
        type:String,
        required:true,
    },
    foodItemDescription:{
        type:String,
        required:true,
    },
    foodItemPrice:{
        type:Number,
        required:true,
    },
    foodItemCuisine:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cuisine",
        required:true,
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurant",
        required:true,
    }
},{timestamps:true});

export const FoodItem = mongoose.model('FoodItem',FoodItemSchema);
