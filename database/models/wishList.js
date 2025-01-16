import mongoose from "mongoose";

const wishSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "product",
      required: true,
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

export const wishModel = mongoose.model("wish", wishSchema);
