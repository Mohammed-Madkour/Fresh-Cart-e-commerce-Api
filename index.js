import express from "express";
import "dotenv/config";
import { categoryRouter } from "./src/modules/category/category.routes.js";
import { dbConnection } from "./database/dbConnection.js";
import { subCategoryRouter } from "./src/modules/subCategory/subCategory.routes.js";
import { brandRouter } from "./src/modules/brands/brand.routes.js";
import { ProductRouter } from "./src/modules/products/product.routes.js";
import { userAuthRouter } from "./src/modules/Authentication/Auth.routes.js";
import { wishRouter } from "./src/modules/wishlist/wishlist.routes.js";
import { addressRouter } from "./src/modules/userAddress/userAddress.routes.js";
import { cartRouter } from "./src/modules/cart/cart.routes.js";
import { ordersRouter } from "./src/modules/orders/orders.routes.js";
import { AppError } from "./src/utils/ErrorMessage.js";
import cors from "cors"

const app = express();

app.use(express.json());
app.use(cors())

dbConnection();

app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subCategory", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", ProductRouter);
app.use("/", userAuthRouter);
app.use("/api/v1/wishlist", wishRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", ordersRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Page not Found ${req.originalUrl}`, 404));
});
app.use((error, req, res, next) => {
  res.status(400).json({
    statusMessage: "fail",
    message: error.message,
    statusCode: error.statusCode || 400,
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server Connected Successfully");
});
