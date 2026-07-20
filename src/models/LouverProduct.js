const mongoose = require("mongoose");

const louverProductSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    mainImage: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    summary: {
      type: String,
      trim: true,
      maxlength: 400
    },
    gallery: [{ type: String, trim: true }],
    applications: [{
      name: { type: String, trim: true, maxlength: 120 },
      image: { type: String, trim: true }
    }],
    productInformation: [{
      label: { type: String, trim: true, maxlength: 80 },
      value: { type: String, trim: true, maxlength: 120 }
    }],
    specifications: {
      width_mm: Number,
      height_mm: Number,
      length_mm: Number,
      no_of_flutes: mongoose.Schema.Types.Mixed,
      approx_weight_per_panel_kg: Number
    },
    active: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

louverProductSchema.index({ active: 1, order: 1, productId: 1 });
module.exports = mongoose.model("LouverProduct", louverProductSchema);
