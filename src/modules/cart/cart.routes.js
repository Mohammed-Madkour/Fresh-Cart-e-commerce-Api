import express from "express";
import {
  addCart,
  deleteCart,
  deleteSpecificProduct,
  getAllCartItems,
  updateCartQuantity,
} from "./cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/", addCart);
cartRouter.get("/", getAllCartItems);
cartRouter.put("/:productId", updateCartQuantity);
cartRouter.delete("/user/:productId", deleteSpecificProduct);
cartRouter.delete("/:cartId", deleteCart);

export { cartRouter };
