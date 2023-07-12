import Collection  from "../models/collection.schema";
import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/customError";


export const createCollection = asyncHandler(async(req,res) => {
    const {name} = req.body

    if (!name) {
        throw new CustomError("Collection name required", 401)
    }

     const collection = await Collection.create({
        name
    })

    res.status(200).json({
        success:true,
        message:"Collection was created successfully",
        collection
    })
})

export const updateCollection = asyncHandler(async(req,res) => {
    const {name} = req.body
    const {id: collectionId} = req.params
    // To grab something from url/route we use params


    if (!name) {
        throw new CustomError("Collection name required", 400)
    }

    let updatedCollection = await Collection.findByIdAndUpdate(collectionId, {
        name
    }, {
        new: true,
        runValidators:true
    })

    if (!updateCollection) {
        throw new CustomError("Collection not found", 400)
    }

    res.status(200).json({
        success:true,
        message:"Collection Updated successfully",
        updateCollection
    })
})

export const deleteCollection = asyncHandler(async(req,res) => {

    const {id: collectionId} = req.params

    const collectionToDelete = await Collection.findById(collectionId)

    if (!collectionToDelete) {
        throw new CustomError("Collection to be deleted not found", 400)
    }

    await collectionToDelete.remove()

    res.status(200).json({
        success:true,
        message:"Collection deleted successfully",
    })
})

export const getAllCollection = asyncHandler(async(req,res) => {
    const collections = await Collection.findById()

    if (!collections) {
        throw new CustomError("No Collection found", 400)
    }


    res.status(200).json({
        success:true,
        collections
    })
})