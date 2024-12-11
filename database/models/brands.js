import mongoose from "mongoose";

const brandSchmea = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLenght: [2, "too short brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const brandModel = mongoose.model("brand", brandSchmea);
