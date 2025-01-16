import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AuthSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minLength: [5, "too weak password"],
    },
    rePassword: {
      type: String,
      required: true,
      trim: true,
    },
    newPassword: {
      type: String,
      trim: true,
      minLength: [5, "too weak password"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^01[0-9]{9}$/.test(v);
        },
        message: "This is not a valid phone number",
      },
    },
    verified: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
  },
  {
    timestamps: true,
  }
);

AuthSchema.pre("findOneAndUpdate", function () {
  console.log(this)
  this._update.password = bcrypt.hashSync(this._update.password, 10);
  this._update.rePassword = this._update.password;
});

AuthSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 10);
  this.rePassword = this.password;
});

export const AuthModel = mongoose.model("Auth", AuthSchema);
