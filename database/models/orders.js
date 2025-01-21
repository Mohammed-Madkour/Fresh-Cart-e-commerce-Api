import mongoose from "mongoose";

const ordersSchema = mongoose.Schema({
  shippingAddress: {
    details: {
      type: String,
      required: true,
      trim: true,
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
    },
  },
  taxPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  shippingPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalOrderPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  paymentMethodType: {
    type: String,
    default: "cash",
    enum: ["cash", "visa"],
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Auth",
    required: true,
  },
  cartId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "cart",
  },
  cartItems: [
    {
      count: { type: Number, required: true },
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
        required: true,
      },
    },
  ],
});

export const ordersModel = mongoose.model("Orders", ordersSchema);
