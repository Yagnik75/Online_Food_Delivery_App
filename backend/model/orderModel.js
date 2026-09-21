// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//     {
//         customerId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Customer",
//             required: true,
//         },
//         // NEW: Track which seller this order belongs to
//         sellerId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Seller",
//             required: true,
//         },
//         items: [
//             {
//                 productId: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     ref: "Product",
//                 },
//                 name: String,
//                 quantity: Number,
//                 price: Number,
//             },
//         ],
//         totalAmount: {
//             type: Number,
//             required: true,
//         },
//         status: {
//             type: String,
//             enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
//             default: "Pending",
//         },
//         deliveryAddress: {
//             type: String,
//             required: [true, "Delivery address is required"],
//         },
//     },
//     { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    }, // NEW: For multi-vendor
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
      default: "Pending",
    },
    deliveryAddress: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);