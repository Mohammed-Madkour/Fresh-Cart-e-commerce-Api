import { catchError } from "../../utils/catchError.js";
import jwt from "jsonwebtoken";
import { ordersModel } from "../../../database/models/orders.js";
import { cartModel } from "../../../database/models/cart.js";
import stripe from "stripe";

const addCashOrder = catchError(async (req, res) => {
  let { cartId } = req.params;
  const token = req.header("token");
  if (!token) {
    return res.status(404).json({ message: "No token provided" });
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  if (!decoded) {
    return res
      .status(400)
      .json({ statsMessage: "fail", message: "invalid token" });
  }
  let userId = decoded.id;
  const cart = await cartModel.findById(cartId);
  if (!cart) {
    return res
      .status(404)
      .json({ message: `there is no cart for this user : ${userId}` });
  }
  let cartItems = cart.products;
  totalOrderPrice = cart.totalCartPrice;
  let data = new ordersModel({
    ...req.body,
    userId,
    totalOrderPrice,
    cartItems,
  });
  await data.save();
  res.status(201).json({
    statusMessage: "success",
    message: "Order added successfully",
    data,
  });
});

const getAllUserOrders = catchError(async (req, res) => {
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
  let data = await ordersModel.find({ userId }).populate({
    path: "cartItems.product",
    select: "subCategoryId brandId categoryId images title",
  });
  res.status(201).json({ statsMessage: "success", data });
});

const checkOutSession = catchError(async () => {
  let { cartId } = req.params;
  const token = req.header("token");
  if (!token) {
    return res.status(404).json({ message: "No token provided" });
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  if (!decoded) {
    return res
      .status(400)
      .json({ statsMessage: "fail", message: "invalid token" });
  }
  const cart = await cartModel.findById(cartId);
  if (!cart) {
    return res
      .status(404)
      .json({ message: `there is no cart for this user : ${userId}` });
  }
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "{{PRICE_ID}}",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://fresh-cart-e-commerce-api.vercel.app/success",
    cancel_url: `https://fresh-cart-e-commerce-api.vercel.app/api/v1/cart`,
  });
});

export { addCashOrder, getAllUserOrders };
