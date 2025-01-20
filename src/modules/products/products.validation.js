import Joi from "joi";

const addProductValidation = Joi.object({
  title: Joi.string().min(3).max(500).required(),
  price: Joi.number().min(0).required(),
  priceAfterDiscount: Joi.number().min(0),
  description: Joi.string().min(0).required(),
  sold: Joi.number().min(0),
  quantity: Joi.number().min(0),
  images: Joi.array(),
  imageCover: Joi.string(),
  ratingsQuantity: Joi.number(),
  categoryId: Joi.string(),
  brandId: Joi.string(),
  subCategoryId: Joi.string(),
  ratingAvg: Joi.number(),
});
const updateProductValidation = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  price: Joi.number().min(0),
  priceAfterDiscount: Joi.number().min(0),
  description: Joi.string().min(0),
  sold: Joi.number().min(0),
  quantity: Joi.number().min(0),
  images: Joi.array(),
  imageCover: Joi.string(),
  ratingsQuantity: Joi.number().min(0),
  categoryId: Joi.string(),
  brandId: Joi.string(),
  subCategoryId: Joi.string(),
  ratingAvg: Joi.number().min(0),
  id: Joi.string().hex().length(24).required(),
});
const deleteProductValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export {
  updateProductValidation,
  deleteProductValidation,
  addProductValidation,
};
