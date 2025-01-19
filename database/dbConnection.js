import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(
      "mongodb+srv://mohamedmadkour312:<m2291672>@cluster0.ekftryb.mongodb.net/"
    )
    .then(() => console.log("dataBase Connected"))
    .catch(() => console.log("dataBase didn't connect successfully"));
};
