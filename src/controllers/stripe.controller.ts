import { Request, Response } from "express";
import Stripe from "stripe";
import { Order } from "../models/order.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { User } from "../models/user.model.js";
const stripe = new Stripe(`${process.env.STRIPE_API_KEY}`);
type CartItem = {
  _id: string;
  cartItemName: string;
  cartItemPrice: number;
  cartItemQty: number;
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const {
      cart,
      restaurantId,
      addressLine1,
      addressLine2,
      city,
      total,
    }: {
      cart: CartItem[];
      restaurantId: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      total: number;
    } = req.body;
    const lineItems = cart.map((cartItem) => {
      return {
        price_data: {
          currency: "inr",
          unit_amount: cartItem.cartItemPrice * 100,
          product_data: {
            name: cartItem.cartItemName,
          },
        },
        quantity: cartItem.cartItemQty,
      };
    });
    const orderItems = cart.map((item) => {
      return {
        orderItemName: item.cartItemName,
        orderItemPrice: item.cartItemPrice,
        orderItemQty: item.cartItemQty,
      };
    });
    const user = await User.findById(req.userId);
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(400).json({
        success: false,
        message: "The restaurant with id doesn't exist",
      });
      return;
    }
    const order = await Order.create({
      restaurant: restaurant._id,
      orderTotal: total,
      orderItems: orderItems,
      orderStatus: "PLACED",
      userId: req.userId,
      deliveryDetails: {
        addressLine1,
        addressLine2,
        email: user?.email,
        city,
      },
    });
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      metadata:{
        orderId:String(order._id),
      },
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/restaurant/results/menu/${restaurantId}`,
    });
    // creating a order with status placed
    if (!session) {
      res.status(500).json({
        success: false,
        message: "something went wrong with stripe",
      });
      return;
    }
    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log(error);
  }
};

// webhook handler
const fullfillOrder = async (req: Request, res: Response) => {
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error:any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`)
  }
  if (event?.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);
    console.log('Webhook endpoint');
    if (!order) {
      res.status(400).json({
        success: false,
        message: "order not found",
      });
      return;
    }
    console.log('Order found');
    await Order.updateOne(
      { _id: order?._id },
      {
        $set: {
          orderStatus: "PAID",
          orderTotal: event.data.object.amount_total,
        },
      }
    );
    console.log('Order updated');
  }
  res.status(200).send();
};
export { createCheckoutSession, fullfillOrder };
