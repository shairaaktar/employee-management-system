


const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  title: String,
  description: String,
  weight: Number,
  progress: { type: Number, default: 0 },
});

const performanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    period: String, // e.g. Q1 2025
    selfRating: Number,
    selfFeedback: String,
    goals: [goalSchema],

    managerRating: Number,
    managerFeedback: String,
    hrRating: Number,
    hrFeedback: String,

    overallScore: Number,
    calibratedScore: Number, // weighted final

    promotionRecommended: { type: Boolean, default: false },
    lndRecommended: { type: Boolean, default: false },
    linkedPayroll: { type: mongoose.Schema.Types.ObjectId, ref: "Payroll" },
    status: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Manager Reviewed",
        "HR Reviewed",
        "Finalized",
      ],
      default: "Draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Performance", performanceSchema);
