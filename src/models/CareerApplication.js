const mongoose = require("mongoose");

const careerApplicationSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true, maxlength: 120 },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    experience: { type: String, required: true, trim: true, maxlength: 80 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    message: { type: String, trim: true, maxlength: 1000 },
    resume: {
      data: { type: Buffer, required: true },
      filename: { type: String, required: true, trim: true },
      originalName: { type: String, required: true, trim: true },
      mimetype: { type: String, required: true, trim: true },
      size: { type: Number, required: true }
    },
    ipAddress: String,
    userAgent: String
  },
  {
    timestamps: true,
    versionKey: false
  }
);

careerApplicationSchema.index({ createdAt: -1 });
careerApplicationSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model("CareerApplication", careerApplicationSchema);
