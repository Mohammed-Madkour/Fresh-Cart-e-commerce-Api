import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(
      "mongodb+srv://mohamedmadkour312:yJL7N6OTdsGJFQVi@cluster0.ekftryb.mongodb.net/FreshCart-e-commerce"
    )
    .then(() => console.log("dataBase Connected"))
    .catch(() => console.log("dataBase didn't connect successfully"));
};

// password : yJL7N6OTdsGJFQVi
