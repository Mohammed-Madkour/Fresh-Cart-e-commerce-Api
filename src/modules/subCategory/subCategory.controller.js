import slugify from "slugify";
import { catchError } from "../../utils/catchError.js";
import { subCategoryModel } from "../../../database/models/subCategory.js";

const addSubCategory = catchError(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  let data = new subCategoryModel(req.body);
  await data.save();
  res.json({ statsMessage: "success", data });
});

const getAllSubCategories = catchError(async (req, res) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { categoryId: req.params.categoryId };
  }
  let data = await subCategoryModel.find(filter);

  let result = data.length;
  let limit = 40;
  if (data.length > limit) {
    data.length = limit;
  }
  let metaData = {
    result,
    limit,
  };

  res.status(201).json({ statsMessage: "success", metaData, data });
});

const getOneSubCategory = catchError(async (req, res) => {
  let { id } = req.params;
  let data = await subCategoryModel.findById(id);
  res.json({ statsMessage: "success", data });
});

export { addSubCategory, getAllSubCategories, getOneSubCategory };
