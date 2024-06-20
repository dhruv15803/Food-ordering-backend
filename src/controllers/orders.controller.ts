import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Restaurant } from "../models/restaurant.model.js";

const getMyOrders = async (req:Request,res:Response) => {
    try {
        const userId = req.userId;
        const user = await User.findOne({_id:userId});
        if(!user) {
            res.status(400).json({
                "success":false,
                "message":"invalid user id"
            })
            return;
        }
    
        const orders = await Order.find({userId:user._id}).populate('restaurant');
        res.status(200).json({
            "success":true,
            orders,
        })
    } catch (error) {
        console.log(error);
    }
}

const getUserOrder = async (req:Request,res:Response) => {
    try {
        const {orderId} = req.params;
        const order = await Order.findOne({_id:orderId}).populate('restaurant');
        if(!order) {
            res.status(400).json({
                "sucess":false,
                "message":"invalid order id"
            })
            return;
        }
        res.status(200).json({
            "success":true,
            order,
        })
    } catch (error) {
        console.log(error);
    }
}

// getRestaurantOrders

const getRestaurantOrders = async (req:Request,res:Response) => {
    try {
        const {restaurantId} = req.params;
        const restaurant = await Restaurant.findOne({_id:restaurantId});
        if(!restaurant) {
            res.status(400).json({
                "sucess":false,
                "message":"invalid restaurant id"
            })
            return;
        }
        const restaurantOrders = await Order.find({restaurant:restaurant._id});
        res.status(200).json({
            "success":true,
            restaurantOrders,
        })
    } catch (error) {
        console.log(error);
    }
}

export {
    getMyOrders,
    getUserOrder,
    getRestaurantOrders,
}