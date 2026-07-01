const mongoose = require("mongoose");

const catalogueLeadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 120
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40
    },
    company: {
      type: String,
      trim: true,
      maxlength: 120
    },
    city: {
      type: String,
      trim: true,
      maxlength: 80
    },
    interestedCatalogue: {
      type: String,
      trim: true,
      maxlength: 120
    },
    ipAddress: String,
    userAgent: String
  },
  {
    timestamps: true,
    versionKey: false
  }
);

catalogueLeadSchema.index({ createdAt: -1 });
catalogueLeadSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model("CatalogueLead", catalogueLeadSchema);
