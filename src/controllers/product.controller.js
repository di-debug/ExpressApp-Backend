import product from '../models/product.schema.js';
import formidable from 'formidable';
import {s3FileUpload, s3DeleteFile} from '../service/imageUpload.js';
import mongoose from 'mongoose';
import asyncHandler from '../service/asyncHandler.js';
import config from "../config/index.js";
import CustomError from "../utils/customError.js"

export const addProduct = asyncHandler(async(req, res) => {
    const form = formidable({multiples:true, keepExtensions:true});
    
    form.parse(req, async function (err, fields, files) {
        if (err) {
            throw new CustomError(err.message ||"Something went wrong", 500 )
        }

        let productId = new mongoose.Types.ObjectId().toHexString()

        console.log(fields, files);
    })
})