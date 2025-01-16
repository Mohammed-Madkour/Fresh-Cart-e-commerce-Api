import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: [3, "too short name"],
    },
    details: {
      type: String,
      trim: true,
      required: true,
      minLength: [5, "too short details"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^01[0-9]{9}$/.test(v);
        },
        message: "This is not a valid phone number",
      },
    },
    city: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "too short city name"],
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("userAddress", userSchema);
