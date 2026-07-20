const mongoose = require("mongoose");

const catalogueSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 300 },
    coverImage: { type: String, required: true, trim: true },
    file: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

catalogueSchema.index({ active: 1, order: 1, title: 1 });

module.exports = mongoose.model("Catalogue", catalogueSchema);
