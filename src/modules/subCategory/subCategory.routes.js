import express from "express";
import {
  addSubCategory,
  getAllSubCategories,
  getOneSubCategory,
} from "./subCategory.controller.js";
import { ProductRouter } from "../products/product.routes.js";

export const subCategoryRouter = express.Router({mergeParams: true});

subCategoryRouter.use("/:subCategoryId/products", ProductRouter);

subCategoryRouter.post("/", addSubCategory);
subCategoryRouter.get("/", getAllSubCategories);
subCategoryRouter.get("/:id", getOneSubCategory);
