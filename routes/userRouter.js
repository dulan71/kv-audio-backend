import express from "express";
import { deleteUser, getUserDetails, loginUser, registerUser, updateUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",registerUser)

userRouter.post("/login",loginUser)

//
userRouter.get("/",getUserDetails)
userRouter.put("/:email", updateUser);
userRouter.delete("/:email", deleteUser)

export default userRouter;
