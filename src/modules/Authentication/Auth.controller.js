import { catchError } from "../../utils/catchError.js";
import { AuthModel } from "../../../database/models/Authentication.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/ErrorMessage.js";

const signUp = catchError(async (req, res, next) => {
  let data = new AuthModel(req.body);
  if (data.password === data.rePassword) {
    let token = jwt.sign({ id: data.id, name: data.name }, "Mo@2291672123456");
    await data.save();
    return res
      .status(201)
      .json({ statsMessage: "success", users: data, token });
  } else {
    next(new AppError("Password conformation is incorrect", 400));
  }
});

const signIn = catchError(async (req, res, next) => {
  let { email, password } = req.body;
  let data = await AuthModel.findOne({ email });
  if (data) {
    const hash = bcrypt.compareSync(password, data.password);
    if (hash) {
      let token = jwt.sign(
        { id: data.id, name: data.name },
        "Mo@2291672123456"
      );
      return res.status(201).json({
        statsMessage: "success",
        message: "logged in successfully",
        token,
      });
    } else {
      return next(new AppError("Password is incorrect", 400));
    }
  } else {
    return next(new AppError("Email doesn't exist", 400));
  }
});

const getAllUsers = catchError(async (req, res, next) => {
  let data = await AuthModel.find({}).select("name email");
  res.status(201).json({ statsMessage: "success", users: data });
});

const verifyToken = catchError(async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return next(new AppError("Token not provided", 404));
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  if (!decoded) {
    return next(new AppError("Expired token", 403));
  }
  let userId = decoded.id;
  let user = await AuthModel.findByIdAndUpdate(
    userId,
    { verified: true },
    { new: true }
  );
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    statusMessage: "success",
    message: "Token verified successfully",
    user,
  });
});

const updateUser = catchError(async (req, res, next) => {
  let { name, email } = req.body;
  console.log(req.user.id);
  const updateData = await AuthModel.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true }
  );
  if (!updateData) {
    return next(new AppError("User not found", 404));
  }
  res.status(201).json({
    statusMessage: "success",
    message: "User updated successfully",
    user: updateData,
  });
});

const updateUserPassword = catchError(async (req, res, next) => {
  let { password, rePassword, currentPassword } = req.body;
  if (password !== rePassword) {
    return next(new AppError("Passwords are incorrect", 400));
  }
  let user = await AuthModel.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError("currentPassword is incorrect", 404));
  }
  const updateData = await AuthModel.findOneAndUpdate(
    { _id: req.user.id },
    {
      password,
      rePassword,
    },
    { new: true }
  ).select("name password role updatedAt");
  if (!updateData) {
    next(new AppError("Failed to update password", 400));
  }
  res.status(201).json({ statsMessage: "success", user: updateData });
});

const deleteUser = catchError(async (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    return next(new AppError("No token provided", 404));
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  let user = await AuthModel.findByIdAndDelete(decoded.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(201).json({ statsMessage: "success", user });
});

const protectRoutes = catchError(async (req, res, next) => {
  let token = req.headers.token;
  let userPayload = null;
  if (!token) return next(new AppError("No token provided", 404));
  jwt.verify(token, "Mo@2291672123456", (error, payload) => {
    if (error) return next(new AppError(error, 400));
    userPayload = payload;
  });
  let user = await AuthModel.findById(userPayload.id);
  if (!user) return new AppError("User not found", 404);
  req.user = user;
  next();
});

const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    } else {
      return next(new AppError("You are not allowed to access", 401));
    }
  });
};

export {
  signUp,
  getAllUsers,
  signIn,
  verifyToken,
  updateUser,
  updateUserPassword,
  deleteUser,
  protectRoutes,
  allowedTo,
};
