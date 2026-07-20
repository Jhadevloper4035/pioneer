const mongoose = require("mongoose");

const decorativeFilmSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    image: { type: String, required: true, trim: true },
    finish: { type: String, trim: true, maxlength: 80 },
    texture: { type: String, trim: true, maxlength: 120 },
    application: { type: String, trim: true, maxlength: 180 },
    rollSize: { type: String, trim: true, maxlength: 40 },
    thickness: { type: String, trim: true, maxlength: 40 },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

decorativeFilmSchema.index({ active: 1, order: 1, name: 1 });

module.exports = mongoose.model("DecorativeFilm", decorativeFilmSchema);
