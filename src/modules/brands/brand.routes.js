import express from "express";
import { addBrand, getAllBrands, getOneBrand } from "./brand.controller.js";
import { ProductRouter } from "../products/product.routes.js";

const brandRouter = express.Router();

brandRouter.use("/:brandId/products", ProductRouter);

brandRouter.post("/", addBrand);
brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getOneBrand);

export { brandRouter };
