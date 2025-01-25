 import express from "express";
import { addReview, approvedReview, deleteReview, getReviews } from "../controllers/reviewController.js";

 const reviewRoter = express.Router();
 reviewRoter.post("/",addReview)
 reviewRoter.get("/",getReviews)
 //reviewRoter.get("/approved",(req,res)=>{
 //  console.log("This is approved route")
 //})
 reviewRoter.delete("/:email",deleteReview)

 //
 // reviewRoter.get("/:email",(req,res)=>{
  // console.log("This is email route")
 //})

 reviewRoter.put("/approve/:email",approvedReview)

 export default reviewRoter;