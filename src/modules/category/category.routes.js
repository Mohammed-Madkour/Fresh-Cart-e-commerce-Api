import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
} from "./category.controller.js";
import { subCategoryRouter } from "../subCategory/subCategory.routes.js";
import { validate } from "../../middleWare/validate.js";
import {
  addCategoryValidation,
  deleteCategoryValidation,
  updateCategoryValidation,
} from "./category.validation.js";
import { allowedTo, protectRoutes } from "../Authentication/Auth.controller.js";

const categoryRouter = express.Router();

categoryRouter.use("/:categoryId/subCategory", subCategoryRouter);

categoryRouter.post(
  "/",
  protectRoutes,
  allowedTo("admin"),
  validate(addCategoryValidation),
  addCategory
);
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getOneCategory);
categoryRouter.put("/:id", validate(updateCategoryValidation), updateCategory);
categoryRouter.delete(
  "/:id",
  validate(deleteCategoryValidation),
  deleteCategory
);

export { categoryRouter };
