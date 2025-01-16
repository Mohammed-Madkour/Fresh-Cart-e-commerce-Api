import slugify from "slugify";
import { categoryModel } from "../../../database/models/category.js";
import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/ErrorMessage.js";

const addCategory = catchError(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  let data = new categoryModel(req.body);
  await data.save();
  res.status(201).json({ statsMessage: "sucess", data });
});

const getAllCategories = catchError(async (req, res) => {
  // Pagination
  let pageNumber = req.query.page * 1 || 1;
  pageNumber < 0 ? (pageNumber = 1) : pageNumber;
  let limit = 40;
  let skip = (pageNumber - 1) * limit;
  let totalItems = await categoryModel.countDocuments();
  let results = totalItems;
  let pages = Math.ceil(totalItems / limit);
  let metaData = {
    results,
    pages,
    pageNumber,
    limit,
  };
  let data = categoryModel.find().skip(skip).limit(limit);
  // Sort
  if (req.query.sort) {
    let sortData = req.query.sort.split(",").join(" ");
    data.sort(sortData);
  }
  // Fields
  if (req.query.fields) {
    let field = req.query.fields.split(",").join(" ");
    data.select(field).sort(field);
  }
  // Search
  if (req.query.search) {
    data.find({ name: { $regex: req.query.search, $options: "i" } });
  }
  let query = await data;
  return res.status(201).json({ statsMessage: "sucess", metaData, data:query });
});

const getOneCategory = catchError(async (req, res, next) => {
  let { id } = req.params;
  let data = await categoryModel.findById(id);
  if (data === null) {
    return next(new AppError("Category not found", 404));
  }
  res.status(201).json({ statsMessage: "sucess", data });
});

const updateCategory = catchError(async (req, res, next) => {
  let { id } = req.params;
  req.body.slug = slugify(req.body.name);
  let data = await categoryModel.findByIdAndUpdate(id, req.body, { new: true });
  if (data === null) {
    return next(new AppError("Category not found", 404));
  }
  res.status(201).json({ statsMessage: "sucess", data });
});

const deleteCategory = catchError(async (req, res, next) => {
  let { id } = req.params;
  let data = await categoryModel.findByIdAndDelete(id);
  if (data === null) {
    return next(new AppError("Category not found", 404));
  }
  res.status(201).json({ statsMessage: "sucess", data });
});

export {
  addCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
};
