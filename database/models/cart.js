import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Auth",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        count: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
      },
    ],
    totalCartPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("find", function (next) {
  this.populate("products.product","categoryId brandId subCategoryId")
  next();
});

export const cartModel = mongoose.model("cart", cartSchema);
