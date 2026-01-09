const mongoose = require("mongoose");

const communicationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["announcement", "feedback", "kudos"],
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", 
      default: null,
    },
    title: { type: String },
    message: { type: String, required: true },
    department: { type: String, default: null }, 
    visibility: {
      type: String,
      enum: ["all", "team", "individual"],
      default: "team",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Communication", communicationSchema);
