import express, { Request, Response } from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import { connectToDb } from './db/db.js'
import adminRoutes from './routes/admin.routes.js'
import foodItemRoutes from './routes/foodItem.routes.js'
import restaurantRoutes from './routes/restaurant.routes.js'
import stripeRoutes from './routes/stripe.routes.js'
import orderRoutes from './routes/order.routes.js'

const app = express();
const port = process.env.PORT;


connectToDb();

// middlewares
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
}))
app.use(cookieParser());
app.use("/api/stripe/checkout/webhook",express.raw({ type: "*/*" }))
app.use(express.json());

// routes
app.use('/api/auth',authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/restaurant',restaurantRoutes);
app.use('/api/foodItem',foodItemRoutes);
app.use('/api/stripe',stripeRoutes);
app.use('/api/orders',orderRoutes);


app.listen(port,() => {
    console.log(`server running at http://localhost:${port}`);
})