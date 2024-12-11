import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/FreshCart-e-commerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000,
    })
    .then(() => console.log("dataBase Connected"))
    .catch(() => console.log("dataBase didn't connect successfully"));
};
