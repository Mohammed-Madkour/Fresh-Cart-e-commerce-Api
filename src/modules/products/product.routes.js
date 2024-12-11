import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
} from "./product.controller.js";
import { validate } from "../../middleWare/validate.js";
import {
  addProductValidation,
  deleteProductValidation,
  updateProductValidation,
} from "./products.validation.js";

const ProductRouter = express.Router();

ProductRouter.post("/", validate(addProductValidation), addProduct);
ProductRouter.get("/", getAllProducts);
ProductRouter.get("/:id", getOneProduct);
ProductRouter.get("/:id", validate(updateProductValidation), updateProduct);
ProductRouter.get("/:id", validate(deleteProductValidation), deleteProduct);

export { ProductRouter };
