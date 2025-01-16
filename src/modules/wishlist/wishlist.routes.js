import express from "express";
import {
  addWish,
  deleteProduct,
  getAllWishLists,
} from "./wishlist.controller.js";

const wishRouter = express.Router();

wishRouter.post("/", addWish);
wishRouter.delete("/:wishId", deleteProduct);
wishRouter.get("/", getAllWishLists);

export { wishRouter };
