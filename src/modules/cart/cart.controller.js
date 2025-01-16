import { catchError } from "../../utils/catchError.js";
import jwt from "jsonwebtoken";
import { productModel } from "../../../database/models/products.js";
import { cartModel } from "../../../database/models/cart.js";

const addCart = catchError(async (req, res) => {
  let { productId, count = 1 } = req.body;
  const token = req.header("token");
  if (!token) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "No token provided" });
  }
  if (!productId) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "Product id not found" });
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  if (!decoded) {
    return res
      .status(400)
      .json({ statsMessage: "fail", message: "invalid token" });
  }
  const userId = decoded.id;
  const product = await productModel.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "Product not found" });
  }
  let data = await cartModel.findOne({ userId });
  if (!data) {
    data = new cartModel({ userId, products: [] });
  }
  const productIndex = data.products.findIndex(
    (item) => item.product.toString() === productId
  );
  if (productIndex > -1) {
    data.products[productIndex].count += count;
    data.products[productIndex].price = product.price;
  } else {
    data.products.push({
      product: productId,
      count,
      price: product.price,
    });
  }
  data.totalCartPrice = data.products.reduce(
    (sum, item) => sum + item.count * item.price,
    0
  );
  await data.save();
  res.status(201).json({ statsMessage: "success", data });
});

const getAllCartItems = catchError(async (req, res) => {
  const token = req.header("token");
  if (!token) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "No token provided" });
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  if (!decoded) {
    return res
      .status(400)
      .json({ statsMessage: "fail", message: "invalid token" });
  }
  let userId = decoded.id;
  let data = await cartModel.find({ userId });
  res.status(201).json({ statsMessage: "success", data });
});

const updateCartQuantity = catchError(async (req, res) => {
  let { productId } = req.params;
  let { count } = req.body;
  const token = req.header("token");
  if (!token) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "No token provided" });
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  if (!decoded) {
    return res
      .status(400)
      .json({ statsMessage: "fail", message: "invalid token" });
  }
  let userId = decoded.id;
  let data = await cartModel.findOne({ userId });
  if (!data) {
    res.status(400).json({ statsMessage: "fail", message: "Cart not found" });
  }
  let productIndex = data.products.findIndex(
    (item) => item.product.toString() === productId.toString()
  );
  if (productIndex === -1) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "product not found" });
  }
  data.products[productIndex].count = count;
  data.totalCartPrice = data.products.reduce(
    (sum, item) => sum + item.count * item.price,
    0
  );
  data.save();
  res.json({ statsMessage: "success", data });
});

const deleteSpecificProduct = catchError(async (req, res) => {
  let { productId } = req.params;
  const token = req.header("token");
  if (!token) {
    return res.status(404).json({ message: "No token provided" });
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  if (!decoded) {
    return res.status(400).json({ message: "invalid token" });
  }
  let userId = decoded.id;
  const productExists = await productModel.findById(productId);
  if (!productExists) {
    return res.status(404).json({ message: "Product not found" });
  }
  let cart = await cartModel.findOne({ userId });
  let productIndex = cart.products.findIndex(
    (item) => item.product.toString() === productId.toString()
  );
  if (!cart.products.product) {
    cart.totalCartPrice = 0;
  } else {
    cart.totalCartPrice = cart.products.reduce(
      (sum, item) => sum + item.count * item.price,
      0
    );
  }
  cart.products.splice(productIndex, 1);
  let data = await cartModel.findByIdAndUpdate(cart.id, cart, { new: true });
  res.status(201).json({
    status: "success",
    message: "Product removed from cart successfully",
    data,
  });
});

const deleteCart = catchError(async (req, res) => {
  let { cartId } = req.params;
  const token = req.header("token");
  if (!token) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "No token provided" });
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  if (!decoded) {
    return res
      .status(400)
      .json({ statsMessage: "fail", message: "invalid token" });
  }
  const cartExists = await cartModel.findById(cartId);
  if (!cartExists) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "Cart not found" });
  }
  let data = await cartModel.findByIdAndDelete(cartId).select("id");
  if (!data) {
    return res
      .status(400)
      .json({ statsMessage: "fail", message: "couldn't delete" });
  }
  res.status(201).json({
    statsMessage: "success",
    message: "Cart removed successfully",
    data,
  });
});

export {
  addCart,
  getAllCartItems,
  updateCartQuantity,
  deleteSpecificProduct,
  deleteCart,
};
