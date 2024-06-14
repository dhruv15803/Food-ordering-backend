import mongoose from "mongoose";


const restaurantSchema = new mongoose.Schema({
    restaurantName:{
        type:String,
        required:true,
    },
    restaurantCity:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"City",
    },
    restaurantAddressLine1:{
        type:String,
        required:true,
    },
    restaurantAddressLine2:{
        type:String,
        required:true,
    },
    restaurantThumbnail:{
        type:String,
        required:true,
    },
    restaurantImages:[
        {
            type:String,
        }
    ]
},{timestamps:true});


export const Restaurant = mongoose.model('Restaurant',restaurantSchema);
