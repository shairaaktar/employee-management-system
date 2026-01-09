const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
 roles: {
      type: [String],
      enum: ["employee", "manager", "hr", "admin"],
      default: ["employee"], 
    },
  salary: { type: Number, required: true },
  joinDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Active", "On Leave", "Resigned"],
    default: "Active",
  },

  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    default: null,
  },
  manager:{type:mongoose.Schema.Types.ObjectId,ref:"Employee",default:null},
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],

}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
