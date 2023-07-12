// Signup a user
import User from "../models/user.schema"
import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/customError";

export const cookieOptions ={
    expires:new (Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
}
export const signUp = asyncHandler(async(req, res)=> {
    // get data from user
    const {email, password, name} = req.body

    // validation
    if (!name || !email || !password) {
        throw new CustomError("Please add all the fields", 400)
    }
    // Validation now user will fill the for so we need o create a entry in db => imported User.Schema

    //lets Add this data to data base 
    // Checking if user already exist
    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new CustomError("user already exists", 400)
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const token = user.getJWTtoken()

    // Safety => Now interesting when user will query db will provide all the data to user due to user.Schema.js has password model that contain select:false

    user.password = undefined 
    //doing it now it wont return password while querying lot of debate to learn more Search FOR =model.create() returns the field which in schema have select: false


    // store this token in user's cookie
    res.cookie("token", token, cookieOptions)

    // send back a response to user
    res.status(200).json({
        sucess:true,
        token,
        user
    })
})

export const login = asyncHandler(async(req, res) => {
    const {password, email} = req.body;

    // validation
    if (!email || !password) {
        throw new CustomError("Please fill all the details", 400 )
    }

    const user = user.findOne({email}).select("+password")

    if(!user){
        throw new CustomError("Invalid credentials", 400)
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (isPasswordMatched) {
        const token = user.getJWTtoken()
        user.password = undefined
        res.cookie("token", token, cookieOptions)
        return res.status(200).json({
            sucess:true,
            token,
            user
        })
    }

    throw new CustomError("Password is invalid", 400)
})

export const logout = asyncHandler(async(req, res)=>{
    res.cookie("token", null, {
        expires : new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        sucess:true,
        message: 'Logged Out'
    })
    
})