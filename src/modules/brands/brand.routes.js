import express from "express";
import {
  addBrand,
  deleteBrand,
  getAllBrands,
  getOneBrand,
  updateBrand,
} from "./brand.controller.js";
import { ProductRouter } from "../products/product.routes.js";
import { validate } from "../../middleWare/validate.js";
import {
  addBrandValidation,
  deleteBrandValidation,
  updateBrandValidation,
} from "./brand.validation.js";

const brandRouter = express.Router();

brandRouter.use("/:brandId/products", ProductRouter);

brandRouter.post("/", validate(addBrandValidation), addBrand);
brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getOneBrand);
brandRouter.put("/:id", validate(updateBrandValidation), updateBrand);
brandRouter.delete("/:id", validate(deleteBrandValidation), deleteBrand);

export { brandRouter };
