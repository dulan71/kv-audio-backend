import Product from "../models/product.js";
import { isItAdmin } from "./userController.js";

export function addProduct(req, res) {
  console.log(req.user.userType);

  if (req.user == null) {
    res.status(401).json({
      message: "please login & try again",
    });
    return;
  }
  if (req.user.userType != "admin") {
    res.status(403).json({
      message: "You are not authorized to perform this action",
    });
    return;
  }

  const data = req.body;
  const newProduct = new Product(data);
  newProduct
    .save()
    .then(async () => {
      res.json({ message: "Product added successfully" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Product addition failed" });
    });
}

export async function getProducts(req, res) {
  try {
    if (isItAdmin(req)) {
      const products = await Product.find();
      res.json(products);
    } else {
      const product = await Product.find({
        availability: true,
      });
      res.json(product);
    }
  } catch (e) {
    res.status(500).json({
      message: "Failed to get products",
    });
  }
}

export async function updateProducts(req, res) {
  try {
    if (isItAdmin(req)) {
      const key = req.params.key;

      const data = req.body;

      await Product.updateOne({ key: key }, data);

      res.json({
        message: "Product updated successfully",
      });
      return;
    } else {
      res.staus(403).json({
        message: "You are not authorized to perform this action",
      });
      return;
    }
  } catch (e) {
    res.status(500).json({
      message: "Failed to update product",
    });
  }
}

export async function deleteProducts(req, res) {
  try {
    if (isItAdmin(req)) {
      const key = req.params.key;
      await Product.deleteOne({ key: key });
      res.json({
        message: "Product deleted successfully",
      });
    } else {
      response.status(403).json({
        message: "You are not authorized to perform this action",
      });
      return;
    }
  } catch (e) {}
}

export async function getProduct(req,res){
  try{
    const key = req.params.key;
    const product = await Product.findOne({key:key})

    if(product == null){
      res.status(404).json({
        message : "Product not found"
      })
      return;

    }
    res.json(product)
    return;

  }catch(e){
    res.status(500).json({
        message : "Failed to get Product"
    })

  }
}