import express from "express";
import {
  addCashOrder,
  getAllUserOrders,
} from "./orders.controller.js";

const ordersRouter = express.Router();

ordersRouter.post("/:cartId", addCashOrder);
ordersRouter.get("/", getAllUserOrders);

export { ordersRouter };
