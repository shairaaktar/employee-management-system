const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: { type: String, required: true },
    fileType: { type: String },
    filePath: { type: String, required: true },
    category: {
      type: String,
      enum: ["Resume", "ID Proof", "Certificate", "Payslip", "Other"],
      default: "Other",
    },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
