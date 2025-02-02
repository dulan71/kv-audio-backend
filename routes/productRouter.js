import express from "express";
import {addProduct, deleteProducts, getProducts, updateProducts}  from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",addProduct)
productRouter.get("/",getProducts)
productRouter.put("/:key",updateProducts)
productRouter.delete("/:key",deleteProducts)


export default productRouter;