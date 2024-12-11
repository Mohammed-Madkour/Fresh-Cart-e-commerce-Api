
import mongoose from "mongoose";

const AuthSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minLength: [5, "too weak password"],
    },
    rePassword: {
      type: String,
      required: true,
      trim: true,
    },
    newPassword: {
      type: String,
      trim: true,
      minLength: [5, "too weak password"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    verified: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
  },
  {
    timestamps: true,
  }
);

export const AuthModel = mongoose.model("Auth", AuthSchema);
