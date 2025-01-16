import express from "express";
import {
  allowedTo,
  deleteUser,
  getAllUsers,
  protectRoutes,
  signIn,
  signUp,
  updateUser,
  updateUserPassword,
  verifyToken,
} from "./Auth.controller.js";
import { validate } from "../../middleWare/validate.js";
import {
  addAuthValidation,
  updateAuthValidation,
  updatePasswordAuthValidation,
} from "./Auth.validation.js";

const userAuthRouter = express.Router();

userAuthRouter.post("/api/v1/signup", validate(addAuthValidation), signUp);
userAuthRouter.post("/api/v1/signin", signIn);
userAuthRouter.put(
  "/api/v1/users/update",
  protectRoutes,
  allowedTo("user"),
  validate(updateAuthValidation),
  updateUser
);
userAuthRouter.patch(
  "/api/v1/users/updatePassword",
  protectRoutes,
  allowedTo("user"),
  validate(updatePasswordAuthValidation),
  updateUserPassword
);
userAuthRouter.get(
  "/api/v1/users",
  protectRoutes,
  allowedTo("admin"),
  getAllUsers
);
userAuthRouter.get("/api/v1/auth/verify", verifyToken);
userAuthRouter.delete("/api/v1/users/delete/:id", deleteUser);

export { userAuthRouter };
