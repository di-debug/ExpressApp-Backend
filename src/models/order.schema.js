import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    product:{
        type:[
            {
                productID:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                }
            }
        ],
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    address:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    coupon:String,
    transactionID: String,
    status:{
        type:String,
        enum: ["ORDERED","SHIPPED", "DELIVERED", "CANCELLED"],
        // TODO: try better way to do it
        default:true
    }
}, {timestamps:true});

export default mongoose.model("Order", orderSchema);