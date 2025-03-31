import User from "../models/user.js";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

// env file wala value use krnwa nam import dotenv from "dotenv"; meka import krla
//dotenv.config(); me deka aniwaren danna natham code eka env file eke value read krnn be
import dotenv from "dotenv";

dotenv.config();


const jwtKey = process.env.JWT_SCRET;


export function registerUser(req, res) {
  const data = req.body;

  data.password = bcrypt.hashSync(data.password, 10);

  const newUser = new User(data);

  newUser
    .save()
    .then(() => {
      res.json({ message: "User registered successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "User registration failed" });
    });
}

export function loginUser(req, res) {
  const data = req.body;

  User.findOne({
    email: data.email,
  }).then((user) => {
    if (user == null) {
      res.status(404).json({
        error: "User not found",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(
        data.password,
        user.password
      );
      data.password, user.password;

      if (isPasswordCorrect) {
        const token = jwt.sign({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
          profilePicture : user.profilePicture,
          phone: user.phone,
        },process.env.JWT_SCRET);

        res.json({ message: "Login successful", token: token ,userType: user.userType,
          user: user
        });
      } else {
        res.status(401).json({
          error: "Login failed",
        });
      }
    }
  });
}

export function isItAdmin(req){
  let isAdmin = false;

  if(req.user != null){
      if(req.user.userType == "admin"){
          isAdmin = true;
      }
  }

  return isAdmin;
}

export function isItCustomer(req){
  let isCustomer = false;

  if(req.user != null){
    if(req.user.userType == "customer"){
      isCustomer = true;
    }
  }
  return isCustomer;
}
//get user
export function getUserDetails(req,res){
  const userId = req.user.email;

  User.findOne({email: userId}).select("-password").then((user)=>{
    if(!user){
      return res. status(404).json({error : "User not Found"});
    }
    res.json({ user });
  }).catch((error)=>{
    res.status(500).json({error: "failed to fetch user details"})
  });
}

//update User
export function updateUser(req, res) {
  const userId = req.user.email; // Using email as identifier from JWT token
  const updateData = req.body;
  
  // Check if password is being updated
  if (updateData.password) {
    updateData.password = bcrypt.hashSync(updateData.password, 10);
  }
  
  User.findOneAndUpdate(
    { email: userId },
    updateData,
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Generate new token with updated information
      const token = jwt.sign({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        userType: updatedUser.userType,
        profilePicture: updatedUser.profilePicture,
        phone: updatedUser.phone,
      }, process.env.JWT_SCRET);
      
      res.json({ 
        message: "User updated successfully", 
        token: token,
        user: updatedUser 
      });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update user", details: error.message });
    });
}

export function deleteUser(req, res) {
  const userId = req.user.email; // Using email as identifier from JWT token
  
  User.findOneAndDelete({ email: userId })
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ message: "User account deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to delete user", details: error.message });
    });
}