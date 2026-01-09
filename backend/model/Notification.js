
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["Payroll", "Leave", "Document", "Performance", "General","Task"],
      default: "General",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
