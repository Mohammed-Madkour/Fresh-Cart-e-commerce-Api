import { catchError } from "../../utils/catchError.js";
import jwt from "jsonwebtoken";
import { ordersModel } from "../../../database/models/orders.js";
import { cartModel } from "../../../database/models/cart.js";

// ###################################################
// كود يدوى مؤقت
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
  const cart = await cartModel.findById(cartId).populate({
    path: "products",
    populate: [
      { path: "category" },
      { path: "subCategory" },
      { path: "brand" },
    ],
  });
  if (!cart) {
    return res
      .status(404)
      .json({ message: `there is no cart for this user : ${userId}` });
  }

  let totalOrderPrice = cart.products.reduce((sum, item) => {
    return sum + item.price * item.count;
  }, 0);

  const orderData = {
    details: req.body.details,
    phone: req.body.phone,
    city: req.body.city,
    taxPrice: 0,
    shippingPrice: 0,
    totalOrderPrice,
    paymentMethodType: req.body.paymentMethodType || "cash",
    isPaid: false,
    isDelivered: false,
    userId,
    cartId,
    cartItems: cart.products,
  };

  const order = await ordersModel.create(orderData);

  await cartModel.findByIdAndDelete(cartId);
  res.status(201).json({ statsMessage: "success", data: order });
});

// ##############################################

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
  let result = data.length;
  let limit = 40;
  if (data.length > limit) {
    data.length = limit;
  }
  let metaData = {
    result,
    limit,
  };
  res.status(201).json({ statsMessage: "success", metaData, data });
});

export { addCashOrder, getAllUserOrders };
