import mongoose from "mongoose";

const toolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, enum: ["hr", "day"], default: "hr" },
    deposit: { type: Number, default: 2500 },
    dist: { type: String, default: "1.0 km" },
    rating: { type: Number, default: 4.7 },
    reviews: { type: Number, default: 0 },
    img: { type: String, default: "" },
    verified: { type: Boolean, default: true },
    // For this MVP every tool belongs to a single shared provider pool.
    // Add an `owner` ref to User here once providers can list their own tools.
  },
  { timestamps: true }
);

export default mongoose.model("Tool", toolSchema);
