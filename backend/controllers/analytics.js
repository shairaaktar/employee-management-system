const User = require("../model/User");
const Task = require("../model/Task");
const Employee = require("../model/Employee");
const Payroll = require("../model/Payroll"); // We'll add this model later, so ignore the error for now
const Attendance=require("../model/Attendance")



exports.getHRStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const totalPayroll = await Payroll.aggregate([
      { $group: { _id: null, total: { $sum: "$finalSalary" } } },
    ]);

    const departments = await Employee.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    const attendanceStats = await Attendance.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      totalEmployees,
      completedTasks,
      totalPayroll: totalPayroll[0]?.total || 0,
      departments,
      attendanceStats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
