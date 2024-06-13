import mongoose from "mongoose";

const connectToDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/food-ordering-app`);
        console.log('DB CONNECTED');
    } catch (error) {
        console.log(error);
    }
}

export {
    connectToDb
}
