const mongoose = require("mongoose");

const louverShadeSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    image: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

louverShadeSchema.index({ active: 1, order: 1, name: 1 });

module.exports = mongoose.model("LouverShade", louverShadeSchema);
