const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    performance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Performance",
    },
    currentRole: String,
    proposedRole: String,
    currentSalary: Number,
    proposedSalary: Number,
    justification: String,
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    effectiveDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promotion", promotionSchema);
