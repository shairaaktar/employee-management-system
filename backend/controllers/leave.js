const Leave = require("../model/Leave");
const Employee=require("../model/Employee")
const { sendNotificationEmail } = require("../utils/sendNotificationEmail");
const {sendSocketNotification}=require("../utils/sendSocketNotification")



exports.requestLeave = async (req, res) => {
  try {
    const leave = await Leave.create({
      user: req.user._id,
      reason: req.body.reason,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    res.status(201).json({ message: "Leave requested", leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateLeaveStatus = async (req, res) => {
  try {
   
     const {managerFeedback}=req.body;


    const leave = await Leave.findById(req.params.id).populate("user", "email");
    if (!leave) return res.status(404).json({ message: "Leave not found" });


    const manager = await Employee.findOne({ userAccount: req.user._id });
    if (String(leave.employee.manager) !== String(manager._id))
      return res.status(403).json({ message: "Unauthorized" });

    leave.managerFeedback = managerFeedback || "";
    
    leave.status = req.body.status;

    await leave.save();

    //  await sendEmail(
    //   leave.employee.email,
    //   `Leave Request ${status}`,
    //   `Your leave request from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} has been ${status.toLowerCase()}.`
    // );

    await sendSocketNotification(
  leave.user._id,
  `Your leave from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} was ${leave.status.toLowerCase()}.`,
  "Leave"
);


    await sendNotificationEmail(
      leave.user.email,
      `Leave ${leave.status}`,
      `Your leave from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} was ${leave.status.toLowerCase()}.`
    );

    res.json({ message: `Leave ${leave.status}`, leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLeavesForManager = async (req, res) => {
  try {
    const manager = await Employee.findOne({ userAccount: req.user._id });
    if (!manager) return res.status(404).json({ message: "Manager profile not found" });

    const team = await Employee.find({ manager: manager._id });
    const teamIds = team.map((e) => e._id);

    const leaves = await Leave.find({ employee: { $in: teamIds } })
      .populate("employee", "name email department")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
