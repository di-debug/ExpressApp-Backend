import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: ["true", "Please Provide a Collection Name"],
            trim: true,
            maxLength : [
                120,
                "Collection name should not be empty"
            ] 
        }
    },
    {timestamps:true,}
)

export default mongoose.model("Collection", collectionSchema);

//in DB  Collection get save in => collections: all lowercase and gets coverted in plural > "s"
