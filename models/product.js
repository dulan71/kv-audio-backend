import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    key : {
        type : String,
        required : true,
        unique : true

    },
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },

    category : {
        type : String,
        required : true,
        default : "uncategorized"

    },
    dimensions : {
        type : String,
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
    },
    availablity : {
        type : Boolean,
        required : true,
        default : true
    }
});

const Product = mongoose.model("Products",productSchema);

export default Product;