import express from "express";
import { categoryRouter } from "./src/modules/category/category.routes.js";
import { dbConnection } from "./database/dbConnection.js";
import { subCategoryRouter } from "./src/modules/subCategory/subCategory.routes.js";
import { brandRouter } from "./src/modules/brands/brand.routes.js";
import { ProductRouter } from "./src/modules/products/product.routes.js";
import { userAuthRouter } from "./src/modules/userAuth/userAuth.routes.js";
import { wishRouter } from "./src/modules/wishlist/wishlist.routes.js";
import { addressRouter } from "./src/modules/userAddress/userAddress.routes.js";
import { cartRouter } from "./src/modules/cart/cart.routes.js";
import { ordersRouter } from "./src/modules/orders/orders.routes.js";

const app = express();

app.use(express.json());

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

app.use((error, req, res, next) => {
  res.status(400).json(error);
});

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.listen(3000, () => {
  console.log("Server Connected Successfully");
});
