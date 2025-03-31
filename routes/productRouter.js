import express from "express";
import {addProduct, deleteProducts, getProduct, getProducts, updateProducts}  from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",addProduct)
productRouter.get("/",getProducts)
productRouter.put("/:key",updateProducts)
productRouter.delete("/:key",deleteProducts)
productRouter.get("/:key",getProduct)


export default productRouter;