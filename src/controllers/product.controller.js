import product from '../models/product.schema.js';
import formidable from 'formidable';
import {s3FileUpload, s3DeleteFile} from '../service/imageUpload.js';
import mongoose from 'mongoose';
import asyncHandler from '../service/asyncHandler.js';
import config from "../config/index.js";
import CustomError from "../utils/customError.js"
import fs from 'fs'

export const addProduct = asyncHandler(async(req, res) => {
    const form = formidable({multiples:true, keepExtensions:true});
    
    form.parse(req, async function (err, fields, files) {
        if (err) {
            throw new CustomError(err.message ||"Something went wrong", 500 )
        }

        let productId = new mongoose.Types.ObjectId().toHexString()

        console.log(fields, files);

        if(
            !fields.name ||
            !fields.price ||
            !fields.collectionId ||
            !fields.description
    
        ){
            throw new CustomError("Please fill all the fields", 500)
        }
    
        let imgArrayResp = Promise.all(
            Object.keys(files).map(async(file, index) => {
                const element = file[filekey]
                console.log(element);
                const data = fs.readFileSync(element.filepath)
    
                const upload = await s3FileUpload({
                    bucketName:config.S3_BUCKET_NAME,
                    key : `products/${productId}/photo_${index + 1}.png`,
                    body: data,
                    contentType: element.mimeType
                })
    
                return{
                    secure_url: upload.Location
                }
            })
        )
    
        let imgArray = await imgArrayResp
        
        const Product = await product.create({
            _id : productId,
            photos: imgArray,
            ...fields
        })
    
        if (!Product){
            throw new CustomError("Product failed to created in DB", 400)
        }
    
        res.status(200).json({
            success: true,
            Product,
        })
    })
})

export const getAllProduct = asyncHandler(async(req,res) => {
    const products = await product.find({})

    if (!products){
        throw new CustomError("No products found", 400)
    }

    res.status(200).json({
        success:true,
        products
    })
})

export const getProductById = asyncHandler(async(req, res) => {
    const {_id:productId} = req.params

    const product = await product.find({})

    if (!product){
        throw new CustomError("No product found", 400)
    }

    res.status(200).json({
        success:true,
        product
    })
})

export const getProductByCollectionId = asyncHandler(async(req, res) => {
    const {_id: collectionId} = req.params
    const products = await product.find({collectionId})

    if (!products){
        throw new CustomError("No products found", 400)
    }

    res.status(200).json({
        success:true,
        products
    })
})

export const deleteProduct = asyncHandler(async(req, res)=>{
    const {id: productId} = req.params

    const product = await product.findById(productId)

    if (!product){
        throw new CustomError("No product found", 400)
    }

    const deletePhotos = Promise.all(
        product.photos.map(async(elem, index) => {
            await s3DeleteFile({
                bucketName : config.S3_BUCKET_NAME,
                key: `products/${product._id.toString()}/photo_${index + 1}.png`
            })
        })
    )

    await deletePhotos;

    await product.remove();

    res.status(200).json({
        success:true,
        message: "product has been deleted succesfully"
    })

})

