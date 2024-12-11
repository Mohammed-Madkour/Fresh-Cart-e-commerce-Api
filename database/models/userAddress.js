import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: [3, "too short name"],
    },
    details: {
      type: String,
      trim: true,
      required: true,
      minLength: [5, "too short details"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxLength: [12, "This is not a valid phone Number"],
      minLength: [11, "This is not a vaild phone Number"],
    },
    city: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "too short city name"],
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("userAddress", userSchema);
