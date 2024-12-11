import Joi from "joi";

const addProductValidation = Joi.object({
  title: Joi.string().min(3).max(20).required(),
  price: Joi.number().min(0).required(),
  description: Joi.number().min(0).required(),
});
const updateProductValidation = Joi.object({
  title: Joi.string().min(3).max(20).required(),
  price: Joi.number().min(0),
  description: Joi.number().min(0),
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
