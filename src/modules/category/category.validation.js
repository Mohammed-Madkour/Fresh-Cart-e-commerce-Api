import Joi from "joi";

const addCategoryValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  image: Joi.string().required(),
});
const updateCategoryValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  id: Joi.string().hex().length(24).required(),
});
const deleteCategoryValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export {
  updateCategoryValidation,
  deleteCategoryValidation,
  addCategoryValidation,
};
