import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";

const userName = new mongoose.Schema({
    name:{
        name: String,
        required: ["true","Name is Required"],
        maxLength:[50, "Name must be less than 50 char"]
    },
    email:{
        type:String,
        required:["true", "Email is required"]
    },
    password:{
        type:String,
        required: [true,"Password is Required"],
        maxLength:[8, "Password must be 8 chars long"],
        select:false
    },
    roles:{
        type:String,
        enum:Object.values(AuthRoles),
        default:AuthRoles.USER
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry: Date
}, {timestamps:true})

export default mongoose.model("User", userName);