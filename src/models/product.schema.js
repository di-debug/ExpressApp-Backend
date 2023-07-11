import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String ,
        required: ["true", "Product Name Should not be Empty"],
        trim: true,
        maxLength:[120, "Product name should not be more than 120 chars"],
    },

    price:{
        type: Number,
        required:["true","Please provide product price"],
        maxLength:[5, "Product name shoud not be more than 5 chars"],
    },
    description:{
        type:String
    },
    photos : [
        {
            secure_url:{
                type:String,
                required:true
            }
        }
    ],
    stock:{
        type:Number,
        default: 0
    },
    sold:{
        type:Number,
        default:0
    },
    collectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Collection"
    }

}, {timestamps:true})

export default mongoose.model("Product", productSchema)