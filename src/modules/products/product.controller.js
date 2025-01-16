import slugify from "slugify";
import { productModel } from "../../../database/models/products.js";
import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/ErrorMessage.js";

const addProduct = catchError(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  let data = new productModel(req.body);
  await data.save();
  res.json({ message: "sucess", data });
});

const getAllProducts = catchError(async (req, res) => {
  let filter = {};
  if (req.params.subCategoryId) {
    filter = { subCategoryId: req.params.subCategoryId };
  }
  // Pagination
  let pageNumber = req.query.page * 1 || 1;
  pageNumber < 0 ? (pageNumber = 1) : pageNumber;
  let limit = 40;
  let skip = (pageNumber - 1) * limit;
  let totalItems = await productModel.countDocuments(filter);
  let results = totalItems;
  let pages = Math.ceil(totalItems / limit);
  let metaData = {
    results,
    pages,
    pageNumber,
    limit,
  };
  let data = productModel.find(filter).skip(skip).limit(limit);
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
    data.find({ title: { $regex: req.query.search, $options: "i" } });
  }
  let query = await data;
  res.status(201).json({ statsMessage: "sucess", metaData, data: query });
});
const getOneProduct = catchError(async (req, res) => {
  let { id } = req.params;
  let data = await productModel.findById(id);
  res.status(201).json({ statsMessage: "sucess", data });
});
const updateProduct = catchError(async (req, res,next) => {
  let { id } = req.params;
  let data = await productModel.findByIdAndUpdate(id, req.body, { new: true });
  if (data === null) {
    return next(new AppError("Product not found", 404));
  }
  res.status(201).json({ statsMessage: "sucess", data });
});
const deleteProduct = catchError(async (req, res,next) => {
  let { id } = req.params;
  let data = await productModel.findByIdAndDelete(id);
  if (data === null) {
    return next(new AppError("Product not found", 404));
  }
  res.status(201).json({ statsMessage: "sucess", data });
});

export {
  addProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
