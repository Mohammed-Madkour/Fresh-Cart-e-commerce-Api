import slugify from "slugify";
import { productModel } from "../../../database/models/products.js";
import { catchError } from "../../utils/catchError.js";

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
  let data = await productModel.find(filter);
  res.status(201).json({ statsMessage: "sucess", data });
});

const getOneProduct = catchError(async (req, res) => {
  let { id } = req.params;
  let data = await productModel.findById(id);
  res.status(201).json({ statsMessage: "sucess", data });
});
const updateProduct = catchError(async (req, res) => {
  let { id } = req.params;
  let data = await productModel.findByIdAndUpdate(id, req.body, { new: true });
  res.status(201).json({ statsMessage: "sucess", data });
});
const deleteProduct = catchError(async (req, res) => {
  let { id } = req.params;
  let data = await productModel.findByIdAndDelete(id);
  res.status(201).json({ statsMessage: "sucess", data });
});

export {
  addProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
