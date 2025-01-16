import express from "express";
import {
  addSubCategory,
  deletesubCategory,
  getAllSubCategories,
  getOneSubCategory,
  updatesubCategory,
} from "./subCategory.controller.js";
import { ProductRouter } from "../products/product.routes.js";

export const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter.use("/:subCategoryId/products", ProductRouter);

subCategoryRouter.post("/", addSubCategory);
subCategoryRouter.get("/", getAllSubCategories);
subCategoryRouter.get("/:id", getOneSubCategory);
subCategoryRouter.put("/:id", updatesubCategory);
subCategoryRouter.delete("/:id", deletesubCategory);
