import { catchError } from "../../utils/catchError.js";
import { ordersModel } from "../../../database/models/orders.js";
import { cartModel } from "../../../database/models/cart.js";
import stripe from "stripe";
import { AppError } from "../../utils/ErrorMessage.js";

const addCashOrder = catchError(async (req, res, next) => {
  let { cartId } = req.params;
  let userId = req.user.id;
  const cart = await cartModel.findById(cartId);
  if (!cart) {
    return new AppError(`there is no cart for this user : ${userId}`, 404);
  }
  let cartItems = cart.products;
  let totalOrderPrice = cart.totalCartPrice;
  let data = new ordersModel({
    shippingAddress: req.body.shippingAddress,
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

const checkOutSession = catchError(async (req, res, async) => {
  let { cartId } = req.params;
  const cart = await cartModel.findById(cartId);
  if (!cart) {
    return new AppError(`there is no cart for this user : ${userId}`, 404);
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
