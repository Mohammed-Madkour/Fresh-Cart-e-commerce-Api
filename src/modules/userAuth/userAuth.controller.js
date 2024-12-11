import { catchError } from "../../utils/catchError.js";
import { AuthModel } from "../../../database/models/Authentication.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const signUp = catchError(async (req, res) => {
  let data = new AuthModel(req.body);
  if (data.password === data.rePassword) {
    let token = jwt.sign({ id: data.id, name: data.name }, "Mo@2291672123456");
    const hash = bcrypt.hashSync(data.password, 10);
    data.password = hash;
    data.rePassword = hash;
    await data.save();
    return res
      .status(201)
      .json({ statsMessage: "success", users: data, token });
  } else {
    return res.status(400).json({
      statsMessage: "fail",
      message: "Password confirmation is incorrect",
    });
  }
});

const signIn = catchError(async (req, res) => {
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
      return res
        .status(400)
        .json({ statsMessage: "fail", message: "password incorrect" });
    }
  } else {
    return res
      .status(400)
      .json({ statsMessage: "fail", message: "email doesn't exist" });
  }
});

const getAllUsers = catchError(async (req, res) => {
  let data = await AuthModel.find({}).select("name email");
  let result = data.length;
  let limit = 40;
  if (data.length > limit) {
    data.length = limit;
  }
  let metaData = {
    result,
    limit,
  };
  res.status(201).json({ statsMessage: "success", metaData, users: data });
});

const verifyToken = catchError(async (req, res) => {
  const token = req.header("token");
  if (!token) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "No token provided" });
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  const userId = decoded.id;
  const updatedUser = await AuthModel.findByIdAndUpdate(
    userId,
    { verified: true },
    { new: true }
  ).select("name email role updatedAt");
  if (!updatedUser) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "User not found" });
  }
  res.status(201).json({ statsMessage: "success", user: updatedUser });
});

const updateUser = catchError(async (req, res) => {
  let { name, email } = req.body;
  const token = req.header("token");
  if (!token) {
    return res
      .status(400)
      .json({ statsMessage: "fail", message: "No token provided" });
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  const updateData = await AuthModel.findByIdAndUpdate(
    decoded.id,
    { name, email },
    {
      new: true,
    }
  ).select("name email role updatedAt");
  if (!updateData) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(201).json({ statsMessage: "success", user: updateData });
});

const updateUserPassword = catchError(async (req, res) => {
  let { password, rePassword, currentPassword } = req.body;
  if (password !== rePassword) {
    return res
      .status(400)
      .json({ statsMessage: "fail", message: "passwords are incorrect" });
  }
  const token = req.header("token");
  if (!token) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "No Token Provided" });
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  let user = await AuthModel.findById(decoded.id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      statsMessage: "fail",
      message: "currentPassword is incorrect",
    });
  }
  const hash = bcrypt.hashSync(password, 10);
  const updateData = await AuthModel.findByIdAndUpdate(
    decoded.id,
    {
      password: hash,
      rePassword: hash,
    },
    { new: true }
  ).select("name password role updatedAt");
  if (!updateData) {
    return res
      .status(404)
      .json({ statsMessage: "fail", message: "Failed to update password" });
  }
  res.status(201).json({ statsMessage: "success", user: updateData });
});

const deleteUser = catchError(async (req, res) => {
  const token = req.header("token");
  if (!token) {
    return res
      .status(400)
      .json({ statsMessage: "fail", message: "No token provided" });
  }
  const decoded = jwt.verify(token, "Mo@2291672123456");
  let user = await AuthModel.findByIdAndDelete(decoded.id);
  if (!user) {
    return res
      .status(404)
      .json({ statusMessage: "fail", message: "User not found" });
  }
  res.status(201).json({ statsMessage: "success", user });
});

export {
  signUp,
  getAllUsers,
  signIn,
  verifyToken,
  updateUser,
  updateUserPassword,
  deleteUser,
};
