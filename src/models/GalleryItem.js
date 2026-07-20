const mongoose = require("mongoose");

const galleryItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["gallery", "infrastructure"],
      index: true
    },
    image: { type: String, required: true, trim: true },
    thumb: { type: String, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

galleryItemSchema.index({ type: 1, active: 1, order: 1 });

module.exports = mongoose.model("GalleryItem", galleryItemSchema);
