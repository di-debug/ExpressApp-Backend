import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
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

// Encrypt Pass Before Saving it.
// Note:Hooks OF MONGOOSE => We Cannot use callback func in hooks cause we need refernce of password or any schemas
userSchema.pre("save", async function(next){
    if (!this.isModified("password"))return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods = {
    // Compare Password
    comparePassword : async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    }
}

export default mongoose.model("User", userSchema);