const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      enum: ["homepage", "contact", "product", "catalogue"]
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 40 },
    company: { type: String, trim: true, maxlength: 120 },
    city: { type: String, trim: true, maxlength: 80 },
    product: { type: String, trim: true, maxlength: 160 },
    productCategories: [{ type: String, trim: true, maxlength: 120 }],
    quantity: { type: String, trim: true, maxlength: 40 },
    unit: { type: String, trim: true, maxlength: 40 },
    application: { type: String, trim: true, maxlength: 80 },
    message: { type: String, trim: true, maxlength: 1000 },
    comments: { type: String, trim: true, maxlength: 1000 },
    ipAddress: String,
    userAgent: String
  },
  {
    timestamps: true,
    versionKey: false
  }
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ email: 1, createdAt: -1 });
enquirySchema.index({ source: 1, createdAt: -1 });

module.exports = mongoose.model("Enquiry", enquirySchema);
