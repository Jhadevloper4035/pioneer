const mongoose = require("mongoose");

const seoPageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      maxlength: 180
    },
    routePath: {
      type: String,
      trim: true,
      maxlength: 220
    },
    pageTitle: {
      type: String,
      trim: true,
      maxlength: 180
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 180
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 320
    },
    keywords: {
      type: [String],
      default: []
    },
    canonicalUrl: {
      type: String,
      trim: true,
      maxlength: 300
    },
    canonicalPath: {
      type: String,
      trim: true,
      maxlength: 220
    },
    robots: {
      type: String,
      trim: true,
      default: "index, follow",
      maxlength: 80
    },
    noindex: {
      type: Boolean,
      default: false
    },
    nofollow: {
      type: Boolean,
      default: false
    },
    ogTitle: {
      type: String,
      trim: true,
      maxlength: 180
    },
    ogDescription: {
      type: String,
      trim: true,
      maxlength: 320
    },
    ogImage: {
      type: String,
      trim: true,
      maxlength: 300
    },
    ogType: {
      type: String,
      trim: true,
      default: "website",
      maxlength: 40
    },
    twitterCard: {
      type: String,
      trim: true,
      default: "summary_large_image",
      maxlength: 60
    },
    twitterTitle: {
      type: String,
      trim: true,
      maxlength: 180
    },
    twitterDescription: {
      type: String,
      trim: true,
      maxlength: 320
    },
    twitterImage: {
      type: String,
      trim: true,
      maxlength: 300
    },
    schemaJson: {
      type: mongoose.Schema.Types.Mixed
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

seoPageSchema.index({ active: 1, slug: 1 });

module.exports = mongoose.model("SeoPage", seoPageSchema);
