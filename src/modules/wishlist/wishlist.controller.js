import { catchError } from "../../utils/catchError.js";
import { wishModel } from "../../../database/models/wishList.js";
import jwt from "jsonwebtoken";
import { productModel } from "../../../database/models/products.js";

const addWish = catchError(async (req, res) => {
  let { productId } = req.body;
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
  const productExists = await productModel.findById(productId);
  if (!productExists) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "Product not found" });
  }
  let data = new wishModel({ productId, userId });
  await data.save();
  res.status(201).json({ statsMessage: "success", data });
});

const getAllWishLists = catchError(async (req, res) => {
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
  let data = await wishModel.find({ userId }).populate({
    path: "productId",
    select: "subCategoryId brandId categoryId images title",
  });
  res.status(201).json({ statsMessage: "success", data });
});

const deleteProduct = catchError(async (req, res) => {
  let { wishId } = req.params;
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
  const wishExists = await wishModel.findById(wishId);
  if (!wishExists) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "Product not found" });
  }
  let data = await wishModel.findByIdAndDelete(wishId).select("id");
  res.status(201).json({
    statsMessage: "success",
    message: "product removed from wishlist successfully",
    data,
  });
});

export { addWish, getAllWishLists, deleteProduct };
