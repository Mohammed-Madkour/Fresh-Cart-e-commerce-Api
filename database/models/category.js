import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    type: Object,
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [2, "too short category name"],
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

export const categoryModel = mongoose.model("category", categorySchema);
