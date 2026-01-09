// models/CompanyDocument.js
const mongoose = require("mongoose");

const companyDocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    category: {
      type: String,
      enum: [
        "policy",
        "performance-letter",
        "promotion-letter",
        "lnd-letter",
        "warning-letter",
        "template",
        "announcement",
        "other",
      ],
      required: true,
    },

    fileUrl: { type: String, required: true },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    visibility: {
      type: String,
      enum: ["all", "managers", "department", "team", "individual"],
      default: "all",
    },

    department: { type: String, default: null },

    allowedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CompanyDocument", companyDocumentSchema);
