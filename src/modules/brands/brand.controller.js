import slugify from "slugify";
import { catchError } from "../../utils/catchError.js";
import { brandModel } from "../../../database/models/brands.js";

const addBrand = catchError(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  let data = new brandModel(req.body);
  await data.save();
  res.json({ statsMessage: "success", data });
});

const getAllBrands = catchError(async (req, res) => {
  let data = await brandModel.find({});
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

const getOneBrand = catchError(async (req, res) => {
  let { id } = req.params;
  let data = await brandModel.findById(id);
  res.json({ statsMessage: "success", data });
});

export { addBrand, getAllBrands, getOneBrand };
