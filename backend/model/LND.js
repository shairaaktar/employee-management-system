const mongoose = require("mongoose");

const learningPlanSchema = new mongoose.Schema(
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
    focusAreas: [String], 
    assignedCourses: [String], 
    deadline: Date,
    completionStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    hrNotes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("LND", learningPlanSchema);
