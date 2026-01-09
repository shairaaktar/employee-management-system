const User = require("../model/User");
const Department = require("../model/Department");
const Payroll = require("../model/Payroll");
const Performance = require("../model/Performance");
const Attendance = require("../model/Attendance");
const Employee=require("../model/Employee")


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createDepartment = async (req, res) => {
  try {
    const dept = await Department.create({ name: req.body.name });
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDepartments = async (req, res) => {
  const depts = await Department.find();
  res.json(depts);
};

exports.deleteDepartment = async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ message: "Department deleted" });
};


exports.updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = req.body.role;
  await user.save();
  res.json({ message: "Role updated", user });
};


exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHR = await User.countDocuments({ role: "HR" });
    const totalEmployees = await User.countDocuments({ role: "Employee" });
    const totalPayroll = await Payroll.aggregate([{ $group: { _id: null, total: { $sum: "$finalSalary" } } }]);
    const avgPerformance = await Performance.aggregate([{ $group: { _id: null, avg: { $avg: "$overallScore" } } }]);
    const attendanceCount = await Attendance.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

    res.json({
      totalUsers,
      totalHR,
      totalEmployees,
      totalPayroll: totalPayroll[0]?.total || 0,
      avgPerformance: avgPerformance[0]?.avg?.toFixed(2) || 0,
      attendanceCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) return res.status(400).json({ message: "Role is required" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.roles.includes(role)) {
      user.roles.push(role);
      await user.save();
    }

    res.json({ message: `${role} role assigned`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllManagers = async (req, res) => {
  try {
    const managers = await Employee.find()
      .populate({
        path: "userAccount",
        match: { roles: { $in: ["manager"] } },
        select: "name email roles",
      })
      .select("name department email userAccount")
      .lean();


    const filteredManagers = managers.filter((m) => m.userAccount);

    res.json(filteredManagers);
  } catch (err) {
    console.error("Error fetching managers:", err);
    res.status(500).json({ message: "Server error fetching managers" });
  }
};
