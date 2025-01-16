import mongoose from "mongoose";

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [2, "too short subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    subCategoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "subCategory",
    },
  },
  {
    timestamps: true,
  }
);

export const subCategoryModel = mongoose.model(
  "subCategory",
  subCategorySchema
);
