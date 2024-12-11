import express from "express";
import {
  deleteUser,
  getAllUsers,
  signIn,
  signUp,
  updateUser,
  updateUserPassword,
  verifyToken,
} from "./userAuth.controller.js";
import { validate } from "../../middleWare/validate.js";
import {
  addAuthValidation,
  updateAuthValidation,
  updatePasswordAuthValidation,
} from "./userAuth.validation.js";

const userAuthRouter = express.Router();

userAuthRouter.post("/api/v1/signup", validate(addAuthValidation), signUp);
userAuthRouter.post("/api/v1/signin", signIn);
userAuthRouter.put(
  "/api/v1/users/update",
  validate(updateAuthValidation),
  updateUser
);
userAuthRouter.put(
  "/api/v1/users/updatePassword",
  validate(updatePasswordAuthValidation),
  updateUserPassword
);
userAuthRouter.get("/api/v1/users", getAllUsers);
userAuthRouter.get("/api/v1/auth/verify", verifyToken);
userAuthRouter.delete("/api/v1/users/delete/:id", deleteUser);

export { userAuthRouter };
