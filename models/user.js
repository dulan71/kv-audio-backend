import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    userType : {
        type : String,
        required : true,
        default : "customer"
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true    
    },
    profilePicture : {
        type : String,
        required : true,
        default : "https://as2.ftcdn.net/v2/jpg/03/32/59/65/500_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
    }
    
});

const User = mongoose.model("User",userSchema);

export default User;


//customer -  "email": "dulans@example.com",
               //"password": "ds123"

//admin - "email" : "sdulan@example.com",
          //"password" : "sd123"                  