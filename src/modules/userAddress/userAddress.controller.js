import { catchError } from "../../utils/catchError.js";
import jwt from "jsonwebtoken";
import { userModel } from "../../../database/models/userAddress.js";

const addAddress = catchError(async (req, res) => {
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
  const userId = decoded.id;
  let data = new userModel({
    shippingAddress: req.body.shippingAddress,
    userId,
  });
  await data.save();
  res.status(201).json({ statsMessage: "success", data });
});

const getAllAddresses = catchError(async (req, res) => {
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
  let data = await userModel.find({ userId });
  res.status(201).json({ statsMessage: "success", data });
});

const getSpecficAddress = catchError(async (req, res) => {
  let { id } = req.params;
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
  let data = await userModel.findById(id);
  res.status(201).json({ statsMessage: "success", data });
});

const deleteAddress = catchError(async (req, res) => {
  let { addressId } = req.params;
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
  const addressExists = await userModel.findById(addressId);
  if (!addressExists) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "Product not found" });
  }
  let data = await userModel.findByIdAndDelete(addressId).select("id");
  res.status(201).json({
    statsMessage: "success",
    message: "User address removed successfully",
    data,
  });
});

export { addAddress, getAllAddresses, getSpecficAddress, deleteAddress };
