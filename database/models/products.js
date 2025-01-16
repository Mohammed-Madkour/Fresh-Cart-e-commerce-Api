import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minLenght: [2, "too short product name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "category",
      required: true,
    },
    brandId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "brand",
      required: true,
    },
    subCategoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "subCategory",
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [10, "too short description"],
      trim: true,
    },
    images: {
      type: [String],
    },
    imageCover: {
      type: String,
      required: true,
    },
    ratingsQuantity: {
      type: Number,
      min: 1,
    },
    ratingAvg: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre(/^find/, function (next) {
  this.populate("categoryId", "name slug image")
    .populate("brandId", "name slug image")
    .populate("subCategoryId", "name categoryId slug");
  next();
});

export const productModel = mongoose.model("product", productSchema);
