import slugify from "slugify";
import { categoryModel } from "../../../database/models/category.js";
import { catchError } from "../../utils/catchError.js";

const addCategory = catchError(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  let data = new categoryModel(req.body);
  await data.save();
  res.status(201).json({ statsMessage: "sucess", data });
});

const getAllCategories = catchError(async (req, res) => {
  let data = await categoryModel.find({});
  let result = data.length;
  let limit = 40;
  if (data.length > limit) {
    data.length = limit;
  }
  let metaData = {
    result,
    limit,
  };
  return res.status(201).json({ statsMessage: "sucess", metaData, data });
});

const getOneCategory = catchError(async (req, res) => {
  let { id } = req.params;
  let data = await categoryModel.findById(id);
  return res.status(201).json({ statsMessage: "sucess", data });
});

const updateCategory = catchError(async (req, res) => {
  let { id } = req.params;
  req.body.slug = slugify(req.body.name);
  let data = await categoryModel.findByIdAndUpdate(id, req.body, { new: true });
  return res.status(201).json({ statsMessage: "sucess", data });
});

const deleteCategory = catchError(async (req, res) => {
  let { id } = req.params;
  let data = await categoryModel.findByIdAndDelete(id);
  return res.status(201).json({ statsMessage: "sucess", data });
});

export {
  addCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
};
