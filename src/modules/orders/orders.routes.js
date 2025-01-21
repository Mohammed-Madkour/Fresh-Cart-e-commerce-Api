import express from "express";
import {
  addCashOrder,
  checkOutSession,
  getAllUserOrders,
} from "./orders.controller.js";
import { protectRoutes } from "../Authentication/Auth.controller.js";

const ordersRouter = express.Router();

ordersRouter.post("/:cartId",protectRoutes, addCashOrder);
ordersRouter.post("/checkoutsession/:cartId", protectRoutes, checkOutSession);
ordersRouter.get("/", protectRoutes, getAllUserOrders);

export { ordersRouter };
