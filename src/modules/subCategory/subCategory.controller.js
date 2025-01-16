import slugify from "slugify";
import { catchError } from "../../utils/catchError.js";
import { subCategoryModel } from "../../../database/models/subCategory.js";
import { AppError } from "../../utils/ErrorMessage.js";

const addSubCategory = catchError(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  let data = new subCategoryModel(req.body);
  await data.save();
  res.json({ statusMessage: "success", data });
});

const getAllSubCategories = catchError(async (req, res) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { categoryId: req.params.categoryId };
  }
  // Pages
  let pageNumber = req.query.page * 1 || 1;
  pageNumber < 0 ? (pageNumber = 1) : pageNumber;
  let limit = 40;
  let skip = (pageNumber - 1) * limit;
  let totalItems = await subCategoryModel.countDocuments(filter);
  let results = totalItems;
  let pages = Math.ceil(totalItems / limit);
  let metaData = {
    results,
    pages,
    pageNumber,
    limit,
  };
  let data = subCategoryModel.find(filter).skip(skip).limit(limit);
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
  res.status(201).json({ statusMessage: "success", metaData, data: query });
});

const getOneSubCategory = catchError(async (req, res) => {
  let { id } = req.params;
  let data = await subCategoryModel.findById(id);
  res.json({ statusMessage: "success", data });
});

const updatesubCategory = catchError(async (req, res, next) => {
  let { id } = req.params;
  req.body.slug = slugify(req.body.name);
  let data = await subCategoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (data === null) {
    return next(new AppError("subCategory not found", 404));
  }
  res.status(201).json({ statusMessage: "sucess", data });
});

const deletesubCategory = catchError(async (req, res, next) => {
  let { id } = req.params;
  let data = await subCategoryModel.findByIdAndDelete(id);
  if (data === null) {
    return next(new AppError("subCategory not found", 404));
  }
  res.status(201).json({ statusMessage: "sucess", data });
});

export {
  addSubCategory,
  getAllSubCategories,
  getOneSubCategory,
  updatesubCategory,
  deletesubCategory,
};
