import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    orderItemName:{
        type:String,
        required:true,
    },
    orderItemPrice:{
        type:String,
        required:true,
    },
    orderItemQty:{
        type:String,
        required:true,
        default:1,
    }
})

const orderSchema = new mongoose.Schema({
    orderItems:[orderItemSchema],
    deliveryDetails:{
        email:{type:String,required:true},
        addressLine1:{type:String,required:true},
        addressLine2:{type:String,required:true},
        city:{type:String,required:true,}
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    orderStatus:{
        type:String,
        required:true,
        enum:['PLACED','PAID','FAILED',"inProgress","outForDelivery","delivered"],
        default:'PLACED',
    },
    orderTotal:{
        type:Number,
        required:true,
    },
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurant",
    }
},{timestamps:true});

export const Order = mongoose.model('Order',orderSchema);
