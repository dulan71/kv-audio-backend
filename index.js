import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import reviewRoter from "./routes/reviewRouter.js";
import InquiryRouter from "./routes/inquiryRouter.js";
import cors from "cors";
import orderRouter from "./routes/orderRouter.js";

dotenv.config();

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token != null) {
    jwt.verify(token, process.env.JWT_SCRET, (error, decoded) => {
      if (!error) {
        req.user = decoded;
      }
    });
  }

  next();
});

let mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl);

let connection = mongoose.connection;

connection.once("open", () => {
  console.log("MonogoDB conect sucessfully");
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRoter);
app.use("/api/inquiries",InquiryRouter);
app.use("/api/orders",orderRouter);

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
