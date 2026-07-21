const mongoose = require("mongoose");

const siteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true, unique: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("SiteSetting", siteSettingSchema);
