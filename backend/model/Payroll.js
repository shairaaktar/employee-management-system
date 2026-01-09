const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  month: { type: String, required: true },
  year:{type:Number},
  baseSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 }, 
  finalSalary: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved","processing", "Paid","Failed"],
    default: "Pending",
  },
  generatedAt: { type: Date, default: Date.now },
  paymentIntentId:{type:String},
  receiptUrl:{type:String},
  paidAt:{type:Date},

},{timestamps:true});

module.exports = mongoose.model("Payroll", payrollSchema);
