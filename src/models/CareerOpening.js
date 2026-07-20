const mongoose = require("mongoose");

const careerOpeningSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    department: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    type: { type: String, required: true, trim: true, maxlength: 80 },
    experience: { type: String, required: true, trim: true, maxlength: 80 },
    summary: { type: String, required: true, trim: true, maxlength: 400 },
    responsibilities: [{ type: String, trim: true, maxlength: 240 }],
    requirements: [{ type: String, trim: true, maxlength: 240 }],
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

careerOpeningSchema.index({ active: 1, order: 1, title: 1 });

module.exports = mongoose.model("CareerOpening", careerOpeningSchema);
