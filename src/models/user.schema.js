import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import config  from "../config/index";
import crypto from "crypto"

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
    },

    // Genarate JWT Token
    getJWTtoken: function () {
        JWT.sign({_id:this._id, role: this.role}, config.JWT_SECRET,
        {
            expiresIn:config.JWT_EXPIRY
        })
    },

    // Generate Forgot Password Token
    generateForgotPasswordToken: function () {
        const forgotToken = crypto.randomBytes(20).toString("hex")

        this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(forgotToken)
        .digest("hex")
        this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000
        return forgotToken

    }
}

export default mongoose.model("User", userSchema);