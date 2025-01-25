import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    profilePicture : {
        type : String,
        required : true,
        default : "https://as2.ftcdn.net/v2/jpg/03/32/59/65/500_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
    }
});

const Product = mongoose.model("Product",productSchema);

export default Product;