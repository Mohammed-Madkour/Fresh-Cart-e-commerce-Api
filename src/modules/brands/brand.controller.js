import slugify from "slugify";
import { catchError } from "../../utils/catchError.js";
import { brandModel } from "../../../database/models/brands.js";
import { AppError } from "../../utils/ErrorMessage.js";

const addBrand = catchError(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  let data = new brandModel(req.body);
  await data.save();
  res.json({ statsMessage: "success", data });
});

const getAllBrands = catchError(async (req, res) => {
  // Pages
  let pageNumber = req.query.page * 1 || 1;
  pageNumber < 0 ? (pageNumber = 1) : pageNumber;
  let limit = 40;
  let skip = (pageNumber - 1) * limit;
  let totalItems = await brandModel.countDocuments();
  let results = totalItems;
  let pages = Math.ceil(totalItems / limit);
  let metaData = {
    results,
    pages,
    pageNumber,
    limit,
  };
  let data = brandModel.find().skip(skip).limit(limit);
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
  res.status(201).json({ statsMessage: "success", metaData, data: query });
});

const getOneBrand = catchError(async (req, res, next) => {
  let { id } = req.params;
  let data = await brandModel.findById(id);
  if (data === null) {
    return next(new AppError("Category not found", 404));
  }
  res.json({ statsMessage: "success", data });
});

const updateBrand = catchError(async (req, res, next) => {
  let { id } = req.params;
  req.body.slug = slugify(req.body.name);
  let data = await brandModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (data === null) {
    return next(new AppError("Brand not found", 404));
  }
  res.status(201).json({ statusMessage: "sucess", data });
});

const deleteBrand = catchError(async (req, res, next) => {
  let { id } = req.params;
  let data = await brandModel.findByIdAndDelete(id);
  if (data === null) {
    return next(new AppError("Brand not found", 404));
  }
  res.status(201).json({ statusMessage: "sucess", data });
});

export { addBrand, getAllBrands, getOneBrand,deleteBrand,updateBrand };
