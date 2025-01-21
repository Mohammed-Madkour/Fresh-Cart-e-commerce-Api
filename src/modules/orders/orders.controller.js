import { catchError } from "../../utils/catchError.js";
import jwt from "jsonwebtoken";
import { ordersModel } from "../../../database/models/orders.js";
import { cartModel } from "../../../database/models/cart.js";
import stripe from "stripe";

const addCashOrder = catchError(async (req, res) => {
  let { totalOrderPrice } = req.body.totalOrderPrice;
  let { cartId } = req.params;
  let userId = req.user.id;
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
  let userId = req.user.id;
  let data = await ordersModel.find({ userId }).populate({
    path: "cartItems.product",
    select: "subCategoryId brandId categoryId images title",
  });
  res.status(201).json({ statsMessage: "success", data });
});

const checkOutSession = catchError(async () => {
  let { cartId } = req.params;
  const cart = await cartModel.findById(cartId);
  if (!cart) {
    return res
      .status(404)
      .json({ message: `there is no cart for this user : ${userId}` });
  }
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        currency: "egp",
        unit_amount: cart.products.price,
        product_data: {
          name: cart.products.product,
        },
        quantity: cart.products.count,
      },
    ],
    mode: "payment",
    success_url: "https://fresh-cart-e-commerce-api.vercel.app/success",
    cancel_url: `https://fresh-cart-e-commerce-api.vercel.app/api/v1/cart`,
    customer_email: req.user.email,
    client_refrence_id: req.params.id,
  });
  res.status(200).json({ statusMessage: "success", session });
});

export { addCashOrder, getAllUserOrders, checkOutSession };
