import User from "../models/user.schema.js";
import JWT from "jsonwebtoken";
import asyncHandler from "../service/asyncHandler.js";
import config from "../config.js";
import CustomError from "../utils/customError.js";



export const isLoggedIn = asyncHandler(async(req, res, next) => {
    let token;
    if (req.cookie.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))){
        token = req.cookie.token || req.headers.authorization.split(' ')[1]
    };

    if (!token) {
        throw new CustomError("Not Authorised to access to resource", 401)
    }

    try {
        const decodedJwtPayload =JWT.verify(token, config.JWT_SECRET)
        req.user = await User.findById(decodedJwtPayload._id, "name email role")
        next()
    } catch (error) {
        throw new CustomError("Not Authorised to access to resource", 401)
    }
})

// Note: - Split() - this method, we use split() to convert a string to array in JavaScript. After the split is used, the substring is returned in an array.
 
export const authorize = asyncHandler(async(req, res, next) => {
    if (!reuiredRoles.includes(req.user.role)){
        throw new CustomError("You are not authorize to access this resource")
    }

    next()
})

export const getProfile = asyncHandler(async(req, res, next) => {
    const {user} = req;

    if (!user) {
        throw new CustomError("User not found",  401)
    }

    req.status(200).json({
        success:true,
        user
    })
})