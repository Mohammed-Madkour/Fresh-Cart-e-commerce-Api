import express from "express";
import {
  addAddress,
  deleteAddress,
  getAllAddresses,
  getSpecficAddress,
} from "./userAddress.controller.js";

const addressRouter = express.Router();

addressRouter.post("/", addAddress);
addressRouter.get("/", getAllAddresses);
addressRouter.get("/:id", getSpecficAddress);
addressRouter.delete("/:addressId", deleteAddress);

export { addressRouter };
