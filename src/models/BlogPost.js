const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    category: { type: String, required: true, trim: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    image: { type: String, required: true, trim: true },
    alt: { type: String, trim: true, maxlength: 200 },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

blogPostSchema.index({ active: 1, order: 1, title: 1 });

module.exports = mongoose.model("BlogPost", blogPostSchema);
